'use client';
import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// ─── Real data from your dashboard ───────────────────────
const RATING_HISTORY = [
  { month: 'Июн 25', rating: 3.74, negative: 58 },
  { month: 'Июл 25', rating: 3.68, negative: 64 },
  { month: 'Авг 25', rating: 3.62, negative: 71 },
  { month: 'Сен 25', rating: 3.58, negative: 74 },
  { month: 'Окт 25', rating: 3.54, negative: 78 },
  { month: 'Ноя 25', rating: 3.51, negative: 74 },
  { month: 'Дек 25', rating: 3.49, negative: 76 },
  { month: 'Янв 26', rating: 3.45, negative: 98 },
  { month: 'Фев 26', rating: 3.43, negative: 94 },
  { month: 'Мар 26', rating: 3.44, negative: 102 },
  { month: 'Апр 26', rating: 3.46, negative: 98 },
  { month: 'Май 26', rating: 3.48, negative: 72 },
];

const NPS_BY_BRANCH = [
  { name: 'Мамыр-2 (новый)', nps: 72, promoters: 78, neutrals: 16, detractors: 6 },
  { name: 'Аптека №23 (Тараз)', nps: 58, promoters: 70, neutrals: 18, detractors: 12 },
  { name: 'Сейфуллина, 422', nps: 34, promoters: 52, neutrals: 30, detractors: 18 },
  { name: 'Астана, Анет баба', nps: 22, promoters: 45, neutrals: 32, detractors: 23 },
  { name: 'Астана, Момышулы', nps: 18, promoters: 42, neutrals: 34, detractors: 24 },
  { name: 'Аптека №6', nps: 12, promoters: 38, neutrals: 36, detractors: 26 },
  { name: 'Аптека №3', nps: 8, promoters: 35, neutrals: 38, detractors: 27 },
  { name: 'Аптека №2 (Гоголя)', nps: -14, promoters: 22, neutrals: 42, detractors: 36 },
  { name: 'Нурлы тан', nps: -22, promoters: 18, neutrals: 42, detractors: 40 },
  { name: 'Аптека №12 (Достык)', nps: -28, promoters: 16, neutrals: 40, detractors: 44 },
  { name: 'Аптека №9', nps: -44, promoters: 10, neutrals: 36, detractors: 54 },
  { name: 'Аптека №17', nps: -52, promoters: 8, neutrals: 32, detractors: 60 },
  { name: 'Байтерекова, 53', nps: -68, promoters: 5, neutrals: 22, detractors: 73 },
];

const NPS_HISTORY = [
  { month: 'Июн 25', nps: 12 },
  { month: 'Июл 25', nps: 8 },
  { month: 'Авг 25', nps: 4 },
  { month: 'Сен 25', nps: 2 },
  { month: 'Окт 25', nps: -2 },
  { month: 'Ноя 25', nps: -4 },
  { month: 'Дек 25', nps: -4 },
  { month: 'Янв 26', nps: -6 },
  { month: 'Фев 26', nps: -8 },
  { month: 'Мар 26', nps: -6 },
  { month: 'Апр 26', nps: -4 },
  { month: 'Май 26', nps: -3 },
];

const COMPLAINT_STATS = [
  { label: 'Грубость персонала', count: 312 },
  { label: 'Долгое ожидание', count: 231 },
  { label: 'Нет нужного товара', count: 184 },
  { label: 'Высокие цены', count: 136 },
  { label: 'Чистота', count: 98 },
  { label: 'Некомпетентность', count: 72 },
];

// ─── Helpers ──────────────────────────────────────────────
function getNPSColor(nps: number) {
  if (nps >= 50) return '#22c55e';
  if (nps >= 30) return '#1D9E75';
  if (nps >= 0) return '#f59e0b';
  if (nps >= -20) return '#f97316';
  return '#ef4444';
}

function getNPSLabel(nps: number) {
  if (nps >= 50) return 'Отлично';
  if (nps >= 30) return 'Хорошо';
  if (nps >= 0) return 'Удовл.';
  if (nps >= -20) return 'Плохо';
  return 'Критично';
}

