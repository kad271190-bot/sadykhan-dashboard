import type {
  ActionPolicy, ActionType, AgentManifest, ApprovalDecision, Direction, RiskCategory, RiskLevel, RiskObject, Role,
} from './types';

// Матрица полномочий. Единственный источник правды для Human-in-the-loop:
// и интерфейс, и будущий оркестратор проверяют действие через эту таблицу.
// Действия в бизнес-системах (учёт, отгрузки, доступы) агенты контроля только
// рекомендуют — выполняет владелец процесса после согласования.
export const ACTION_POLICY: Record<ActionType, ActionPolicy> = {
  read_data:                   { label: 'Чтение данных',                           level: 'L0', approvers: [] },
  calc_risk_score:             { label: 'Расчёт риск-скоринга',                    level: 'L0', approvers: [] },
  send_notification:           { label: 'Уведомление ответственному',              level: 'L1', approvers: [] },
  open_case:                   { label: 'Открытие кейса контроля',                 level: 'L1', approvers: [] },
  create_task:                 { label: 'Задача владельцу процесса в Bitrix24',    level: 'L1', approvers: [] },
  draft_report:                { label: 'Черновик отчёта / акта',                  level: 'L1', approvers: [] },
  request_explanation:         { label: 'Запрос объяснения у подразделения',       level: 'L2', approvers: ['auditor'] },
  schedule_unplanned_audit:    { label: 'Внеплановая проверка / ревизия',          level: 'L2', approvers: ['head_control'] },
  issue_prescription:          { label: 'Предписание об устранении нарушения',     level: 'L2', approvers: ['head_control'] },
  publish_review_reply:        { label: 'Публикация ответа на отзыв',              level: 'L2', approvers: ['auditor'],
    note: 'Ответы, затрагивающие здоровье покупателя или претензию, пишутся вручную' },
  escalate_to_ceo:             { label: 'Эскалация CEO / совету',                  level: 'L2', approvers: ['head_control'] },
  recommend_counterparty_stop: { label: 'Рекомендация остановить отгрузки контрагенту', level: 'L3', approvers: ['head_control', 'wholesale_director'] },
  recommend_access_revoke:     { label: 'Рекомендация отозвать доступ в 1С',       level: 'L3', approvers: ['head_control', 'it_security'] },
  correct_accounting_record:   { label: 'Корректировка учёта в 1С',                level: 'L3', approvers: ['chief_accountant', 'head_control'],
    note: 'Выполняет бухгалтерия; агент контроля только готовит основание' },
  quarantine_batch:            { label: 'Перевод серии в карантин',                level: 'L2', approvers: ['quality_authorized'] },
  block_batch_sale:            { label: 'Блокировка продажи серии',                level: 'L3', approvers: ['quality_authorized', 'head_control'] },
  write_off_goods:             { label: 'Списание товара',                         level: 'L3', approvers: ['quality_authorized', 'chief_accountant'] },
  open_security_investigation: { label: 'Служебное расследование',                 level: 'L3', approvers: ['head_control', 'security'] },
  disciplinary_measure:        { label: 'Дисциплинарная мера / удержание',         level: 'FORBIDDEN', approvers: ['hr', 'legal'],
    note: 'ИИ только собирает доказательства; решение — работодатель по процедуре ТК РК' },
  notify_regulator:            { label: 'Уведомление регулятора / госорганов',     level: 'FORBIDDEN', approvers: ['quality_authorized', 'legal'],
    note: 'Агент готовит проект; направляет уполномоченное лицо' },
  payment_or_refund:           { label: 'Платёж / возврат денег',                  level: 'FORBIDDEN', approvers: ['cfo'] },
  drug_substitution:           { label: 'Замена препарата',                        level: 'FORBIDDEN', approvers: [],
    note: 'Решение фармацевта/провизора при отпуске; ИИ не участвует' },
  dispensing_decision:         { label: 'Решение об отпуске ЛС',                   level: 'FORBIDDEN', approvers: [],
    note: 'Решение фармацевта/провизора при отпуске; ИИ не участвует' },
};

