'use client';
import { useState, useEffect } from 'react';

// ─── Nav structure with sub-items ─────────────────────────
const NAV = [
  { section: 'Главная', items: [
    { id: 'overview', icon: 'layout-dashboard', label: 'Обзор' },
    { id: 'alerts',   icon: 'bell',             label: 'Алерты', badge: '4', bc: 'red' },
    { id: 'mozg',     icon: 'brain',            label: 'МОЗГ — Садыхан', badge: 'AI', bc: 'green' },
  ]},
  { section: 'Отделы', items: [
    { id: 'control', icon: 'shield-check', label: 'Контроль и аудит', subs: [
      { id: 'control/reputation', label: 'Репутация', icon: 'star' },
      { id: 'control/nps',        label: 'NPS и сервис', icon: 'heart' },
      { id: 'control/revision',   label: 'Ревизии', icon: 'clipboard-list' },
      { id: 'control/antifraud',  label: 'Антифрод', icon: 'shield-x' },
      { id: 'control/aggregators',label: 'Агрегаторы', icon: 'truck-delivery' },
      { id: 'control/cash',       label: 'Кассы и чеки', icon: 'receipt' },
    ]},
    { id: 'develop', icon: 'trending-up', label: 'Развитие', subs: [
      { id: 'develop/procurement', label: 'Закуп', icon: 'package' },
      { id: 'develop/categories',  label: 'Категории', icon: 'category' },
      { id: 'develop/pricing',     label: 'Ценообразование', icon: 'tag' },
    ]},
    { id: 'finance', icon: 'cash', label: 'Финансы', subs: [
      { id: 'finance/reports',    label: 'Финотчётность', icon: 'file-analytics' },
      { id: 'finance/analytics',  label: 'Аналитика', icon: 'chart-bar' },
      { id: 'finance/accounting', label: 'Бухгалтерия', icon: 'calculator' },
    ]},
    { id: 'hr', icon: 'users', label: 'HR', subs: [
      { id: 'hr/staff',    label: 'Персонал', icon: 'user' },
      { id: 'hr/rating',   label: 'Рейтинг сотрудников', icon: 'award' },
      { id: 'hr/training', label: 'Обучение', icon: 'school' },
    ]},
    { id: 'marketing', icon: 'speakerphone', label: 'Маркетинг', subs: [
      { id: 'marketing/promo',   label: 'Акции', icon: 'discount' },
      { id: 'marketing/loyalty', label: 'Лояльность', icon: 'gift' },
    ]},
    { id: 'operations', icon: 'clipboard-check', label: 'Операции', subs: [
      { id: 'operations/licenses', label: 'Лицензии', icon: 'certificate' },
      { id: 'operations/standards',label: 'Стандарты', icon: 'checklist' },
    ]},
    { id: 'it', icon: 'device-desktop', label: 'IT', badge: '3', bc: 'amber', subs: [
      { id: 'it/servicedesk', label: 'Service Desk', icon: 'ticket' },
      { id: 'it/1c',          label: '1С разработка', icon: 'code' },
      { id: 'it/infra',       label: 'Инфраструктура', icon: 'server' },
      { id: 'it/security',    label: 'Безопасность', icon: 'lock' },
    ]},
    { id: 'legal', icon: 'scale', label: 'Юридический', subs: [
      { id: 'legal/contracts', label: 'Договоры', icon: 'file-text' },
      { id: 'legal/licenses',  label: 'Лицензии аптек', icon: 'certificate' },
    ]},
  ]},
  { section: 'Топ-уровень', items: [
    { id: 'board',  icon: 'crown', label: 'Совет директоров' },
    { id: 'agents', icon: 'robot', label: 'AI-агенты' },
  ]},
];

const TITLES: Record<string, string> = {
  overview: 'Обзор компании', alerts: 'Алерты', mozg: 'МОЗГ — Садыхан',
  'control/reputation': 'Репутация', 'control/nps': 'NPS и сервис',
  'control/revision': 'Ревизии', 'control/antifraud': 'Антифрод',
  'control/aggregators': 'Агрегаторы (Glovo / Яндекс / Wolt)',
  'control/cash': 'Кассы и чеки',
  'develop/procurement': 'Закуп', 'develop/categories': 'Категории товаров', 'develop/pricing': 'Ценообразование',
  'finance/reports': 'Финотчётность', 'finance/analytics': 'Аналитика', 'finance/accounting': 'Бухгалтерия',
  'hr/staff': 'Персонал', 'hr/rating': 'Рейтинг сотрудников', 'hr/training': 'Обучение',
  'marketing/promo': 'Акции', 'marketing/loyalty': 'Программа лояльности',
  'operations/licenses': 'Лицензии', 'operations/standards': 'Стандарты',
  'it/servicedesk': 'Service Desk', 'it/1c': '1С разработка', 'it/infra': 'Инфраструктура', 'it/security': 'Безопасность',
  'legal/contracts': 'Договоры', 'legal/licenses': 'Лицензии аптек',
  board: 'Совет директоров', agents: 'AI-агенты',
};