const tooltipStyle = {
  contentStyle: {
    background: '#0D2B1F',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    fontSize: 12,
    color: '#fff',
  },
  labelStyle: { color: 'rgba(255,255,255,0.6)' },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs uppercase tracking-widest font-semibold mb-3"
      style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
      {children}
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl p-4 border border-white/10 ${className}`}
      style={{ background: 'rgba(255,255,255,0.04)' }}>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function ReputationNPSPage() {
  const [tab, setTab] = useState<'reputation' | 'nps'>('reputation');
  const [npsTab, setNpsTab] = useState<'overview' | 'branches' | 'history'>('overview');

  return (
    <div>
      {/* Top tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit" style={{ background: 'rgba(255,255,255,0.06)' }}>
        {[
          { id: 'reputation', label: '⭐ Репутация и рейтинг' },
          { id: 'nps', label: '💚 NPS отчёт' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className="px-5 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
            style={{
              background: tab === t.id ? '#1D9E75' : 'transparent',
              color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.5)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── РЕПУТАЦИЯ ── */}
      {tab === 'reputation' && (
        <div>
          {/* KPI cards */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Ср. рейтинг сети', value: '3.48', delta: '↓ −0.14 vs пр. мес.', color: '#f59e0b' },
              { label: 'Всего отзывов', value: '4 182', delta: '↑ +312 за месяц', color: '#1D9E75' },
              { label: 'Негативных', value: '1 063', delta: '25.4% от всех', color: '#ef4444' },
              { label: 'Без ответа', value: '567', delta: '18% не отвечено', color: '#f97316' },
            ].map(k => (
              <Card key={k.label}>
                <div className="text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{k.label}</div>
                <div className="text-2xl font-bold mb-1" style={{ color: k.color }}>{k.value}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{k.delta}</div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Динамика рейтинга */}
            <Card>
              <SectionTitle>Динамика рейтинга сети (12 месяцев)</SectionTitle>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={RATING_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} />
                  <YAxis domain={[3.2, 4.0]} tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} tickFormatter={v => v.toFixed(1)} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [v.toFixed(2), 'Рейтинг']} />
                  <Line type="monotone" dataKey="rating" stroke="#1D9E75" strokeWidth={2}
                    dot={{ r: 3, fill: '#1D9E75' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Негативные отзывы */}
            <Card>
              <SectionTitle>Негативные отзывы по месяцам</SectionTitle>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={RATING_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [v, 'Негативных']} />
                  <Bar dataKey="negative" radius={[3, 3, 0, 0]}>
                    {RATING_HISTORY.map((entry, i) => (
                      <Cell key={i} fill={entry.negative > 90 ? '#ef4444' : entry.negative > 70 ? '#f59e0b' : '#1D9E75'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Топ жалоб */}
            <Card>
              <SectionTitle>Топ категорий жалоб</SectionTitle>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={COMPLAINT_STATS} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 110 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} tickLine={false} width={110} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [v, 'Жалоб']} />
                  <Bar dataKey="count" radius={[0, 3, 3, 0]}>
                    {COMPLAINT_STATS.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? '#ef4444' : i <= 2 ? '#f97316' : '#1D9E75'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* По источникам */}
            <Card>
              <SectionTitle>Рейтинг по источникам</SectionTitle>
              <div className="space-y-3 mt-2">
                {[
                  { name: '2ГИС', rating: 3.5, pct: 70, color: '#1D9E75' },
                  { name: 'Google', rating: 3.3, pct: 66, color: '#4285F4' },
                  { name: 'Яндекс', rating: 3.6, pct: 72, color: '#FFCC00' },
                  { name: 'Glovo', rating: 3.75, pct: 75, color: '#F97316' },
                ].map(s => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-xs w-16 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.name}</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }}></div>
                    </div>
                    <span className="text-xs font-bold text-white w-12 text-right">{s.rating} ★</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <SectionTitle>Доп. метрики</SectionTitle>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Ср. время ответа', value: '8.2 ч', color: '#f59e0b', sub: 'Цель: < 4 ч' },
                    { label: 'AI Health Score', value: '44/100', color: '#f97316', sub: '↓ −6 за неделю' },
                    { label: 'Отвечено %', value: '82%', color: '#1D9E75', sub: '↑ +3 vs пр. мес.' },
                    { label: 'Активных жалоб', value: '31', color: '#ef4444', sub: '4 кризисных' },
                  ].map(m => (
                    <div key={m.label} className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{m.label}</div>
                      <div className="text-base font-bold" style={{ color: m.color }}>{m.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── NPS ОТЧЁТ ── */}
      {tab === 'nps' && (
        <div>
          {/* NPS summary */}
          <Card className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: '#1D9E75' }}>N</div>
              <div>
                <div className="text-sm font-bold text-white">NPS — Индекс лояльности клиентов</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Net Promoter Score · Май 2026</div>
              </div>
              <div className="ml-auto flex gap-1">
                {(['overview', 'branches', 'history'] as const).map(t => (
                  <button key={t} onClick={() => setNpsTab(t)}
                    className="text-xs px-3 py-1.5 rounded-lg border transition-all"
                    style={{
                      background: npsTab === t ? '#1D9E75' : 'transparent',
                      borderColor: npsTab === t ? '#1D9E75' : 'rgba(255,255,255,0.15)',
                      color: npsTab === t ? '#fff' : 'rgba(255,255,255,0.5)',
                    }}>
                    {t === 'overview' ? 'Обзор' : t === 'branches' ? 'Филиалы' : 'История'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: 'NPS сети', value: '-3', color: '#f97316' },
                { label: 'Промоутеры', value: '32%', color: '#22c55e' },
                { label: 'Нейтральные', value: '33%', color: '#f59e0b' },
                { label: 'Критики', value: '35%', color: '#ef4444' },
              ].map(k => (
                <div key={k.label} className="text-center rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{k.label}</div>
                  <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* NPS bar */}
            <div className="flex rounded-full overflow-hidden h-2.5 mb-1">
              <div style={{ width: '32%', background: '#22c55e' }} />
              <div style={{ width: '33%', background: '#f59e0b' }} />
              <div style={{ width: '35%', background: '#ef4444' }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <span>Промоутеры 32%</span>
              <span>Нейтральные 33%</span>
              <span>Критики 35%</span>
            </div>
          </Card>

          {/* Overview tab */}
          {npsTab === 'overview' && (
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <SectionTitle>Динамика NPS (12 месяцев)</SectionTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={NPS_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} />
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [v > 0 ? `+${v}` : v, 'NPS']} />
                    <Line type="monotone" dataKey="nps" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3, fill: '#1D9E75' }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <SectionTitle>AI-рекомендации по NPS</SectionTitle>
                <div className="space-y-2">
                  {[
                    { dot: '#ef4444', text: 'Байтерекова, №17, №9 — NPS ниже −40. Срочный аудит.' },
                    { dot: '#f97316', text: 'Грубость персонала снижает NPS на 20+ пунктов.' },
                    { dot: '#f59e0b', text: 'Цены выше рынка снижают NPS на 8–12 пунктов.' },
                    { dot: '#1D9E75', text: 'Мамыр-2 NPS +72 — эталон для сети. Изучить и тиражировать.' },
                    { dot: '#22c55e', text: 'Рост ответов до 95% даст +6–8 пунктов NPS.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2.5 p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: item.dot }}></div>
                      <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.text}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 rounded-lg text-xs" style={{ background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.2)' }}>
                  <span className="font-semibold text-teal-400">Прогноз AI:</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}> При устранении топ-3 проблем NPS вырастет до </span>
                  <span className="font-bold text-teal-400">+15..+25</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}> за 3 месяца.</span>
                </div>
              </Card>
            </div>
          )}

          {/* Branches tab */}
          {npsTab === 'branches' && (
            <div className="rounded-xl overflow-hidden border border-white/10">
              <div className="px-4 py-3 border-b border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="text-xs font-semibold text-white">NPS по филиалам · Май 2026</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                      {['Филиал', 'NPS', 'Промоутеры', 'Нейтральные', 'Критики', 'Статус'].map(h => (
                        <th key={h} className="text-left py-2 px-4 text-xs font-medium uppercase tracking-wider"
                          style={{ color: 'rgba(255,255,255,0.3)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {NPS_BY_BRANCH.map((b, i) => (
                      <tr key={b.name} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                        <td className="py-2.5 px-4 text-xs font-medium text-white">{b.name}</td>
                        <td className="py-2.5 px-4">
                          <span className="text-sm font-bold" style={{ color: getNPSColor(b.nps) }}>
                            {b.nps > 0 ? '+' : ''}{b.nps}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-xs text-green-400">{b.promoters}%</td>
                        <td className="py-2.5 px-4 text-xs text-amber-400">{b.neutrals}%</td>
                        <td className="py-2.5 px-4 text-xs text-red-400">{b.detractors}%</td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                              <div className="h-full rounded-full" style={{
                                width: `${Math.max(5, (b.nps + 100) / 2)}%`,
                                background: getNPSColor(b.nps)
                              }} />
                            </div>
                            <span className="text-xs font-medium whitespace-nowrap" style={{ color: getNPSColor(b.nps) }}>
                              {getNPSLabel(b.nps)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* History tab */}
          {npsTab === 'history' && (
            <Card>
              <SectionTitle>NPS по месяцам</SectionTitle>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={NPS_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickLine={false} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [v > 0 ? `+${v}` : v, 'NPS']} />
                  <Bar dataKey="nps" radius={[4, 4, 0, 0]}>
                    {NPS_HISTORY.map((entry, i) => (
                      <Cell key={i} fill={getNPSColor(entry.nps)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 p-3 rounded-lg text-xs" style={{ background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.2)' }}>
                <span className="font-semibold text-teal-400">Прогноз AI:</span>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}> При устранении топ-3 проблем NPS вырастет до </span>
                <span className="font-bold text-teal-400">+15..+25</span>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}> за 3 месяца.</span>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