export const ROLE_LABEL: Record<Role, string> = {
  auditor: 'Аудитор',
  head_control: 'Директор по контролю',
  security: 'Служба безопасности',
  quality_authorized: 'Уполномоченный по качеству',
  retail_director: 'Директор розницы',
  wholesale_director: 'Директор опта',
  ecom_director: 'Директор e-commerce',
  cfo: 'Финансовый директор',
  chief_accountant: 'Главный бухгалтер',
  procurement_head: 'Руководитель закупа',
  logistics_head: 'Руководитель логистики',
  hr: 'HR',
  legal: 'Юрист',
  it_security: 'ИБ',
  ceo: 'CEO',
};

export const LEVEL_LABEL: Record<RiskLevel, string> = {
  L0: 'Авто',
  L1: 'Авто + уведомление',
  L2: '1 согласование',
  L3: '2 согласования',
  FORBIDDEN: 'Только человек',
};

export const DIRECTION_LABEL: Record<Direction, string> = {
  retail: 'Розница',
  wholesale: 'Опт',
  ecommerce: 'E-commerce',
  finance: 'Финансы',
  procurement: 'Закупки',
  logistics: 'Склад и логистика',
  hr: 'HR',
  it: 'IT и доступы',
  legal: 'Юридический',
};

export const CATEGORY_LABEL: Record<RiskCategory, string> = {
  fraud: 'Мошенничество',
  losses: 'Потери',
  compliance: 'Комплаенс',
  quality: 'Качество GxP',
  service: 'Сервис',
  execution: 'Исполнение',
};

export function canAgentExecute(action: ActionType): boolean {
  const level = ACTION_POLICY[action].level;
  return level === 'L0' || level === 'L1';
}

// Действие считается согласованным, только когда все требуемые роли
// приняли решение «approved». Любой отказ отклоняет действие.
export function approvalOutcome(
  action: ActionType,
  decisions: Partial<Record<Role, ApprovalDecision>>,
): 'approved' | 'rejected' | 'pending' | 'not_allowed' {
  const policy = ACTION_POLICY[action];
  if (policy.level === 'FORBIDDEN') return 'not_allowed';
  if (Object.values(decisions).includes('rejected')) return 'rejected';
  return policy.approvers.every(r => decisions[r] === 'approved') ? 'approved' : 'pending';
}

// Проверка манифеста при подключении нового агента: агенту нельзя
// выдать в autoActions действие выше L1, а предлагать — запрещённое действие.
export function validateManifest(m: AgentManifest): string[] {
  const errors: string[] = [];
  for (const a of m.autoActions) {
    if (!canAgentExecute(a)) errors.push(`${m.id}: «${ACTION_POLICY[a].label}» нельзя выполнять автоматически`);
  }
  for (const a of m.humanActions) {
    if (ACTION_POLICY[a].level === 'FORBIDDEN') errors.push(`${m.id}: «${ACTION_POLICY[a].label}» агент не может предлагать`);
  }
  return errors;
}

// Прозрачный риск-скоринг объекта: взвешенное среднее по категориям, для
// которых у объекта есть сигналы, плюс надбавка за аномалии сразу в
// нескольких категориях. Веса — допущение, калибруются после пилота.
export const RISK_WEIGHTS: Record<RiskCategory, number> = {
  fraud: 0.30,
  losses: 0.20,
  quality: 0.20,
  compliance: 0.15,
  execution: 0.10,
  service: 0.05,
};

export function riskScore(o: RiskObject): number {
  const cats = (Object.keys(o.signals) as RiskCategory[]);
  if (cats.length === 0) return 0;
  const wsum = cats.reduce((s, c) => s + RISK_WEIGHTS[c], 0);
  const base = cats.reduce((s, c) => s + RISK_WEIGHTS[c] * (o.signals[c] ?? 0), 0) / wsum;
  const hot = cats.filter(c => (o.signals[c] ?? 0) >= 0.6).length;
  const bonus = hot >= 3 ? 0.15 : hot === 2 ? 0.05 : 0;
  return Math.round(Math.min(1, base + bonus) * 100);
}

export function scoreLevel(score: number): 'crit' | 'warn' | 'ok' {
  return score >= 60 ? 'crit' : score >= 35 ? 'warn' : 'ok';
}
