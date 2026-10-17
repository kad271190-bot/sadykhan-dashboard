'use client';
import { useMemo, useState } from 'react';
import type {
  ActionType, AgentLogEntry, AgentManifest, ApprovalDecision, CaseStatus, Direction,
  RiskCategory, Role, SolutionKind,
} from '@/lib/control/types';
import {
  ACTION_POLICY, CATEGORY_LABEL, DIRECTION_LABEL, LEVEL_LABEL, ROLE_LABEL,
  approvalOutcome, riskScore, scoreLevel, validateManifest,
} from '@/lib/control/policy';
import { AGENTS, agentById } from '@/lib/control/registry';
import { AGENT_LOG, APPROVALS, CASES, IS_DEMO, RISK_OBJECTS } from '@/lib/control/demo';
import { SCENARIOS } from '@/lib/control/scenarios';

export type ControlView = 'hub' | 'cases' | 'approvals' | 'agents' | 'scenarios' | 'log';

const MUTED = 'rgba(255,255,255,0.5)';
const FAINT = 'rgba(255,255,255,0.35)';
const PANEL = 'rgba(255,255,255,0.05)';

const LEVEL_COLOR = {
  crit: { text: 'text-red-400', bg: 'rgba(239,68,68,0.15)', badge: 'bg-red-500/20 text-red-400' },
  warn: { text: 'text-orange-400', bg: 'rgba(249,115,22,0.15)', badge: 'bg-orange-500/20 text-orange-400' },
  ok:   { text: 'text-teal-400', bg: 'rgba(29,158,117,0.15)', badge: 'bg-teal-500/20 text-teal-400' },
  info: { text: 'text-sky-400', bg: 'rgba(56,189,248,0.12)', badge: 'bg-sky-500/20 text-sky-400' },
};

const STATUS_LABEL: Record<CaseStatus, string> = {
  new: 'Новый',
  investigating: 'Расследование',
  awaiting_approval: 'Ждёт согласования',
  in_progress: 'Устраняется',
  verification: 'Проверка исполнения',
  closed: 'Закрыт',
};

const KIND_LABEL: Record<SolutionKind, string> = {
  automation: 'Классическая автоматизация',
  analytics: 'Аналитическая модель',
  assistant: 'ИИ-ассистент',
  agent: 'Автономный ИИ-агент',
};

const AGENT_STATUS_LABEL = { active: 'Работает', pilot: 'Пилот', planned: 'Запланирован' };

const fmtKZT = (n: number) =>
  n >= 1_000_000 ? `₸${(n / 1_000_000).toFixed(1)}М` : n >= 1000 ? `₸${Math.round(n / 1000)}К` : `₸${n}`;

const agentName = (id: string) => agentById(id)?.name ?? id;
const objectName = (id: string) => RISK_OBJECTS.find(o => o.id === id)?.name ?? id;

