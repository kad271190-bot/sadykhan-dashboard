import type { AgentLogEntry, ApprovalRequest, ControlCase, RiskObject } from './types';

// ДЕМО-ДАННЫЕ. Используют те же условные объекты, что и остальной портал
// (Алматы-3, Астана-7 и т.д.). Заменяются реальными данными после
// подключения интеграций.
export const IS_DEMO = true;

export const RISK_OBJECTS: RiskObject[] = [
  { id: 'ph-alm3', name: 'Аптека Алматы-3', kind: 'pharmacy', direction: 'retail', city: 'Алматы',
    signals: { fraud: 0.85, losses: 0.7, service: 0.75, execution: 0.6, compliance: 0.3 } },
  { id: 'ph-ast7', name: 'Аптека Астана-7', kind: 'pharmacy', direction: 'retail', city: 'Астана',
    signals: { fraud: 0.8, losses: 0.55, service: 0.3, execution: 0.4 } },
  { id: 'ph-alm5', name: 'Аптека Алматы-5', kind: 'pharmacy', direction: 'retail', city: 'Алматы',
    signals: { losses: 0.6, fraud: 0.3, quality: 0.35 } },
  { id: 'ph-shy2', name: 'Аптека Шымкент-2', kind: 'pharmacy', direction: 'retail', city: 'Шымкент',
    signals: { service: 0.55, fraud: 0.25, compliance: 0.4 } },
  { id: 'ph-alm1', name: 'Аптека Алматы-1', kind: 'pharmacy', direction: 'retail', city: 'Алматы',
    signals: { fraud: 0.1, losses: 0.05, service: 0.2 } },
  { id: 'wh-main', name: 'Центральный склад', kind: 'warehouse', direction: 'logistics', city: 'Алматы',
    signals: { quality: 0.65, losses: 0.3, compliance: 0.45 } },
  { id: 'cp-medtrade', name: 'ТОО «Контрагент-А» (опт)', kind: 'counterparty', direction: 'wholesale',
    signals: { losses: 0.75, fraud: 0.5, compliance: 0.3 } },
  { id: 'cp-farmlink', name: 'ТОО «Контрагент-Б» (опт)', kind: 'counterparty', direction: 'wholesale',
    signals: { losses: 0.4, execution: 0.3 } },
  { id: 'sup-x', name: 'Поставщик «Дистрибьютор-X»', kind: 'counterparty', direction: 'procurement',
    signals: { fraud: 0.45, compliance: 0.6 } },
  { id: 'ch-glovo', name: 'Канал Glovo', kind: 'channel', direction: 'ecommerce',
    signals: { losses: 0.55, execution: 0.5 } },
  { id: 'ch-yandex', name: 'Канал Яндекс Еда', kind: 'channel', direction: 'ecommerce',
    signals: { losses: 0.65, execution: 0.45 } },
  { id: 'ch-site', name: 'Интернет-аптека', kind: 'channel', direction: 'ecommerce',
    signals: { fraud: 0.35, service: 0.3 } },
  { id: 'u-treasury', name: 'Казначейство', kind: 'unit', direction: 'finance',
    signals: { fraud: 0.4, compliance: 0.25 } },
  { id: 'u-hr', name: 'Кадровый учёт', kind: 'unit', direction: 'hr',
    signals: { compliance: 0.55, execution: 0.35 } },
  { id: 'u-1c', name: 'Доступы 1С', kind: 'unit', direction: 'it',
    signals: { compliance: 0.7, fraud: 0.3 } },
  { id: 'u-legal', name: 'Договоры и лицензии', kind: 'unit', direction: 'legal',
    signals: { compliance: 0.35, execution: 0.3 } },
];

