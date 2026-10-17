// Контракт AI-экосистемы департамента контроля качества и аудита.
//
// Департамент — независимая функция надзора над всеми направлениями группы
// (вторая/третья линия защиты). Агенты контроля читают данные бизнес-систем,
// но не изменяют их: они открывают кейсы, ставят задачи владельцам процессов
// и проверяют исполнение. Агент описывается манифестом (данными), поэтому
// новый агент подключается добавлением манифеста в реестр.

// Классификация решения: агентный ИИ используется только там, где простого
// алгоритма недостаточно.
export type SolutionKind = 'automation' | 'analytics' | 'assistant' | 'agent';

export type AgentStatus = 'active' | 'pilot' | 'planned';
export type Complexity = 'low' | 'medium' | 'high';
export type Wave = 1 | 2 | 3;

// Направления группы, которые контролирует департамент.
export type Direction =
  | 'retail'
  | 'wholesale'
  | 'ecommerce'
  | 'finance'
  | 'procurement'
  | 'logistics'
  | 'hr'
  | 'it'
  | 'legal';

// Категории риска, сквозные для всех направлений.
export type RiskCategory = 'fraud' | 'losses' | 'compliance' | 'quality' | 'service' | 'execution';

// Уровни полномочий:
// L0 — чтение и расчёт, L1 — автоматически с уведомлением,
// L2 — одно согласование, L3 — два согласования / уполномоченное лицо,
// FORBIDDEN — ИИ не выполняет и не инициирует автоматически.
export type RiskLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'FORBIDDEN';

export type Role =
  | 'auditor'              // аудитор / специалист контроля
  | 'head_control'         // директор департамента контроля и аудита
  | 'security'             // служба безопасности
  | 'quality_authorized'   // уполномоченное лицо по качеству (GPP/GDP)
  | 'retail_director'
  | 'wholesale_director'
  | 'ecom_director'
  | 'cfo'
  | 'chief_accountant'
  | 'procurement_head'
  | 'logistics_head'
  | 'hr'
  | 'legal'
  | 'it_security'
  | 'ceo';

export type ActionType =
  | 'read_data'
  | 'calc_risk_score'
  | 'send_notification'
  | 'open_case'
  | 'create_task'
  | 'draft_report'
  | 'request_explanation'
  | 'schedule_unplanned_audit'
  | 'issue_prescription'
  | 'publish_review_reply'
  | 'escalate_to_ceo'
  | 'recommend_counterparty_stop'
  | 'recommend_access_revoke'
  | 'correct_accounting_record'
  | 'quarantine_batch'
  | 'block_batch_sale'
  | 'write_off_goods'
  | 'open_security_investigation'
  | 'disciplinary_measure'
  | 'notify_regulator'
  | 'payment_or_refund'
  | 'drug_substitution'
  | 'dispensing_decision';

export interface ActionPolicy {
  label: string;
  level: RiskLevel;
  // Все перечисленные роли должны согласовать.
  approvers: Role[];
  note?: string;
}

export type Severity = 'crit' | 'warn' | 'info';

export interface AgentManifest {
  id: string;
  name: string;
  purpose: string;
  direction: Direction | 'group';
  owner: string;
  kind: SolutionKind;
  wave: Wave;
  status: AgentStatus;
  problem: string;
  data: string[];
  systems: string[];
  analyzes: string[];
  autoActions: ActionType[];
  humanActions: ActionType[];
  outputs: string[];
  kpis: string[];
  effectMethod: string;
  complexity: Complexity;
  duration: string;       // предварительная оценка, уточняется после обследования
  risks: string[];
  // Сигналы, которые агент публикует, и сигналы, на которые подписан.
  emits: string[];
  consumes: string[];
}

export type CaseStatus =
  | 'new'
  | 'investigating'
  | 'awaiting_approval'
  | 'in_progress'
  | 'verification'
  | 'closed';

export interface Evidence {
  source: string;
  text: string;
}

export interface ControlCase {
  id: string;
  title: string;
  objectId: string;
  direction: Direction;
  category: RiskCategory;
  severity: Severity;
  status: CaseStatus;
  openedBy: string;        // id агента
  involvedAgents: string[];
  owner: Role;             // владелец процесса, который устраняет
  openedAt: string;
  dueAt: string;
  exposure?: number;       // оценка риска в ₸ (демо)
  evidence: Evidence[];
}

export interface ApprovalRequest {
  id: string;
  caseId: string;
  action: ActionType;
  proposedBy: string;
  rationale: string;
  createdAt: string;
}

export type ApprovalDecision = 'approved' | 'rejected';

export interface AgentLogEntry {
  at: string;
  agent: string;           // id агента или название роли человека
  action: ActionType;
  actor: 'agent' | 'human';
  caseId?: string;
  result: string;
}

export type RiskObjectKind = 'pharmacy' | 'warehouse' | 'counterparty' | 'channel' | 'unit';

// Объект контроля: аптека, склад, контрагент, канал продаж, подразделение.
export interface RiskObject {
  id: string;
  name: string;
  kind: RiskObjectKind;
  direction: Direction;
  city?: string;
  // Нормированные значения сигналов 0..1 по категориям риска.
  signals: Partial<Record<RiskCategory, number>>;
}
