'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  fileName?: string;
}

function MarkdownBlock({ text }: { text: string }) {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  const flushTable = (key: string) => {
    if (tableRows.length === 0) return;
    const [header, , ...body] = tableRows;
    result.push(
      <div key={key} className="overflow-x-auto my-3">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {(header ?? []).map((h, i) => (
                <th key={i} className="px-3 py-2 text-left font-semibold border-b border-white/20 text-teal-300">
                  {h.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white/5' : ''}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-1.5 border-b border-white/10 text-white/80">
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  };

  lines.forEach((line, i) => {
    if (line.startsWith('|')) {
      inTable = true;
      tableRows.push(line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1));
      return;
    }
    if (inTable) {
      flushTable(`tbl-${i}`);
      inTable = false;
    }

    if (line.startsWith('### ')) {
      result.push(<h3 key={i} className="text-base font-semibold text-teal-300 mt-4 mb-1">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      result.push(<h2 key={i} className="text-lg font-bold text-teal-400 mt-5 mb-2 border-b border-white/10 pb-1">{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      result.push(<h1 key={i} className="text-xl font-bold text-white mt-4 mb-2">{line.slice(2)}</h1>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      result.push(
        <div key={i} className="flex gap-2 text-sm text-white/80 my-0.5 ml-2">
          <span className="text-teal-400 mt-0.5">•</span>
          <span dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(2)) }} />
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)?.[1];
      result.push(
        <div key={i} className="flex gap-2 text-sm text-white/80 my-0.5 ml-2">
          <span className="text-teal-400 font-bold w-5">{num}.</span>
          <span dangerouslySetInnerHTML={{ __html: inlineMd(line.replace(/^\d+\.\s/, '')) }} />
        </div>
      );
    } else if (line.trim() === '') {
      result.push(<div key={i} className="h-2" />);
    } else {
      result.push(
        <p key={i} className="text-sm text-white/85 my-0.5 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: inlineMd(line) }} />
      );
    }
  });

  if (inTable) flushTable('tbl-end');

  return <div>{result}</div>;
}

function inlineMd(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-white/90">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-white/10 px-1 rounded text-teal-300 font-mono text-xs">$1</code>');
}

export default function FinanceAgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        '## Финансовый аналитик Sadykhan\n\nЗдравствуйте! Я ваш финансовый аналитик.\n\n**Что я умею:**\n- Читать Excel-файлы с несколькими вкладками (P&L, баланс, БДДС и т.д.)\n- Формировать отчёт P&L (доходы, расходы, прибыль)\n- Анализировать состояние компании и выявлять риски\n- Сравнивать периоды и показывать динамику\n- Задавать уточняющие вопросы, когда данных недостаточно\n\n**Как начать:**\nЗагрузите Excel-файл с финансовыми данными или задайте вопрос.',
    },
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send() {
    if (!input.trim() && !file) return;
    setError('');

    const userMsg: Message = {
      role: 'user',
      content: input || (file ? `Анализируй файл: ${file.name}` : ''),
      fileName: file?.name,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    const history = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }));

    const fd = new FormData();
    if (file) fd.append('file', file);
    if (input) fd.append('message', input);
    fd.append('history', JSON.stringify(history));

    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    try {
      const res = await fetch('/api/finance-agent', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка сервера');

      setMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const quickPrompts = [
    'Составь P&L отчёт за последний период',
    'Проанализируй динамику доходов и расходов',
    'Найди аномалии и риски в данных',
    'Рассчитай рентабельность по каждому направлению',
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: '#0A2218' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10" style={{ background: '#0D2B1F' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#1D9E75' }}>
          📊
        </div>
        <div>
          <div className="font-semibold text-white">Финансовый аналитик</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            AI-агент · Claude Opus · Анализ P&amp;L, Excel, финотчётность
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs text-teal-400">Онлайн</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm mr-3 mt-1 shrink-0" style={{ background: '#1D9E75' }}>
                📊
              </div>
            )}
            <div
              className={`max-w-3xl rounded-2xl px-4 py-3 ${
                m.role === 'user'
                  ? 'rounded-br-sm'
                  : 'rounded-bl-sm'
              }`}
              style={{
                background: m.role === 'user' ? '#1D9E75' : 'rgba(255,255,255,0.06)',
                border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}
            >
              {m.fileName && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/20">
                  <span className="text-lg">📎</span>
                  <span className="text-xs text-white/70">{m.fileName}</span>
                </div>
              )}
              {m.role === 'assistant' ? (
                <MarkdownBlock text={m.content} />
              ) : (
                <p className="text-sm text-white whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm mr-3 shrink-0" style={{ background: '#1D9E75' }}>
              📊
            </div>
            <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </div>
                Анализирую данные...
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            ⚠️ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-6 pb-2 flex flex-wrap gap-2">
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => setInput(p)}
              className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-teal-400 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* File preview */}
      {file && (
        <div className="px-6 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(29,158,117,0.15)', border: '1px solid rgba(29,158,117,0.3)' }}>
            <span className="text-lg">📊</span>
            <span className="text-sm text-teal-300 flex-1 truncate">{file.name}</span>
            <button
              onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              className="text-white/40 hover:text-white/80 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-6 pb-5 pt-2">
        <div className="flex gap-2 items-end rounded-2xl p-2 pl-4" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.xlsm,.csv"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Загрузить Excel"
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg transition-colors hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            📎
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Задайте вопрос или загрузите Excel-файл..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 resize-none outline-none py-2 min-h-[36px] max-h-[120px]"
            style={{ lineHeight: '1.5' }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={send}
            disabled={loading || (!input.trim() && !file)}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
            style={{ background: '#1D9E75' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
            </svg>
          </button>
        </div>
        <div className="text-center text-xs mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Поддерживаются файлы .xlsx, .xls, .xlsm · Enter для отправки
        </div>
      </div>
    </div>
  );
}