export const CASES: ControlCase[] = [
  {
    id: 'KK-1042', title: 'Тройная аномалия: лояльность по пятницам + текучесть + жалобы',
    objectId: 'ph-alm3', direction: 'retail', category: 'fraud', severity: 'crit', status: 'awaiting_approval',
    openedBy: 'mozg', involvedAgents: ['cash-fraud', 'hr-control', 'reputation'], owner: 'retail_director',
    openedAt: '2026-10-15', dueAt: '2026-10-22', exposure: 45000,
    evidence: [
      { source: 'Антифрод касс', text: 'Начисления бонусов на 4 карты по пятницам 18–20:00, 6 недель подряд' },
      { source: 'HR-контроль', text: 'Текучесть 14% за квартал при среднем по сети 6% (демо)' },
      { source: 'Репутация', text: '18 негативных отзывов за месяц, тема — обслуживание' },
    ],
  },
  {
    id: 'KK-1043', title: '34 отложенных чека в конце смены одним кассиром',
    objectId: 'ph-ast7', direction: 'retail', category: 'fraud', severity: 'crit', status: 'investigating',
    openedBy: 'cash-fraud', involvedAgents: ['cash-fraud'], owner: 'security',
    openedAt: '2026-10-16', dueAt: '2026-10-20', exposure: 48200,
    evidence: [{ source: 'ОФД / 1С', text: '34 чека пробиты в 20:00–20:04, суммарно ₸48 200; паттерн 3 недели' }],
  },
  {
    id: 'KK-1044', title: 'Заказы Яндекс Еда приняты, но не отражены в 1С',
    objectId: 'ch-yandex', direction: 'ecommerce', category: 'losses', severity: 'crit', status: 'awaiting_approval',
    openedBy: 'aggregators', involvedAgents: ['aggregators'], owner: 'chief_accountant',
    openedAt: '2026-10-16', dueAt: '2026-10-21', exposure: 88000,
    evidence: [{ source: 'Отчёт агрегатора vs 1С', text: '22 заказа без документа продажи, аптеки Алматы-2 и Алматы-4' }],
  },
  {
    id: 'KK-1045', title: 'Отгрузки контрагенту при просрочке > 60 дней',
    objectId: 'cp-medtrade', direction: 'wholesale', category: 'losses', severity: 'crit', status: 'awaiting_approval',
    openedBy: 'receivables', involvedAgents: ['receivables'], owner: 'wholesale_director',
    openedAt: '2026-10-14', dueAt: '2026-10-19', exposure: 3200000,
    evidence: [
      { source: '1С опт', text: '3 отгрузки за 2 недели при просроченной ДЗ; лимит изменён вручную' },
      { source: 'Реестр юрлиц', text: 'Совпадает юридический адрес с другим должником (требует проверки)' },
    ],
  },
  {
    id: 'KK-1046', title: 'Температурное отклонение в зоне 2–8 °C',
    objectId: 'wh-main', direction: 'logistics', category: 'quality', severity: 'crit', status: 'awaiting_approval',
    openedBy: 'gdp-warehouse', involvedAgents: ['gdp-warehouse'], owner: 'quality_authorized',
    openedAt: '2026-10-17', dueAt: '2026-10-17',
    evidence: [{ source: 'Логгер Х-2', text: '+9.4 °C в течение 47 минут ночью; затронуто 12 серий' }],
  },
  {
    id: 'KK-1047', title: 'SoD-конфликт: создание контрагента + изменение цен + проведение оплаты',
    objectId: 'u-1c', direction: 'it', category: 'compliance', severity: 'warn', status: 'awaiting_approval',
    openedBy: 'access-control', involvedAgents: ['access-control'], owner: 'it_security',
    openedAt: '2026-10-13', dueAt: '2026-10-27',
    evidence: [{ source: 'Права 1С', text: '3 пользователя с конфликтной комбинацией ролей; 1 уволен 2 мес. назад' }],
  },
  {
    id: 'KK-1048', title: 'Закупочная цена выше предельной по 6 позициям',
    objectId: 'sup-x', direction: 'procurement', category: 'compliance', severity: 'warn', status: 'investigating',
    openedBy: 'procurement-price', involvedAgents: ['procurement-price'], owner: 'procurement_head',
    openedAt: '2026-10-12', dueAt: '2026-10-26',
    evidence: [{ source: 'Спецификация vs реестр цен', text: '6 SKU, отклонение 3–11% (демо)' }],
  },
  {
    id: 'KK-1049', title: 'Просроченная плановая ревизия',
    objectId: 'ph-alm3', direction: 'retail', category: 'execution', severity: 'warn', status: 'in_progress',
    openedBy: 'execution', involvedAgents: ['revision', 'execution'], owner: 'retail_director',
    openedAt: '2026-10-05', dueAt: '2026-10-18',
    evidence: [{ source: 'План ревизий', text: 'Просрочка 12 дней, объяснительная не получена' }],
  },
  {
    id: 'KK-1050', title: 'Сертификаты специалиста истекают у 5 фармацевтов',
    objectId: 'u-hr', direction: 'hr', category: 'compliance', severity: 'warn', status: 'in_progress',
    openedBy: 'hr-control', involvedAgents: ['hr-control', 'gpp'], owner: 'hr',
    openedAt: '2026-10-10', dueAt: '2026-11-10',
    evidence: [{ source: '1С ЗУП', text: 'Срок истекает в течение 30 дней' }],
  },
  {
    id: 'KK-1051', title: 'Отмены Glovo не возвращены в остатки',
    objectId: 'ch-glovo', direction: 'ecommerce', category: 'losses', severity: 'warn', status: 'verification',
    openedBy: 'aggregators', involvedAgents: ['aggregators', 'execution'], owner: 'ecom_director',
    openedAt: '2026-10-08', dueAt: '2026-10-15', exposure: 24000,
    evidence: [{ source: 'Glovo vs 1С', text: '7 отмен; исправлено, ждёт повторной сверки' }],
  },
  {
    id: 'KK-1052', title: 'Дубль платежа поставщику',
    objectId: 'u-treasury', direction: 'finance', category: 'losses', severity: 'warn', status: 'closed',
    openedBy: 'finance-control', involvedAgents: ['finance-control'], owner: 'cfo',
    openedAt: '2026-10-01', dueAt: '2026-10-08', exposure: 1150000,
    evidence: [{ source: 'Выписка банка', text: 'Два платежа по одному счёту с разницей 1 день; сумма возвращена' }],
  },
];