const MOZG_HINTS: Record<string, { text: string; level: 'crit' | 'warn' }[]> = {
  'control/antifraud': [
    { text: '34 отложенных чека в Астана-7 — паттерн совпадает с мошенничеством', level: 'crit' },
    { text: 'Glovo: расхождение 12 заказов в Алматы-2 за неделю', level: 'warn' },
  ],
  'control/nps': [
    { text: 'Рейтинг фармацевта Ахметовой Д. упал на 1.2 за месяц — 18 негативных отзывов', level: 'warn' },
  ],
  'control/aggregators': [
    { text: 'Яндекс Еда: 22 заказа не отражены в 1С — Алматы-2 и Алматы-4. Риск ₸88К', level: 'crit' },
  ],
  'control/revision': [
    { text: 'Алматы-3 просрочила плановую ревизию на 12 дней', level: 'crit' },
    { text: 'По 3 аптекам зафиксированы излишки — возможно пересортица', level: 'warn' },
  ],
  'develop/procurement': [
    { text: '34 SKU в дефиците — цены на аналоги не скорректированы, упущенная маржа ₸800К', level: 'crit' },
    { text: 'Сезонный рост спроса на антигистамины через 3 недели — увеличить заказ', level: 'warn' },
  ],
  'finance/reports': [
    { text: 'Расходы Астана-2 выросли на 18% при падении выручки — аномалия', level: 'crit' },
  ],
  'hr/staff': [
    { text: 'Алматы-3 — текучесть 14% совпадает с антифрод-зоной. Рекомендую проверку', level: 'crit' },
  ],
  'it/servicedesk': [
    { text: '1С Астана-2 не синхронизировалась 6 часов — финансовые данные неточны', level: 'crit' },
  ],
  board: [
    { text: 'Рост выручки маскирует падение NPS — рекомендую KPI по сервису для директоров', level: 'crit' },
    { text: 'Алматы-3: тройная аномалия — антифрод + текучесть + жалобы. Нужна проверка', level: 'crit' },
  ],
  overview: [
    { text: 'Выручка растёт +4% но NPS падает −6 — клиенты платят но недовольны', level: 'crit' },
    { text: 'Алматы-3: текучесть кадров совпадает с зоной антифрод-аномалий', level: 'crit' },
  ],
};

// ─── Helpers ──────────────────────────────────────────────
function KPIGrid({ items }: { items: { label: string; value: string; delta?: string; color?: string }[] }) {
  const vc: Record<string, string> = { green: 'text-emerald-700', red: 'text-red-700', amber: 'text-amber-700', gray: 'text-gray-900' };
  return (
    <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)` }}>
      {items.map(k => (
        <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-3">
          <div className="text-xs text-gray-500 mb-1">{k.label}</div>
          <div className={`text-2xl font-semibold ${vc[k.color || 'gray']}`}>{k.value}</div>
          {k.delta && <div className="text-xs text-gray-400 mt-1">{k.delta}</div>}
        </div>
      ))}
    </div>
  );
}

function Card({ title, subtitle, children }: { title?: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
      {title && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function AlertRow({ icon, color, title, meta, level = 'warn' }: { icon: string; color: string; title: string; meta: string; level?: 'crit' | 'warn' | 'ok' }) {
  const bg: Record<string, string> = { red: 'bg-red-50', amber: 'bg-amber-50', green: 'bg-emerald-50', purple: 'bg-purple-50', blue: 'bg-blue-50' };
  const ic: Record<string, string> = { red: 'text-red-600', amber: 'text-amber-600', green: 'text-emerald-600', purple: 'text-purple-600', blue: 'text-blue-600' };
  const lb = { crit: 'bg-red-100 text-red-700', warn: 'bg-amber-100 text-amber-700', ok: 'bg-emerald-100 text-emerald-700' };
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors mb-2">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${bg[color]}`}>
        <i className={`ti ti-${icon} text-sm ${ic[color]}`}></i>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-900 leading-relaxed">{title}</div>
        <div className="text-xs text-gray-400 mt-0.5">{meta}</div>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${lb[level]}`}>
        {level === 'crit' ? 'Критично' : level === 'warn' ? 'Внимание' : 'OK'}
      </span>
    </div>
  );
}

function Bar({ label, pct, color, val }: { label: string; pct: number; color: string; val: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-xs text-gray-500 w-36 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }}></div>
      </div>
      <span className="text-xs text-gray-600 w-20 text-right flex-shrink-0 font-medium">{val}</span>
    </div>
  );
}

function StatusDot({ s }: { s: 'ok' | 'warn' | 'crit' | 'off' }) {
  const c = { ok: 'bg-emerald-500', warn: 'bg-amber-400', crit: 'bg-red-500', off: 'bg-gray-300' };
  return <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${c[s]}`}></span>;
}

