import type { ActionType, Direction } from './types';

// Сквозные сценарии: сигнал → анализ → согласование человеком → задача
// владельцу процесса → проверка исполнения. Шаг с `gate` останавливается
// в очереди согласований по матрице ACTION_POLICY.
export interface ScenarioStep {
  actor: string;          // id агента или название роли
  text: string;
  gate?: ActionType;
}

export interface Scenario {
  id: string;
  title: string;
  directions: Direction[];
  steps: ScenarioStep[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'S01', title: 'Комплексная аномалия аптеки', directions: ['retail', 'hr'],
    steps: [
      { actor: 'cash-fraud', text: 'Повторяющиеся начисления бонусов на одни карты в одно время' },
      { actor: 'hr-control', text: 'Текучесть в аптеке выше нормы, работа под чужими логинами' },
      { actor: 'reputation', text: 'Рост жалоб на обслуживание' },
      { actor: 'mozg', text: 'Объединяет в один кейс, риск-скоринг аптеки > 60' },
      { actor: 'Директор по контролю + СБ', text: 'Согласуют служебное расследование', gate: 'open_security_investigation' },
      { actor: 'execution', text: 'Задачи СБ и директору розницы, контроль сроков' },
    ],
  },
  {
    id: 'S02', title: 'Отложенные и аннулированные чеки', directions: ['retail', 'finance'],
    steps: [
      { actor: 'cash-fraud', text: 'Пакет чеков в конце смены у одного кассира' },
      { actor: 'Аудитор', text: 'Запрашивает объяснение заведующей', gate: 'request_explanation' },
      { actor: 'Главный бухгалтер', text: 'Оценивает налоговый риск по ККМ' },
      { actor: 'execution', text: 'Повторная проверка через 2 недели — паттерн исчез?' },
    ],
  },
  {
    id: 'S03', title: 'Расхождение агрегатора и 1С', directions: ['ecommerce', 'finance'],
    steps: [
      { actor: 'aggregators', text: 'Ежедневная сверка: заказы без документа продажи' },
      { actor: 'Главный бухгалтер + директор по контролю', text: 'Согласуют корректировку учёта', gate: 'correct_accounting_record' },
      { actor: 'Бухгалтерия', text: 'Выполняет корректировку в 1С (не агент)' },
      { actor: 'aggregators', text: 'Повторная сверка подтверждает закрытие' },
    ],
  },
  {
    id: 'S04', title: 'Отгрузки должнику сверх лимита', directions: ['wholesale', 'finance'],
    steps: [
      { actor: 'receivables', text: 'Отгрузка при просрочке, лимит изменён вручную' },
      { actor: 'receivables', text: 'Проверка связанности с другими должниками' },
      { actor: 'Директор по контролю + директор опта', text: 'Решение об остановке отгрузок', gate: 'recommend_counterparty_stop' },
      { actor: 'access-control', text: 'Кто и с какими правами менял лимит' },
      { actor: 'execution', text: 'Контроль погашения и восстановления лимита' },
    ],
  },
  {
    id: 'S05', title: 'Отзыв серии регулятором', directions: ['logistics', 'retail', 'ecommerce'],
    steps: [
      { actor: 'gdp-warehouse', text: 'Получено уведомление об отзыве серии' },
      { actor: 'gdp-warehouse', text: 'Карта остатков серии: склад, аптеки, онлайн-резервы' },
      { actor: 'Уполномоченный по качеству + директор по контролю', text: 'Блокировка продажи серии', gate: 'block_batch_sale' },
      { actor: 'gdp-warehouse', text: 'Мониторинг: продаж серии после блокировки = 0' },
      { actor: 'Уполномоченный по качеству', text: 'Отчёт об исполнении регулятору (проект готовит агент)' },
    ],
  },
  {
    id: 'S06', title: 'Температурное отклонение', directions: ['logistics'],
    steps: [
      { actor: 'gdp-warehouse', text: 'Логгер: выход за 2–8 °C, список затронутых серий' },
      { actor: 'Уполномоченный по качеству', text: 'Перевод в карантин до оценки', gate: 'quarantine_batch' },
      { actor: 'Уполномоченный по качеству + главный бухгалтер', text: 'Решение: вернуть в оборот или списать', gate: 'write_off_goods' },
      { actor: 'execution', text: 'CAPA по оборудованию, проверка исполнения' },
    ],
  },
  {
    id: 'S07', title: 'Переплата поставщику / предельные цены', directions: ['procurement', 'finance'],
    steps: [
      { actor: 'procurement-price', text: 'Цена закупки выше альтернатив или предельной цены' },
      { actor: 'Аудитор', text: 'Запрос обоснования у закупа', gate: 'request_explanation' },
      { actor: 'Директор по контролю', text: 'Внеплановая проверка закупа при повторе', gate: 'schedule_unplanned_audit' },
    ],
  },
  {
    id: 'S08', title: 'Дубль или необоснованный платёж', directions: ['finance'],
    steps: [
      { actor: 'finance-control', text: 'Два платежа по одному счёту / платёж без договора' },
      { actor: 'Аудитор', text: 'Запрос в казначейство', gate: 'request_explanation' },
      { actor: 'Финансовый директор', text: 'Возврат средств — только человек' },
      { actor: 'execution', text: 'Контроль поступления возврата' },
    ],
  },
  {
    id: 'S09', title: 'Доступ уволенного и конфликт полномочий', directions: ['it', 'hr'],
    steps: [
      { actor: 'hr-control', text: 'Приказ об увольнении' },
      { actor: 'access-control', text: 'Учётная запись активна, есть права на платежи' },
      { actor: 'Директор по контролю + ИБ', text: 'Отзыв доступа', gate: 'recommend_access_revoke' },
      { actor: 'access-control', text: 'Проверка журнала действий после даты увольнения' },
    ],
  },
  {
    id: 'S10', title: 'Отказ покупателю из-за отсутствия препарата', directions: ['retail', 'procurement'],
    steps: [
      { actor: 'service-audio', text: 'Зафиксирован отказ по отсутствию товара' },
      { actor: 'reputation', text: 'Совпадает с жалобами «нет препарата» в отзывах' },
      { actor: 'mozg', text: 'Передаёт сигнал владельцу — закупу/рознице (контроль не заказывает сам)' },
      { actor: 'execution', text: 'Задача в Bitrix24 и проверка: отказы по SKU снизились?' },
    ],
  },
  {
    id: 'S11', title: 'Нарушение GPP по итогам чек-листа', directions: ['retail'],
    steps: [
      { actor: 'gpp', text: 'Чек-лист не заполнен / фото выявило нарушение хранения' },
      { actor: 'Директор по контролю', text: 'Предписание аптеке', gate: 'issue_prescription' },
      { actor: 'execution', text: 'CAPA, повторная проверка, учёт повторности' },
    ],
  },
  {
    id: 'S12', title: 'Истекающие сертификаты фармацевтов и лицензии', directions: ['hr', 'legal', 'retail'],
    steps: [
      { actor: 'hr-control', text: 'Сертификат специалиста истекает через 30 дней' },
      { actor: 'gpp', text: 'Лицензия/приложение к лицензии аптеки требует переоформления' },
      { actor: 'execution', text: 'Задачи HR и юристу; эскалация при просрочке', gate: 'escalate_to_ceo' },
    ],
  },
];