export const APPROVALS: ApprovalRequest[] = [
  { id: 'AP-301', caseId: 'KK-1042', action: 'open_security_investigation', proposedBy: 'mozg',
    rationale: 'Аномалии в 3 независимых источниках, повторяемость 6 недель', createdAt: '2026-10-16 09:12' },
  { id: 'AP-302', caseId: 'KK-1044', action: 'correct_accounting_record', proposedBy: 'aggregators',
    rationale: 'Сопоставление по номеру заказа 22/22, суммы совпадают с отчётом агрегатора', createdAt: '2026-10-16 10:40' },
  { id: 'AP-303', caseId: 'KK-1045', action: 'recommend_counterparty_stop', proposedBy: 'receivables',
    rationale: 'Просрочка > 60 дней, лимит изменён вручную без согласования', createdAt: '2026-10-15 17:05' },
  { id: 'AP-304', caseId: 'KK-1046', action: 'quarantine_batch', proposedBy: 'gdp-warehouse',
    rationale: 'Превышение +8 °C 47 мин; 12 серий в зоне — до решения уполномоченного', createdAt: '2026-10-17 06:20' },
  { id: 'AP-305', caseId: 'KK-1047', action: 'recommend_access_revoke', proposedBy: 'access-control',
    rationale: 'Уволенный сотрудник сохраняет доступ; конфликт ролей у 2 действующих', createdAt: '2026-10-14 11:00' },
  { id: 'AP-306', caseId: 'KK-1049', action: 'schedule_unplanned_audit', proposedBy: 'mozg',
    rationale: 'Риск-скоринг аптеки максимальный по сети, плановая ревизия просрочена', createdAt: '2026-10-16 09:15' },
];

export const AGENT_LOG: AgentLogEntry[] = [
  { at: '2026-10-17 06:20', agent: 'gdp-warehouse', action: 'open_case', actor: 'agent', caseId: 'KK-1046', result: 'Кейс открыт, уведомлён уполномоченный по качеству' },
  { at: '2026-10-17 06:21', agent: 'gdp-warehouse', action: 'send_notification', actor: 'agent', caseId: 'KK-1046', result: 'Telegram + звонок дежурному' },
  { at: '2026-10-17 06:00', agent: 'mozg', action: 'draft_report', actor: 'agent', result: 'Утренний доклад директору сформирован' },
  { at: '2026-10-16 18:30', agent: 'execution', action: 'create_task', actor: 'agent', caseId: 'KK-1049', result: 'Задача заведующей Алматы-3 в Bitrix24' },
  { at: '2026-10-16 10:40', agent: 'aggregators', action: 'open_case', actor: 'agent', caseId: 'KK-1044', result: '22 расхождения, предложена корректировка' },
  { at: '2026-10-16 09:12', agent: 'mozg', action: 'open_case', actor: 'agent', caseId: 'KK-1042', result: 'Объединены сигналы 3 агентов' },
  { at: '2026-10-08 14:02', agent: 'Аудитор', action: 'request_explanation', actor: 'human', caseId: 'KK-1052', result: 'Согласовано аудитором, запрос в казначейство' },
];
