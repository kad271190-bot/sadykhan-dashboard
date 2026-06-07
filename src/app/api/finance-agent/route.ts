import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import * as XLSX from 'xlsx';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface SheetData {
  name: string;
  headers: string[];
  rows: (string | number | null)[][];
  summary: string;
}

function parseExcel(buffer: ArrayBuffer): SheetData[] {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheets: SheetData[] = [];

  for (const sheetName of workbook.SheetNames) {
    const ws = workbook.Sheets[sheetName];
    const raw = XLSX.utils.sheet_to_json<(string | number | null)[]>(ws, {
      header: 1,
      defval: null,
      blankrows: false,
    }) as (string | number | null)[][];

    if (raw.length === 0) continue;

    const headers = (raw[0] ?? []).map((h) => String(h ?? ''));
    const rows = raw.slice(1).filter((r) => r.some((c) => c !== null && c !== ''));

    const preview = rows.slice(0, 50);
    const summary = `Вкладка: "${sheetName}" | Колонок: ${headers.length} | Строк данных: ${rows.length}`;

    sheets.push({ name: sheetName, headers, rows: preview, summary });
  }

  return sheets;
}

function sheetsToText(sheets: SheetData[]): string {
  return sheets
    .map((s) => {
      const colLine = `Колонки: ${s.headers.join(' | ')}`;
      const rowLines = s.rows
        .map((r) => r.map((c) => (c === null ? '' : String(c))).join(' | '))
        .join('\n');
      return `\n## ${s.summary}\n${colLine}\n${rowLines}`;
    })
    .join('\n\n');
}

const SYSTEM_PROMPT = `Ты — финансовый аналитик компании Sadykhan (сеть аптек в Казахстане).
Твоя задача — изучать финансовые данные, формировать P&L отчёты, анализировать доходы и расходы, определять состояние компании.

Правила:
1. Когда данных достаточно — формируй структурированный отчёт с разделами: Выручка, Себестоимость, Валовая прибыль, Операционные расходы, EBITDA, Чистая прибыль, Ключевые риски, Рекомендации.
2. Когда данных НЕ ДОСТАТОЧНО — явно укажи чего не хватает и задай конкретные уточняющие вопросы пользователю. Не выдумывай цифры.
3. Всегда указывай валюту (₸ — казахстанские тенге, если не указано иное).
4. Используй markdown-форматирование: заголовки (##), таблицы, жирный текст для ключевых цифр.
5. Если в данных есть несколько периодов — сравнивай их и показывай динамику (рост/падение в % и абсолютных значениях).
6. Выявляй аномалии: резкий рост расходов, падение маржи, кассовые разрывы.
7. В конце каждого отчёта добавляй раздел "🚨 Ключевые риски" и "💡 Рекомендации".
8. Если пользователь пишет просто вопрос без файла — отвечай как финансовый консультант, задавай вопросы для уточнения.`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const message = formData.get('message') as string | null;
    const historyRaw = formData.get('history') as string | null;

    const history: { role: 'user' | 'assistant'; content: string }[] = historyRaw
      ? JSON.parse(historyRaw)
      : [];

    let userContent = message || '';

    if (file) {
      const buffer = await file.arrayBuffer();
      const sheets = parseExcel(buffer);

      if (sheets.length === 0) {
        return NextResponse.json({ error: 'Excel файл пустой или не читается' }, { status: 400 });
      }

      const dataText = sheetsToText(sheets);
      const sheetNames = sheets.map((s) => s.name).join(', ');

      userContent =
        `Загружен Excel файл: "${file.name}"\nВкладки: ${sheetNames}\n\n` +
        `ДАННЫЕ ИЗ ФАЙЛА:\n${dataText}\n\n` +
        (message ? `Задание пользователя: ${message}` : 'Проанализируй эти данные и составь финансовый отчёт о состоянии компании.');
    }

    if (!userContent.trim()) {
      return NextResponse.json({ error: 'Нет данных для анализа' }, { status: 400 });
    }

    const messages: Anthropic.MessageParam[] = [
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: userContent },
    ];

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages,
    });

    const assistantText =
      response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({
      reply: assistantText,
      usage: response.usage,
    });
  } catch (err) {
    console.error('Finance agent error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