// ─── UI primitives ───────────────────────────────────────
function Panel({ title, subtitle, children }: { title?: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 mb-3 border border-white/10" style={{ background: PANEL }}>
      {title && (
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-sm font-semibold text-white">{title}</span>
          {subtitle && <span className="text-xs text-right" style={{ color: FAINT }}>{subtitle}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function Kpi({ label, value, hint, tone = 'gray' }: { label: string; value: string; hint?: string; tone?: 'crit' | 'warn' | 'ok' | 'gray' }) {
  const color = tone === 'gray' ? 'text-white' : LEVEL_COLOR[tone].text;
  return (
    <div className="rounded-xl p-4 border border-white/10" style={{ background: PANEL }}>
      <div className="text-xs mb-1.5" style={{ color: MUTED }}>{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {hint && <div className="text-xs mt-1" style={{ color: FAINT }}>{hint}</div>}
    </div>
  );
}

function Badge({ tone, children }: { tone: keyof typeof LEVEL_COLOR | 'gray'; children: React.ReactNode }) {
  const cls = tone === 'gray' ? 'bg-white/5 text-white/50' : LEVEL_COLOR[tone].badge;
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${cls}`}>{children}</span>;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className="text-xs px-2.5 py-1 rounded-full border transition-all"
      style={{
        borderColor: active ? '#1D9E75' : 'rgba(255,255,255,0.1)',
        background: active ? 'rgba(29,158,117,0.2)' : 'transparent',
        color: active ? '#1D9E75' : MUTED,
      }}>
      {children}
    </button>
  );
}

function DemoBanner() {
  if (!IS_DEMO) return null;
  return (
    <div className="text-xs px-3 py-2 rounded-lg mb-3 border border-orange-500/30" style={{ background: 'rgba(249,115,22,0.08)', color: '#FDBA74' }}>
      <i className="ti ti-flask text-xs mr-1"></i>
      Демо-данные. Цифры и объекты условные — заменяются реальными после подключения 1С, ОФД, агрегаторов и Bitrix24.
    </div>
  );
}

// ─── Hub: центр контроля группы ──────────────────────────
const DIRECTIONS = Object.keys(DIRECTION_LABEL) as Direction[];
const CATEGORIES = Object.keys(CATEGORY_LABEL) as RiskCategory[];

function heatTone(v: number) {
  if (v >= 0.6) return { bg: `rgba(239,68,68,${0.25 + v * 0.5})`, fg: '#fff' };
  if (v >= 0.35) return { bg: `rgba(249,115,22,${0.2 + v * 0.4})`, fg: '#fff' };
  if (v > 0) return { bg: 'rgba(29,158,117,0.25)', fg: 'rgba(255,255,255,0.7)' };
  return { bg: 'rgba(255,255,255,0.03)', fg: FAINT };
}

function Hub({ drill, approvalsPending }: { drill: (f: CaseFilter) => void; approvalsPending: number }) {
  const scored = useMemo(
    () => RISK_OBJECTS.map(o => ({ ...o, score: riskScore(o) })).sort((a, b) => b.score - a.score),
    [],
  );
  const open = CASES.filter(c => c.status !== 'closed');
  const crit = open.filter(c => c.severity === 'crit');
  const exposure = open.reduce((s, c) => s + (c.exposure ?? 0), 0);
  const overdue = open.filter(c => c.dueAt < '2026-10-17').length;

  const matrix = DIRECTIONS.map(d => ({
    d,
    cells: CATEGORIES.map(c => {
      const vals = RISK_OBJECTS.filter(o => o.direction === d).map(o => o.signals[c] ?? 0);
      return vals.length ? Math.max(...vals) : 0;
    }),
  }));

  return (
    <div>
      <DemoBanner />
      <div className="grid gap-3 mb-4 grid-cols-2 lg:grid-cols-4">
        <Kpi label="Открытых кейсов" value={String(open.length)} hint={`${crit.length} критических`} tone="crit" />
        <Kpi label="Ждут вашего решения" value={String(approvalsPending)} hint="Human-in-the-loop" tone="warn" />
        <Kpi label="Оценка риска в кейсах" value={fmtKZT(exposure)} hint="по открытым кейсам" tone="warn" />
        <Kpi label="Просрочено" value={String(overdue)} hint="кейсов после срока" tone={overdue ? 'crit' : 'ok'} />
      </div>

      <Panel title="Тепловая карта рисков группы" subtitle="Нажмите на ячейку — откроются кейсы направления">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-separate" style={{ borderSpacing: 3, minWidth: 560 }}>
            <thead>
              <tr>
                <th className="text-left font-medium pb-1" style={{ color: FAINT }}>Направление</th>
                {CATEGORIES.map(c => <th key={c} className="font-medium pb-1" style={{ color: FAINT }}>{CATEGORY_LABEL[c]}</th>)}
              </tr>
            </thead>
            <tbody>
              {matrix.map(row => (
                <tr key={row.d}>
                  <td className="pr-2 py-1 text-white whitespace-nowrap">{DIRECTION_LABEL[row.d]}</td>
                  {row.cells.map((v, i) => {
                    const t = heatTone(v);
                    return (
                      <td key={i}>
                        <button onClick={() => drill({ direction: row.d, category: CATEGORIES[i] })}
                          className="w-full rounded-md py-1.5 text-center font-medium transition-transform hover:scale-105"
                          style={{ background: t.bg, color: t.fg }}
                          title={`${DIRECTION_LABEL[row.d]} · ${CATEGORY_LABEL[CATEGORIES[i]]}`}>
                          {v > 0 ? Math.round(v * 100) : '—'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-xs mt-2" style={{ color: FAINT }}>
          Значение — максимальный нормированный сигнал по объектам направления (0–100).
        </div>
      </Panel>

      <div className="grid gap-3 grid-cols-1 xl:grid-cols-2">
        <Panel title="Объекты с наибольшим риском" subtitle="аптеки, склады, контрагенты, каналы">
          {scored.slice(0, 7).map(o => {
            const lvl = scoreLevel(o.score);
            return (
              <button key={o.id} onClick={() => drill({ objectId: o.id })}
                className="w-full flex items-center gap-3 py-1.5 text-left hover:opacity-80">
                <span className="text-xs w-40 flex-shrink-0 truncate text-white">{o.name}</span>
                <span className="text-xs w-24 flex-shrink-0 truncate" style={{ color: FAINT }}>{DIRECTION_LABEL[o.direction]}</span>
                <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${o.score}%`,
                    background: lvl === 'crit' ? '#EF4444' : lvl === 'warn' ? '#F97316' : '#1D9E75',
                  }} />
                </div>
                <span className={`text-xs w-8 text-right font-semibold ${LEVEL_COLOR[lvl].text}`}>{o.score}</span>
              </button>
            );
          })}
        </Panel>

        <Panel title="Критические кейсы" subtitle="требуют решения сегодня">
          {crit.slice(0, 5).map(c => (
            <button key={c.id} onClick={() => drill({ objectId: c.objectId })}
              className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl mb-2 border border-white/5"
              style={{ background: LEVEL_COLOR.crit.bg }}>
              <i className="ti ti-alert-circle text-sm text-red-400 mt-0.5"></i>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white leading-relaxed">{c.title}</div>
                <div className="text-xs mt-0.5" style={{ color: FAINT }}>
                  {c.id} · {objectName(c.objectId)} · {STATUS_LABEL[c.status]}
                </div>
              </div>
              {c.exposure ? <span className="text-xs text-red-300 font-medium">{fmtKZT(c.exposure)}</span> : null}
            </button>
          ))}
        </Panel>
      </div>

      <Panel title="Состояние агентов контроля">
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map(a => (
            <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg border border-white/5" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${a.status === 'active' ? 'bg-teal-400' : a.status === 'pilot' ? 'bg-orange-400' : 'bg-gray-600'}`}></span>
              <span className="text-xs text-white truncate flex-1">{a.name}</span>
              <span className="text-xs" style={{ color: FAINT }}>{AGENT_STATUS_LABEL[a.status]}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ─── Cases ───────────────────────────────────────────────
export interface CaseFilter {
  direction?: Direction;
  category?: RiskCategory;
  objectId?: string;
}

function Cases({ filter, setFilter }: { filter: CaseFilter; setFilter: (f: CaseFilter) => void }) {
  const [showClosed, setShowClosed] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const list = CASES.filter(c =>
    (!filter.direction || c.direction === filter.direction) &&
    (!filter.category || c.category === filter.category) &&
    (!filter.objectId || c.objectId === filter.objectId) &&
    (showClosed || c.status !== 'closed'));

  return (
    <div>
      <DemoBanner />
      <div className="flex flex-wrap gap-1.5 mb-2">
        <Chip active={!filter.direction} onClick={() => setFilter({ ...filter, direction: undefined })}>Все направления</Chip>
        {DIRECTIONS.map(d => (
          <Chip key={d} active={filter.direction === d} onClick={() => setFilter({ ...filter, direction: d })}>{DIRECTION_LABEL[d]}</Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Chip active={!filter.category} onClick={() => setFilter({ ...filter, category: undefined })}>Все категории</Chip>
        {CATEGORIES.map(c => (
          <Chip key={c} active={filter.category === c} onClick={() => setFilter({ ...filter, category: c })}>{CATEGORY_LABEL[c]}</Chip>
        ))}
        <Chip active={showClosed} onClick={() => setShowClosed(!showClosed)}>Показать закрытые</Chip>
      </div>
      {filter.objectId && (
        <div className="text-xs mb-3 flex items-center gap-2" style={{ color: MUTED }}>
          Объект: <span className="text-white">{objectName(filter.objectId)}</span>
          <button className="text-teal-400" onClick={() => setFilter({ ...filter, objectId: undefined })}>сбросить</button>
        </div>
      )}

      {list.length === 0 && (
        <div className="text-xs p-4 rounded-xl border border-white/10" style={{ color: MUTED, background: PANEL }}>
          По выбранным фильтрам открытых кейсов нет.
        </div>
      )}

      {list.map(c => (
        <div key={c.id} className="rounded-xl mb-2 border border-white/10" style={{ background: PANEL }}>
          <button className="w-full text-left p-3 flex items-start gap-3" onClick={() => setOpenId(openId === c.id ? null : c.id)}>
            <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${c.severity === 'crit' ? 'bg-red-400' : c.severity === 'warn' ? 'bg-orange-400' : 'bg-sky-400'}`}></span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white font-medium leading-relaxed">{c.title}</div>
              <div className="text-xs mt-0.5" style={{ color: FAINT }}>
                {c.id} · {objectName(c.objectId)} · {DIRECTION_LABEL[c.direction]} · {CATEGORY_LABEL[c.category]} · срок {c.dueAt}
              </div>
            </div>
            <Badge tone={c.status === 'closed' ? 'ok' : c.status === 'awaiting_approval' ? 'warn' : 'gray'}>{STATUS_LABEL[c.status]}</Badge>
          </button>
          {openId === c.id && (
            <div className="px-3 pb-3 pl-8 text-xs space-y-2">
              <div style={{ color: MUTED }}>
                Открыл: <span className="text-white">{agentName(c.openedBy)}</span> · Владелец устранения:{' '}
                <span className="text-white">{ROLE_LABEL[c.owner]}</span>
                {c.exposure ? <> · Оценка риска: <span className="text-red-300">{fmtKZT(c.exposure)}</span></> : null}
              </div>
              <div>
                <div className="mb-1" style={{ color: FAINT }}>Доказательства</div>
                {c.evidence.map((e, i) => (
                  <div key={i} className="flex gap-2 py-0.5">
                    <span className="text-teal-400 flex-shrink-0">{e.source}:</span>
                    <span className="text-white/80">{e.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ color: FAINT }}>Агенты: {c.involvedAgents.map(agentName).join(', ')}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Approvals (Human-in-the-loop) ───────────────────────
type Decisions = Record<string, Partial<Record<Role, ApprovalDecision>>>;

function Approvals({ role, setRole, decisions, decide }: {
  role: Role; setRole: (r: Role) => void; decisions: Decisions;
  decide: (approvalId: string, decision: ApprovalDecision) => void;
}) {
  const approverRoles = Array.from(new Set(APPROVALS.flatMap(a => ACTION_POLICY[a.action].approvers)));
  return (
    <div>
      <DemoBanner />
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs" style={{ color: MUTED }}>Вы согласуете как:</span>
        {approverRoles.map(r => <Chip key={r} active={role === r} onClick={() => setRole(r)}>{ROLE_LABEL[r]}</Chip>)}
      </div>
      <div className="text-xs mb-3" style={{ color: FAINT }}>
        Агент только предлагает действие. Оно выполняется владельцем процесса после согласования всеми ролями из матрицы полномочий.
        Любой отказ отклоняет предложение. Все решения пишутся в журнал.
      </div>

      {APPROVALS.map(ap => {
        const policy = ACTION_POLICY[ap.action];
        const dec = decisions[ap.id] ?? {};
        const outcome = approvalOutcome(ap.action, dec);
        const c = CASES.find(x => x.id === ap.caseId);
        const canDecide = outcome === 'pending' && policy.approvers.includes(role) && !dec[role];
        return (
          <div key={ap.id} className="rounded-xl p-3 mb-2 border border-white/10" style={{ background: PANEL }}>
            <div className="flex flex-wrap items-start gap-2 mb-1.5">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white">{policy.label}</div>
                <div className="text-xs mt-0.5" style={{ color: FAINT }}>
                  {ap.id} · кейс {ap.caseId}{c ? ` · ${objectName(c.objectId)}` : ''} · предложил {agentName(ap.proposedBy)} · {ap.createdAt}
                </div>
              </div>
              <Badge tone={policy.level === 'L3' ? 'crit' : 'warn'}>{policy.level} · {LEVEL_LABEL[policy.level]}</Badge>
              <Badge tone={outcome === 'approved' ? 'ok' : outcome === 'rejected' ? 'crit' : 'gray'}>
                {outcome === 'approved' ? 'Согласовано' : outcome === 'rejected' ? 'Отклонено' : 'Ожидает'}
              </Badge>
            </div>
            <div className="text-xs text-white/80 mb-2">{ap.rationale}</div>
            {policy.note && <div className="text-xs mb-2" style={{ color: '#FDBA74' }}>{policy.note}</div>}
            <div className="flex flex-wrap items-center gap-2">
              {policy.approvers.map(r => (
                <span key={r} className="text-xs px-2 py-0.5 rounded-md border border-white/10" style={{ color: MUTED }}>
                  {dec[r] === 'approved' ? '✓' : dec[r] === 'rejected' ? '✕' : '○'} {ROLE_LABEL[r]}
                </span>
              ))}
              {canDecide && (
                <div className="ml-auto flex gap-2">
                  <button onClick={() => decide(ap.id, 'rejected')} className="text-xs px-3 py-1 rounded-lg bg-red-500/15 text-red-300">Отклонить</button>
                  <button onClick={() => decide(ap.id, 'approved')} className="text-xs px-3 py-1 rounded-lg bg-teal-500/20 text-teal-300">Согласовать</button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <Panel title="Матрица полномочий" subtitle="что агент может делать сам">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: 520 }}>
            <thead>
              <tr style={{ color: FAINT }}>
                <th className="text-left font-medium py-1">Действие</th>
                <th className="text-left font-medium py-1">Уровень</th>
                <th className="text-left font-medium py-1">Кто согласует / решает</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(ACTION_POLICY) as ActionType[]).map(a => {
                const p = ACTION_POLICY[a];
                const tone = p.level === 'FORBIDDEN' || p.level === 'L3' ? 'crit' : p.level === 'L2' ? 'warn' : 'ok';
                return (
                  <tr key={a} className="border-t border-white/5">
                    <td className="py-1.5 pr-2 text-white">{p.label}</td>
                    <td className="py-1.5 pr-2"><Badge tone={tone}>{LEVEL_LABEL[p.level]}</Badge></td>
                    <td className="py-1.5" style={{ color: MUTED }}>{p.approvers.map(r => ROLE_LABEL[r]).join(' + ') || (p.level === 'FORBIDDEN' ? 'Фармацевт/провизор' : '—')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

// ─── Agent registry ──────────────────────────────────────
function AgentCard({ a }: { a: AgentManifest }) {
  const [open, setOpen] = useState(false);
  const errors = validateManifest(a);
  const row = (label: string, value: React.ReactNode) => (
    <div className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-1 sm:gap-3 py-1 border-t border-white/5">
      <span style={{ color: FAINT }}>{label}</span><span className="text-white/85">{value}</span>
    </div>
  );
  return (
    <div className="rounded-xl mb-2 border border-white/10" style={{ background: PANEL }}>
      <button className="w-full text-left p-3 flex flex-wrap items-center gap-2" onClick={() => setOpen(!open)}>
        <span className="text-xs font-semibold text-white flex-1 min-w-[180px]">{a.name}</span>
        <Badge tone="info">{KIND_LABEL[a.kind]}</Badge>
        <Badge tone="gray">Волна {a.wave}</Badge>
        <Badge tone={a.status === 'active' ? 'ok' : a.status === 'pilot' ? 'warn' : 'gray'}>{AGENT_STATUS_LABEL[a.status]}</Badge>
        <i className={`ti ti-chevron-${open ? 'up' : 'down'} text-xs`} style={{ color: FAINT }}></i>
      </button>
      {!open && <div className="px-3 pb-3 -mt-1 text-xs" style={{ color: MUTED }}>{a.purpose}</div>}
      {open && (
        <div className="px-3 pb-3 text-xs">
          {row('Назначение', a.purpose)}
          {row('Направление', a.direction === 'group' ? 'Вся группа' : DIRECTION_LABEL[a.direction])}
          {row('Владелец', a.owner)}
          {row('Проблема', a.problem)}
          {row('Данные', a.data.join('; '))}
          {row('Интеграции', a.systems.join(', '))}
          {row('Анализирует', a.analyzes.join('; '))}
          {row('Автоматически', a.autoActions.map(x => ACTION_POLICY[x].label).join('; '))}
          {row('С согласования', a.humanActions.map(x => `${ACTION_POLICY[x].label} (${ACTION_POLICY[x].level})`).join('; ') || '—')}
          {row('Результаты', a.outputs.join('; '))}
          {row('KPI', a.kpis.join('; '))}
          {row('Методика эффекта', a.effectMethod)}
          {row('Сложность / срок', `${a.complexity === 'low' ? 'Низкая' : a.complexity === 'medium' ? 'Средняя' : 'Высокая'} · ${a.duration}`)}
          {row('Риски', a.risks.join('; '))}
          {row('Сигналы', `публикует: ${a.emits.join(', ') || '—'} · слушает: ${a.consumes.join(', ') || '—'}`)}
          {errors.length > 0 && <div className="mt-2 text-red-300">{errors.join('; ')}</div>}
        </div>
      )}
    </div>
  );
}

function Registry() {
  const [kind, setKind] = useState<SolutionKind | 'all'>('all');
  const [wave, setWave] = useState<number | 'all'>('all');
  const list = AGENTS.filter(a => (kind === 'all' || a.kind === kind) && (wave === 'all' || a.wave === wave));
  const byKind = (k: SolutionKind) => AGENTS.filter(a => a.kind === k).length;
  return (
    <div>
      <div className="grid gap-3 mb-4 grid-cols-2 lg:grid-cols-4">
        <Kpi label="Автоматизация" value={String(byKind('automation'))} hint="правила, сверки, сроки" />
        <Kpi label="Аналитические модели" value={String(byKind('analytics'))} hint="аномалии, скоринг" />
        <Kpi label="ИИ-ассистенты" value={String(byKind('assistant'))} hint="LLM, человек решает" />
        <Kpi label="Автономные агенты" value={String(byKind('agent'))} hint="только оркестратор" tone="warn" />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        <Chip active={kind === 'all'} onClick={() => setKind('all')}>Все типы</Chip>
        {(Object.keys(KIND_LABEL) as SolutionKind[]).map(k => <Chip key={k} active={kind === k} onClick={() => setKind(k)}>{KIND_LABEL[k]}</Chip>)}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Chip active={wave === 'all'} onClick={() => setWave('all')}>Все волны</Chip>
        {[1, 2, 3].map(w => <Chip key={w} active={wave === w} onClick={() => setWave(w)}>Волна {w}</Chip>)}
      </div>
      {list.map(a => <AgentCard key={a.id} a={a} />)}
    </div>
  );
}

// ─── Scenarios ───────────────────────────────────────────
function Scenarios() {
  return (
    <div className="grid gap-3 grid-cols-1 xl:grid-cols-2">
      {SCENARIOS.map(s => (
        <Panel key={s.id} title={`${s.id}. ${s.title}`} subtitle={s.directions.map(d => DIRECTION_LABEL[d]).join(' · ')}>
          <ol className="space-y-1.5">
            {s.steps.map((st, i) => {
              const agent = agentById(st.actor);
              const gate = st.gate ? ACTION_POLICY[st.gate] : null;
              return (
                <li key={i} className="flex gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]"
                    style={{ background: agent ? 'rgba(29,158,117,0.2)' : 'rgba(249,115,22,0.2)', color: agent ? '#1D9E75' : '#FB923C' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <span className={agent ? 'text-teal-400' : 'text-orange-300'}>{agent ? agent.name : st.actor}</span>
                    <span className="text-white/80"> — {st.text}</span>
                    {gate && <span className="ml-1"><Badge tone={gate.level === 'L3' ? 'crit' : 'warn'}>{gate.level}</Badge></span>}
                  </div>
                </li>
              );
            })}
          </ol>
        </Panel>
      ))}
    </div>
  );
}

// ─── Log ─────────────────────────────────────────────────
function Log({ entries }: { entries: AgentLogEntry[] }) {
  return (
    <div>
      <DemoBanner />
      <Panel title="Журнал действий агентов и людей" subtitle="неизменяемый, хранится вместе с доказательствами">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: 600 }}>
            <thead>
              <tr style={{ color: FAINT }}>
                <th className="text-left font-medium py-1">Время</th>
                <th className="text-left font-medium py-1">Кто</th>
                <th className="text-left font-medium py-1">Действие</th>
                <th className="text-left font-medium py-1">Кейс</th>
                <th className="text-left font-medium py-1">Результат</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={i} className="border-t border-white/5 align-top">
                  <td className="py-1.5 pr-2 whitespace-nowrap" style={{ color: MUTED }}>{e.at}</td>
                  <td className="py-1.5 pr-2 text-white">
                    {e.actor === 'human' ? <span className="text-orange-300">{e.agent}</span> : agentName(e.agent)}
                  </td>
                  <td className="py-1.5 pr-2 text-white/80">{ACTION_POLICY[e.action].label}</td>
                  <td className="py-1.5 pr-2 whitespace-nowrap" style={{ color: MUTED }}>{e.caseId ?? '—'}</td>
                  <td className="py-1.5 text-white/80">{e.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────
// Один экземпляр на все представления раздела: фильтры, решения и журнал
// сохраняются при переходах между подразделами.
export default function ControlTower({ view, go }: { view: ControlView; go: (v: ControlView) => void }) {
  const [filter, setFilter] = useState<CaseFilter>({});
  const [role, setRole] = useState<Role>('head_control');
  const [decisions, setDecisions] = useState<Decisions>({});
  const [humanLog, setHumanLog] = useState<AgentLogEntry[]>([]);

  const pending = APPROVALS.filter(a => approvalOutcome(a.action, decisions[a.id] ?? {}) === 'pending').length;

  const drill = (f: CaseFilter) => { setFilter(f); go('cases'); };

  const decide = (id: string, decision: ApprovalDecision) => {
    const ap = APPROVALS.find(a => a.id === id);
    if (!ap) return;
    setDecisions(prev => ({ ...prev, [id]: { ...prev[id], [role]: decision } }));
    const now = new Date();
    const at = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
    setHumanLog(prev => [{
      at, agent: ROLE_LABEL[role], action: ap.action, actor: 'human', caseId: ap.caseId,
      result: decision === 'approved' ? 'Согласовано' : 'Отклонено',
    }, ...prev]);
  };

  switch (view) {
    case 'hub': return <Hub drill={drill} approvalsPending={pending} />;
    case 'cases': return <Cases filter={filter} setFilter={setFilter} />;
    case 'approvals': return <Approvals role={role} setRole={setRole} decisions={decisions} decide={decide} />;
    case 'agents': return <Registry />;
    case 'scenarios': return <Scenarios />;
    case 'log': return <Log entries={[...humanLog, ...AGENT_LOG].sort((a, b) => b.at.localeCompare(a.at))} />;
  }
}

export const CONTROL_VIEWS: Record<string, ControlView> = {
  'control/hub': 'hub',
  'control/cases': 'cases',
  'control/approvals': 'approvals',
  'control/agents': 'agents',
  'control/scenarios': 'scenarios',
  'control/log': 'log',
};

// Заголовки подразделов для портала.
export const CONTROL_TITLES: Record<string, string> = {
  'control/hub': 'Центр контроля группы',
  'control/cases': 'Кейсы контроля',
  'control/approvals': 'Согласования',
  'control/agents': 'Реестр агентов контроля',
  'control/scenarios': 'Сквозные сценарии',
  'control/log': 'Журнал действий',
};