function MozgPanel({ pageId }: { pageId: string }) {
  const [open, setOpen] = useState(false);
  const hints = MOZG_HINTS[pageId];
  if (!hints || hints.length === 0) return null;
  const hasCrit = hints.some(h => h.level === 'crit');
  return (
    <div className={`mb-4 rounded-xl border-2 transition-all ${hasCrit ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 p-3 text-left">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${hasCrit ? 'bg-red-100' : 'bg-amber-100'}`}>
          <i className={`ti ti-brain text-sm ${hasCrit ? 'text-red-700' : 'text-amber-700'}`}></i>
        </div>
        <span className="text-xs font-semibold text-gray-900">МОЗГ — Садыхан</span>
        <span className="text-xs text-gray-500 ml-1">· {hints.length} замечания</span>
        <i className={`ti ti-chevron-${open ? 'up' : 'down'} text-gray-400 text-sm ml-auto`}></i>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 border-t border-white/50 pt-2">
          {hints.map((h, i) => (
            <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg ${h.level === 'crit' ? 'bg-red-100' : 'bg-amber-100'}`}>
              <i className={`ti ti-${h.level === 'crit' ? 'alert-circle' : 'info-circle'} text-sm mt-0.5 flex-shrink-0 ${h.level === 'crit' ? 'text-red-700' : 'text-amber-700'}`}></i>
              <span className="text-xs text-gray-800 leading-relaxed">{h.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page Components ───────────────────────────────────────
function PageOverview({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div>
      <MozgPanel pageId="overview" />
      <KPIGrid items={[
        { label: 'Рейтинг сети', value: '3.48', delta: '↓ −0.14 vs пр. мес.', color: 'amber' },
        { label: 'NPS', value: '44', delta: '↓ −6 за неделю', color: 'amber' },
        { label: 'Выручка май', value: '₸48.2М', delta: '↑ план 96%', color: 'green' },
        { label: 'Алертов', value: '4', delta: '3 критических', color: 'red' },
      ]} />
      <div className="grid grid-cols-2 gap-3">
        <Card title="Отделы — статус" subtitle="сегодня">
          {[
            { id: 'control/antifraud', icon: 'shield-check', bg: '#FEF2F2', ic: '#B91C1C', name: 'Контроль и аудит', kpi: '3 тикета · Рейтинг 3.48', s: 'crit' },
            { id: 'develop/procurement', icon: 'trending-up', bg: '#FFFBEB', ic: '#92400E', name: 'Развитие', kpi: 'Дефицит 34 SKU', s: 'warn' },
            { id: 'finance/reports', icon: 'cash', bg: '#EFF6FF', ic: '#1D4ED8', name: 'Финансы', kpi: '₸48.2М · план 96%', s: 'ok' },
            { id: 'it/servicedesk', icon: 'device-desktop', bg: '#F5F3FF', ic: '#6D28D9', name: 'IT', kpi: '3 открытых заявки', s: 'warn' },
            { id: 'operations/licenses', icon: 'clipboard-check', bg: '#F0FDF4', ic: '#15803D', name: 'Операции', kpi: '2 лицензии истекают', s: 'warn' },
            { id: 'marketing/promo', icon: 'speakerphone', bg: '#FFF7ED', ic: '#C2410C', name: 'Маркетинг', kpi: '7 активных акций', s: 'ok' },
          ].map(d => (
            <div key={d.id} onClick={() => setPage(d.id)}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-150 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: d.bg }}>
                <i className={`ti ti-${d.icon} text-sm`} style={{ color: d.ic }}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900">{d.name}</div>
                <div className="text-xs text-gray-400">{d.kpi}</div>
              </div>
              <StatusDot s={d.s as any} />
            </div>
          ))}
        </Card>
        <Card title="Последние алерты">
          <AlertRow icon="alert-circle" color="red" title="Аномалия лояльности — Алматы-3, ущерб ~₸45 000" meta="2 ч · Антифрод" level="crit" />
          <AlertRow icon="message-x" color="red" title="567 отзывов без ответа" meta="5 ч · Репутация" level="crit" />
          <AlertRow icon="package" color="amber" title="Дефицит 34 SKU — угроза продажам" meta="1 д · Закуп" level="warn" />
          <AlertRow icon="device-desktop" color="purple" title="1С ошибка синхронизации Астана-2" meta="3 ч · IT" level="warn" />
        </Card>
      </div>
    </div>
  );
}

function PageRevision() {
  return (
    <div>
      <MozgPanel pageId="control/revision" />
      <KPIGrid items={[
        { label: 'Аптек всего', value: '24' },
        { label: 'Ревизий в этом месяце', value: '18', color: 'green' },
        { label: 'Просрочено', value: '2', color: 'red' },
        { label: 'Средняя недостача', value: '₸12К', color: 'amber' },
      ]} />
      <Card title="График ревизий" subtitle="май–июнь 2026">
        <div className="space-y-2">
          {[
            { name: 'Алматы-1', date: '02.06', status: 'ok', result: 'Норма', diff: '₸0' },
            { name: 'Алматы-2', date: '04.06', status: 'ok', result: 'Излишки', diff: '+₸3 200' },
            { name: 'Алматы-3', date: '—', status: 'crit', result: 'Просрочена', diff: '−' },
            { name: 'Астана-1', date: '01.06', status: 'ok', result: 'Норма', diff: '₸0' },
            { name: 'Астана-7', date: '03.06', status: 'warn', result: 'Недостача', diff: '−₸48 200' },
            { name: 'Шымкент-1', date: '05.06', status: 'ok', result: 'Норма', diff: '₸0' },
            { name: 'Шымкент-2', date: '—', status: 'crit', result: 'Просрочена', diff: '−' },
          ].map(r => (
            <div key={r.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <StatusDot s={r.status as any} />
              <span className="text-xs font-medium text-gray-900 w-24">{r.name}</span>
              <span className="text-xs text-gray-400 w-16">{r.date}</span>
              <span className={`text-xs flex-1 ${r.status === 'crit' ? 'text-red-600' : r.status === 'warn' ? 'text-amber-600' : 'text-emerald-600'}`}>{r.result}</span>
              <span className={`text-xs font-medium ${r.diff.startsWith('-') ? 'text-red-600' : r.diff.startsWith('+') ? 'text-emerald-600' : 'text-gray-400'}`}>{r.diff}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Акты недостач" subtitle="требуют закрытия">
        <AlertRow icon="alert-triangle" color="red" title="Астана-7 — недостача ₸48 200 по итогам ревизии 03.06. Ответственный: зав. аптекой Сейткали М." meta="Открыт · Срок закрытия: 10.06" level="crit" />
        <AlertRow icon="info-circle" color="amber" title="Алматы-2 — излишки на ₸3 200. Возможна пересортица. Требует объяснительной" meta="Открыт · Срок: 08.06" level="warn" />
      </Card>
    </div>
  );
}

function PageAntifraud() {
  return (
    <div>
      <MozgPanel pageId="control/antifraud" />
      <KPIGrid items={[
        { label: 'Открытых тикетов', value: '3', color: 'red' },
        { label: 'Решено за месяц', value: '41', color: 'green' },
        { label: 'Предотвращён ущерб', value: '₸1.2М', color: 'green' },
        { label: 'Среднее время реакции', value: '18 ч', color: 'amber' },
      ]} />
      <Card title="Активные тикеты">
        <AlertRow icon="alert-circle" color="red" title="Алматы-3 — систематическое использование лояльности каждую пятницу 18–20:00, паттерн 6 недель подряд" meta="Открыт 2 ч · Назначен: СБ" level="crit" />
        <AlertRow icon="receipt-2" color="red" title="Астана-7 — кассир Мухамедова: все 34 чека пробиты в 20:00 одновременно. Налоговый риск" meta="Открыт 4 ч · Назначен: Гл. бухгалтер" level="crit" />
        <AlertRow icon="package" color="amber" title="Алматы-5 — недостача по ВТД: 50 единиц из последней поставки не оприходованы" meta="Открыт 1 д · Назначен: Склад" level="warn" />
      </Card>
      <Card title="Топ нарушений по филиалам" subtitle="за месяц">
        <Bar label="Алматы-3" pct={88} color="#EF4444" val="12 случаев" />
        <Bar label="Астана-7" pct={65} color="#F97316" val="8 случаев" />
        <Bar label="Алматы-5" pct={40} color="#F59E0B" val="5 случаев" />
        <Bar label="Шымкент-1" pct={25} color="#10B981" val="3 случая" />
      </Card>
    </div>
  );
}

function PageAggregators() {
  return (
    <div>
      <MozgPanel pageId="control/aggregators" />
      <KPIGrid items={[
        { label: 'Аптек в агрегаторах', value: '22 из 24', color: 'green' },
        { label: 'Расхождений за неделю', value: '47', color: 'red' },
        { label: 'Сумма расхождений', value: '₸184К', color: 'red' },
        { label: 'Последняя сверка', value: 'Сегодня 9:00', color: 'green' },
      ]} />
      <Card title="Сверка по агрегаторам" subtitle="за последние 7 дней">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { name: 'Glovo', orders: 1240, diff: 18, sum: '₸72К', s: 'warn' },
            { name: 'Яндекс Еда', orders: 890, diff: 22, sum: '₸88К', s: 'crit' },
            { name: 'Wolt', orders: 310, diff: 7, sum: '₸24К', s: 'warn' },
          ].map(ag => (
            <div key={ag.name} className="border border-gray-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">{ag.name}</span>
                <StatusDot s={ag.s as any} />
              </div>
              <div className="text-xs text-gray-500 mb-1">Заказов: <span className="font-medium text-gray-900">{ag.orders}</span></div>
              <div className="text-xs text-gray-500 mb-1">Расхождений: <span className="font-medium text-red-600">{ag.diff}</span></div>
              <div className="text-xs text-gray-500">Сумма: <span className="font-medium text-red-600">{ag.sum}</span></div>
            </div>
          ))}
        </div>
        <AlertRow icon="arrows-exchange" color="red" title="Яндекс Еда — 22 заказа приняты но не отражены в 1С. Алматы-2 и Алматы-4" meta="₸88К · Требует сверки" level="crit" />
        <AlertRow icon="arrows-exchange" color="amber" title="Glovo — 18 заказов с расхождением в составе. Возможно ручное изменение без уведомления" meta="₸72К · Проверить кассиров" level="warn" />
        <AlertRow icon="arrows-exchange" color="amber" title="Wolt — 7 отменённых заказов не возвращены в остатки 1С" meta="₸24К · Астана-1" level="warn" />
      </Card>
    </div>
  );
}

function PageCash() {
  return (
    <div>
      <MozgPanel pageId="control/cash" />
      <KPIGrid items={[
        { label: 'Чеков за сегодня', value: '4 218', color: 'green' },
        { label: 'Отложенных чеков', value: '34', color: 'red' },
        { label: 'Аннулированных', value: '12', color: 'amber' },
        { label: 'Средний чек', value: '₸3 420' },
      ]} />
      <Card title="Отложенные чеки по аптекам" subtitle="критично — требуют закрытия">
        {[
          { name: 'Астана-7', count: 14, sum: '₸48 200', s: 'crit' },
          { name: 'Алматы-3', count: 9, sum: '₸31 400', s: 'crit' },
          { name: 'Алматы-5', count: 7, sum: '₸24 100', s: 'warn' },
          { name: 'Шымкент-2', count: 4, sum: '₸13 800', s: 'warn' },
        ].map(r => (
          <div key={r.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100 mb-2">
            <StatusDot s={r.s as any} />
            <span className="text-xs font-medium text-gray-900 flex-1">{r.name}</span>
            <span className="text-xs text-red-600 font-medium">{r.count} чеков</span>
            <span className="text-xs text-gray-500">{r.sum}</span>
          </div>
        ))}
      </Card>
      <Card title="Аномалии">
        <AlertRow icon="clock" color="red" title="Астана-7: 34 чека пробиты одновременно в 20:00 — явная ошибка или фрод" meta="Кассир: Мухамедова · Сегодня" level="crit" />
        <AlertRow icon="receipt-off" color="amber" title="Алматы-3: 9 отложенных чека старше 3 дней — нарушение кассовой дисциплины" meta="Требует закрытия · ФНО риск" level="warn" />
      </Card>
    </div>
  );
}

function PageReputation() {
  return (
    <div>
      <KPIGrid items={[
        { label: 'Рейтинг сети', value: '3.48', delta: '↓ −0.14', color: 'amber' },
        { label: 'Всего отзывов', value: '4 182', delta: '↑ +312' },
        { label: 'Негативных', value: '1 063', color: 'red' },
        { label: 'Без ответа', value: '567', color: 'amber' },
      ]} />
      <Card title="По источникам">
        <Bar label="2ГИС" pct={70} color="#1D9E75" val="3.5 ★" />
        <Bar label="Google" pct={66} color="#4285F4" val="3.3 ★" />
        <Bar label="Яндекс" pct={72} color="#FFCC00" val="3.6 ★" />
        <Bar label="Glovo" pct={75} color="#FF6B35" val="3.75 ★" />
      </Card>
      <Card title="По филиалам" subtitle="худшие">
        <Bar label="Алматы-3" pct={58} color="#EF4444" val="2.9 ★" />
        <Bar label="Астана-7" pct={64} color="#F97316" val="3.2 ★" />
        <Bar label="Шымкент-2" pct={70} color="#F59E0B" val="3.5 ★" />
        <Bar label="Алматы-1" pct={82} color="#10B981" val="4.1 ★" />
      </Card>
    </div>
  );
}

function PageNPS() {
  return (
    <div>
      <MozgPanel pageId="control/nps" />
      <KPIGrid items={[
        { label: 'NPS', value: '44', delta: '↓ −6 за неделю', color: 'amber' },
        { label: 'Промоутеры', value: '58%', color: 'green' },
        { label: 'Пассивные', value: '28%' },
        { label: 'Детракторы', value: '14%', color: 'red' },
      ]} />
      <Card title="Рейтинг фармацевтов" subtitle="топ-5 худших за месяц">
        {[
          { name: 'Ахметова Д. (Алматы-3)', rating: 3.1, neg: 18, c: 'text-red-600' },
          { name: 'Сейткали М. (Астана-7)', rating: 3.4, neg: 12, c: 'text-amber-600' },
          { name: 'Жумагулов К. (Алматы-5)', rating: 3.6, neg: 8, c: 'text-amber-600' },
          { name: 'Нурланова А. (Шымкент-1)', rating: 3.8, neg: 5, c: 'text-gray-600' },
        ].map(f => (
          <div key={f.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 mb-2">
            <span className="text-xs text-gray-900 flex-1">{f.name}</span>
            <span className={`text-xs font-semibold ${f.c}`}>{f.rating} ★</span>
            <span className="text-xs text-red-500">{f.neg} негат.</span>
          </div>
        ))}
      </Card>
      <Card title="Топ категорий жалоб">
        <Bar label="Грубость персонала" pct={88} color="#EF4444" val="312 жалоб" />
        <Bar label="Долгое ожидание" pct={65} color="#F97316" val="231 жалоба" />
        <Bar label="Нет товара" pct={52} color="#F59E0B" val="184 жалобы" />
        <Bar label="Цены" pct={38} color="#10B981" val="136 жалоб" />
      </Card>
    </div>
  );
}

function PageMozg() {
  return (
    <div>
      <div className="bg-white border-2 border-emerald-400 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <i className="ti ti-brain text-emerald-700 text-2xl"></i>
          </div>
          <div>
            <div className="text-base font-bold text-emerald-800">МОЗГ — Садыхан</div>
            <div className="text-xs text-gray-500">Главный AI-агент · перекрёстная проверка всех отделов · доступ только АД и CEO</div>
          </div>
          <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">Активен</span>
        </div>
        <KPIGrid items={[
          { label: 'Агентов под контролем', value: '12', color: 'green' },
          { label: 'Противоречий найдено', value: '3', color: 'red' },
          { label: 'Последний доклад', value: 'Вчера' },
          { label: 'Следующий доклад', value: 'Завтра 9:00' },
        ]} />
      </div>
      <Card title="Противоречия между отделами" subtitle="требуют решения руководства">
        <AlertRow icon="arrows-exchange" color="red" title="Выручка растёт +4% но NPS падает −6. Рекомендация: аудит сервиса в топ-аптеках" meta="Финансы ↔ Контроль" level="crit" />
        <AlertRow icon="arrows-exchange" color="red" title="34 SKU в дефиците но цены на аналоги не скорректированы. Упущенная маржа ~₸800К" meta="Закуп ↔ Ценообразование" level="crit" />
        <AlertRow icon="arrows-exchange" color="amber" title="Алматы-3: текучесть 14% совпадает с антифрод-зоной — рекомендована внутренняя проверка" meta="HR ↔ Антифрод" level="warn" />
      </Card>
    </div>
  );
}

// ─── Page router ──────────────────────────────────────────
function renderPage(page: string, setPage: (p: string) => void) {
  switch (page) {
    case 'overview': return <PageOverview setPage={setPage} />;
    case 'mozg': return <PageMozg />;
    case 'control/reputation': return <PageReputation />;
    case 'control/nps': return <PageNPS />;
    case 'control/revision': return <PageRevision />;
    case 'control/antifraud': return <PageAntifraud />;
    case 'control/aggregators': return <PageAggregators />;
    case 'control/cash': return <PageCash />;
    case 'develop/procurement': return (
      <div>
        <MozgPanel pageId="develop/procurement" />
        <KPIGrid items={[{ label: 'SKU всего', value: '2 840' }, { label: 'Дефицит', value: '34', color: 'red' }, { label: 'Активных заказов', value: '12', color: 'amber' }, { label: 'Оборачиваемость', value: '18 дн.', color: 'green' }]} />
        <Card title="Товары в дефиците" subtitle="срочно заказать">
          {[{ name: 'Нурофен 400мг №10', stock: 0, reorder: 200 }, { name: 'Амоксициллин 500мг №20', stock: 3, reorder: 150 }, { name: 'Лоратадин 10мг №30', stock: 5, reorder: 300 }].map(r => (
            <div key={r.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-red-50 border border-red-100 mb-2">
              <StatusDot s="crit" /><span className="text-xs text-gray-900 flex-1">{r.name}</span>
              <span className="text-xs text-red-600">Остаток: {r.stock}</span>
              <span className="text-xs text-gray-500">Заказ: {r.reorder} шт</span>
            </div>
          ))}
        </Card>
      </div>
    );
    case 'develop/categories': return (
      <div>
        <KPIGrid items={[{ label: 'Категорий A', value: '284', color: 'green' }, { label: 'Категорий B', value: '710', color: 'amber' }, { label: 'Категорий C', value: '1 846', color: 'red' }, { label: 'На вывод', value: '43', color: 'amber' }]} />
        <Card title="ABC-анализ">
          <Bar label="Кат. A (80% выручки)" pct={80} color="#10B981" val="284 SKU" />
          <Bar label="Кат. B (15% выручки)" pct={25} color="#F59E0B" val="710 SKU" />
          <Bar label="Кат. C (5% выручки)" pct={65} color="#EF4444" val="1846 SKU" />
        </Card>
      </div>
    );
    case 'develop/pricing': return (
      <div>
        <KPIGrid items={[{ label: 'Ср. маржа', value: '28%', color: 'green' }, { label: 'Ниже рынка', value: '127', color: 'red' }, { label: 'Выше рынка', value: '84', color: 'amber' }, { label: 'Конкурентов', value: '6' }]} />
      </div>
    );
    case 'finance/reports': return (
      <div>
        <MozgPanel pageId="finance/reports" />
        <KPIGrid items={[{ label: 'Выручка май', value: '₸48.2М', delta: '↑ +4.1%', color: 'green' }, { label: 'Расходы', value: '₸31.1М' }, { label: 'Прибыль', value: '₸17.1М', color: 'green' }, { label: 'План', value: '96%', color: 'green' }]} />
        <Card title="По филиалам">
          <Bar label="Алматы-1" pct={95} color="#10B981" val="₸9.1М" />
          <Bar label="Алматы-2" pct={82} color="#10B981" val="₸7.8М" />
          <Bar label="Астана-1" pct={71} color="#F59E0B" val="₸6.8М" />
          <Bar label="Астана-2" pct={60} color="#F59E0B" val="₸5.7М" />
          <Bar label="Шымкент" pct={48} color="#EF4444" val="₸4.6М" />
        </Card>
      </div>
    );
    case 'finance/analytics': return <div><KPIGrid items={[{ label: 'Выручка vs план', value: '96%', color: 'green' }, { label: 'Прогноз июнь', value: '₸51М', color: 'green' }, { label: 'Расходы vs план', value: '102%', color: 'amber' }, { label: 'EBITDA', value: '35.5%', color: 'green' }]} /></div>;
    case 'finance/accounting': return <div><KPIGrid items={[{ label: 'Документов обработано', value: '1 248', color: 'green' }, { label: 'Ошибок', value: '2', color: 'red' }, { label: 'Точность', value: '99.1%', color: 'green' }, { label: 'Сверок завершено', value: '48/50', color: 'green' }]} /></div>;
    case 'hr/staff': return (
      <div>
        <MozgPanel pageId="hr/staff" />
        <KPIGrid items={[{ label: 'Сотрудников', value: '214' }, { label: 'Вакансий', value: '8', color: 'amber' }, { label: 'Текучесть', value: '6.2%', delta: 'Цель: <5%', color: 'amber' }, { label: 'На обучении', value: '31', color: 'green' }]} />
        <Card title="Текучесть по филиалам">
          <Bar label="Алматы-3" pct={88} color="#EF4444" val="14%" />
          <Bar label="Астана-7" pct={60} color="#F97316" val="9.6%" />
          <Bar label="Шымкент-2" pct={40} color="#F59E0B" val="6.4%" />
          <Bar label="Алматы-1" pct={20} color="#10B981" val="3.2%" />
        </Card>
      </div>
    );
    case 'hr/rating': return <div><PageNPS /></div>;
    case 'hr/training': return <div><KPIGrid items={[{ label: 'На обучении', value: '31', color: 'green' }, { label: 'Завершили курс', value: '18', color: 'green' }, { label: 'Новых сотрудников', value: '5', color: 'amber' }, { label: 'Ср. балл теста', value: '87%', color: 'green' }]} /></div>;
    case 'it/servicedesk': return (
      <div>
        <MozgPanel pageId="it/servicedesk" />
        <KPIGrid items={[{ label: 'Открытых заявок', value: '3', color: 'amber' }, { label: 'Выполнено за месяц', value: '47', color: 'green' }, { label: 'Среднее время', value: '4.2 ч', color: 'amber' }]} />
        <Card title="Заявки в работе">
          {[{ p: 'high', t: '1С — ошибка синхронизации Астана-2', f: 'Финансы · 3 ч', s: 'В работе' }, { p: 'med', t: 'Кассовый терминал не печатает — Алматы-5', f: 'Операции · 6 ч', s: 'Назначено' }, { p: 'low', t: 'Доступ к порталу для нового сотрудника', f: 'HR · 1 д', s: 'Очередь' }].map((r, i) => {
            const pc: Record<string, string> = { high: 'bg-red-100 text-red-700', med: 'bg-amber-100 text-amber-700', low: 'bg-emerald-100 text-emerald-700' };
            const pl: Record<string, string> = { high: 'Высокий', med: 'Средний', low: 'Низкий' };
            return (
              <div key={i} className="flex items-center gap-3 p-2.5 border border-gray-100 rounded-lg mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${pc[r.p]}`}>{pl[r.p]}</span>
                <div className="flex-1"><div className="text-xs font-medium text-gray-900">{r.t}</div><div className="text-xs text-gray-400">{r.f}</div></div>
                <span className="text-xs text-gray-500">{r.s}</span>
              </div>
            );
          })}
        </Card>
      </div>
    );
    case 'it/1c': return <div><KPIGrid items={[{ label: 'Задач в спринте', value: '8' }, { label: 'Выполнено', value: '5', color: 'green' }, { label: 'Критических багов', value: '1', color: 'red' }, { label: 'Синхронизаций/день', value: '24', color: 'green' }]} /></div>;
    case 'it/infra': return <div><KPIGrid items={[{ label: 'Серверов', value: '6' }, { label: 'Uptime', value: '99.8%', color: 'green' }, { label: 'Инцидентов', value: '0', color: 'green' }, { label: 'Бэкапов', value: '7/7', color: 'green' }]} /></div>;
    case 'it/security': return <div><KPIGrid items={[{ label: 'Активных доступов', value: '214' }, { label: 'Подозрительных входов', value: '2', color: 'red' }, { label: 'Заблокировано', value: '1', color: 'amber' }, { label: 'Последний аудит', value: '01.06', color: 'green' }]} /></div>;
    case 'marketing/promo': return <div><KPIGrid items={[{ label: 'Активных акций', value: '7', color: 'green' }, { label: 'Конверсия', value: '12.4%', color: 'amber' }, { label: 'Доп. выручка', value: '₸4.2М', color: 'green' }, { label: 'ROI акций', value: '340%', color: 'green' }]} /></div>;
    case 'marketing/loyalty': return <div><KPIGrid items={[{ label: 'Участников', value: '48 200', color: 'green' }, { label: 'Активных', value: '31 400', color: 'green' }, { label: 'Повторные покупки', value: '64%', color: 'green' }, { label: 'Ср. чек с картой', value: '₸4 800', color: 'green' }]} /></div>;
    case 'operations/licenses': return <div><KPIGrid items={[{ label: 'Лицензий всего', value: '24', color: 'green' }, { label: 'Истекают в 30 дн.', value: '2', color: 'amber' }, { label: 'Продлено в этом году', value: '5', color: 'green' }, { label: 'Проверок Минздрава', value: '0', color: 'green' }]} /></div>;
    case 'operations/standards': return <div><KPIGrid items={[{ label: 'Аптек проверено', value: '21/24', color: 'green' }, { label: 'Нарушений', value: '1', color: 'red' }, { label: 'Предписаний', value: '2', color: 'amber' }, { label: 'Устранено', value: '1/2', color: 'amber' }]} /></div>;
    case 'legal/contracts': return <div><KPIGrid items={[{ label: 'Активных договоров', value: '84' }, { label: 'Истекают в 30 дн.', value: '6', color: 'amber' }, { label: 'На подписании', value: '3', color: 'amber' }, { label: 'Просроченных', value: '0', color: 'green' }]} /></div>;
    case 'legal/licenses': return <div><KPIGrid items={[{ label: 'Лицензий аптек', value: '24/24', color: 'green' }, { label: 'Истекают скоро', value: '2', color: 'amber' }, { label: 'Стоимость продления', value: '₸480К', color: 'gray' }, { label: 'Следующая проверка', value: '15.07', color: 'gray' }]} /></div>;
    case 'board': return (
      <div>
        <MozgPanel pageId="board" />
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3"><i className="ti ti-brain text-emerald-700"></i><span className="text-sm font-bold text-emerald-800">Еженедельный доклад МОЗГ</span><span className="ml-auto text-xs text-gray-400">4 июня 2026</span></div>
          <AlertRow icon="trending-up" color="green" title="Выручка растёт +4.1% но NPS падает. Нужно решение на уровне операций" meta="МОЗГ · Приоритет 1" level="crit" />
          <AlertRow icon="alert-triangle" color="amber" title="Алматы-3 — тройная аномалия: антифрод + текучесть + жалобы. Рекомендована проверка" meta="МОЗГ · Приоритет 2" level="crit" />
        </div>
        <KPIGrid items={[{ label: 'Выручка май', value: '₸48.2М', delta: '↑ план 96%', color: 'green' }, { label: 'NPS', value: '44', delta: '↓ −6', color: 'amber' }, { label: 'Рейтинг сети', value: '3.48', color: 'amber' }, { label: 'Крит. алертов', value: '3', color: 'red' }]} />
      </div>
    );
    case 'agents': return (
      <div>
        <div className="bg-white border-2 border-emerald-400 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><i className="ti ti-brain text-emerald-700 text-xl"></i></div><div><div className="text-sm font-bold text-emerald-800">МОЗГ — Садыхан</div><div className="text-xs text-gray-500">Перекрёстная проверка всех агентов · еженедельный доклад CEO и АД</div></div><span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Активен</span></div>
        </div>
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Активные</div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{ name: 'NPS-агент', desc: 'Анализирует отзывы, задачи фармацевтам, рейтинг сотрудников', s: 'active' }, { name: 'Агент репутации', desc: 'Мониторит 2ГИС/Google/Яндекс каждый час', s: 'active' }, { name: 'IT Service агент', desc: 'Принимает заявки, распределяет по приоритету', s: 'dev' }].map(a => (
            <div key={a.name} className="bg-white border border-gray-200 rounded-xl p-3">
              <div className="flex justify-between gap-2 mb-2"><span className="text-xs font-semibold text-gray-900">{a.name}</span><span className={`text-xs px-2 py-0.5 rounded-full ${a.s === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{a.s === 'active' ? 'Активен' : 'Разработка'}</span></div>
              <div className="text-xs text-gray-500 leading-relaxed">{a.desc}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Запланированные</div>
        <div className="grid grid-cols-3 gap-3">
          {[{ name: 'Антифрод-агент', desc: 'Аномалии лояльности и кассы → тикет СБ' }, { name: 'Агент агрегаторов', desc: 'Сверка Glovo/Яндекс/Wolt с 1С ежедневно' }, { name: 'Reorder-агент', desc: 'Остатки ниже минимума → авто-заявка' }, { name: 'Финансовый агент', desc: 'P&L авто-генерация, план-факт, Cash flow' }, { name: 'Агент ревизий', desc: 'Планирует ревизии, фиксирует результаты' }, { name: '1С-агент', desc: 'Мониторинг ошибок синхронизации' }].map(a => (
            <div key={a.name} className="bg-white border border-gray-200 rounded-xl p-3">
              <div className="flex justify-between gap-2 mb-2"><span className="text-xs font-semibold text-gray-900">{a.name}</span><span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Запланирован</span></div>
              <div className="text-xs text-gray-500 leading-relaxed">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
    case 'alerts': return (
      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Критические</div>
        <AlertRow icon="alert-circle" color="red" title="Аномалия лояльности — Алматы-3, каждую пятницу 18–20:00, ущерб ~₸45 000" meta="2 ч · Антифрод · Открыт" level="crit" />
        <AlertRow icon="receipt-2" color="red" title="Кассир Астана-7 — все 34 чека одновременно в 20:00, налоговый риск" meta="4 ч · Антифрод · Открыт" level="crit" />
        <AlertRow icon="message-x" color="red" title="567 отзывов без ответа — норматив 18% превышен" meta="5 ч · Репутация · Открыт" level="crit" />
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 mt-4">Предупреждения</div>
        <AlertRow icon="chart-line-down" color="amber" title="NPS снизился на 6 пунктов за неделю" meta="2 д · NPS" level="warn" />
        <AlertRow icon="device-desktop" color="purple" title="1С ошибка синхронизации Астана-2" meta="3 ч · IT" level="warn" />
      </div>
    );
    default: return <div className="text-sm text-gray-400 p-4">Раздел в разработке</div>;
  }
}

// ─── Main ─────────────────────────────────────────────────
export default function PortalPage() {
  const [page, setPage] = useState('overview');
  const [openDepts, setOpenDepts] = useState<Record<string, boolean>>({ control: true });
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const toggleDept = (id: string) => setOpenDepts(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-sm">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ti ti-building-store text-white text-base"></i>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">Садыхан</div>
              <div className="text-xs text-gray-400">Корп. платформа</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-1">
          {NAV.map(sec => (
            <div key={sec.section}>
              <div className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-3 pb-1 font-medium">{sec.section}</div>
              {sec.items.map((it: any) => (
                <div key={it.id}>
                  {/* Parent item */}
                  <button
                    onClick={() => { if (it.subs) { toggleDept(it.id); } else { setPage(it.id); } }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs border-l-2 transition-all duration-150 text-left ${page === it.id || page.startsWith(it.id + '/') ? 'bg-emerald-50 text-emerald-800 border-emerald-500 font-semibold' : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'}`}>
                    <i className={`ti ti-${it.icon} text-sm flex-shrink-0 ${page === it.id || page.startsWith(it.id + '/') ? 'text-emerald-600' : 'text-gray-400'}`}></i>
                    <span className="flex-1 truncate">{it.label}</span>
                    {it.badge && <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${it.bc === 'red' ? 'bg-red-100 text-red-700' : it.bc === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{it.badge}</span>}
                    {it.subs && <i className={`ti ti-chevron-${openDepts[it.id] ? 'up' : 'down'} text-gray-400 text-xs transition-transform duration-200`}></i>}
                  </button>

                  {/* Sub-items */}
                  {it.subs && openDepts[it.id] && (
                    <div className="ml-3 border-l border-gray-100 pl-2">
                      {it.subs.map((sub: any) => (
                        <button key={sub.id} onClick={() => setPage(sub.id)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg transition-all duration-150 text-left my-0.5 ${page === sub.id ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
                          <i className={`ti ti-${sub.icon} text-xs flex-shrink-0 ${page === sub.id ? 'text-emerald-600' : 'text-gray-400'}`}></i>
                          <span className="truncate">{sub.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">АД</div>
          <div className="min-w-0"><div className="text-xs font-semibold text-gray-900">АД</div><div className="text-xs text-gray-400 truncate">Владелец · Полный доступ</div></div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-5 h-12 flex items-center gap-3 flex-shrink-0">
          <div className="text-sm font-semibold text-gray-900">{TITLES[page] || page}</div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setPage('alerts')} className="bg-red-50 text-red-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium hover:bg-red-100 transition-colors">
              <i className="ti ti-alert-triangle text-xs"></i> 4 алерта
            </button>
            <button onClick={() => setPage('mozg')} className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium hover:bg-emerald-100 transition-colors">
              <i className="ti ti-brain text-xs"></i> МОЗГ
            </button>
            <i className="ti ti-bell text-gray-400 text-base cursor-pointer hover:text-gray-600 transition-colors"></i>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {renderPage(page, setPage)}
        </div>
      </div>
    </div>
  );
}
