'use client';
import { useState, useEffect, lazy, Suspense } from 'react';

const FinanceAgentPage = lazy(() => import('./finance/agent/page'));

// ─── COLORS (Sadykhan brand) ───────────────────────────────
// Dark green bg: #0A2218
// Sidebar: #0D2B1F
// Card: #122D20
// Teal accent: #1D9E75
// Orange accent: #F97316
// White text: #F8FAF9

// ─── NAV ──────────────────────────────────────────────────
const NAV = [
  { section: 'Главная', items: [
    { id: 'overview', icon: 'layout-dashboard', label: 'Обзор' },
    { id: 'alerts',   icon: 'bell',             label: 'Алерты', badge: '4' },
  ]},
  { section: 'Отделы', items: [
    { id: 'control',    icon: 'shield-check',    label: 'Контроль и аудит', subs: [
      { id: 'control/reputation',  icon: 'star',           label: 'Репутация' },
      { id: 'control/nps',         icon: 'heart',          label: 'NPS и сервис' },
      { id: 'control/revision',    icon: 'clipboard-list', label: 'Ревизии' },
      { id: 'control/antifraud',   icon: 'shield-x',       label: 'Антифрод' },
      { id: 'control/aggregators', icon: 'truck-delivery', label: 'Агрегаторы' },
      { id: 'control/cash',        icon: 'receipt',        label: 'Кассы и чеки' },
    ]},
    { id: 'retail',     icon: 'building-store',  label: 'Розница', subs: [
      { id: 'retail/network',   icon: 'map-pin',     label: 'Сеть аптек' },
      { id: 'retail/managers',  icon: 'users',       label: 'Менеджеры' },
      { id: 'retail/kpi',       icon: 'chart-bar',   label: 'KPI розницы' },
    ]},
    { id: 'wholesale',  icon: 'truck',           label: 'Опт', subs: [
      { id: 'wholesale/clients',  icon: 'building',    label: 'Клиенты' },
      { id: 'wholesale/orders',   icon: 'package',     label: 'Заказы' },
      { id: 'wholesale/buyers',   icon: 'users',       label: 'Закупщики' },
    ]},
    { id: 'develop',    icon: 'trending-up',     label: 'Развитие', subs: [
      { id: 'develop/procurement', icon: 'package',  label: 'Закуп' },
      { id: 'develop/categories',  icon: 'category', label: 'Категории' },
      { id: 'develop/pricing',     icon: 'tag',      label: 'Ценообразование' },
    ]},
    { id: 'finance',    icon: 'cash',            label: 'Финансы', subs: [
      { id: 'finance/reports',    icon: 'file-analytics', label: 'Финотчётность' },
      { id: 'finance/analytics',  icon: 'chart-bar',      label: 'Аналитика' },
      { id: 'finance/accounting', icon: 'calculator',     label: 'Бухгалтерия' },
      { id: 'finance/agent',      icon: 'robot',          label: 'AI-аналитик' },
    ]},
    { id: 'hr',         icon: 'users',           label: 'HR', subs: [
      { id: 'hr/staff',    icon: 'user',   label: 'Персонал' },
      { id: 'hr/rating',   icon: 'award',  label: 'Рейтинг' },
      { id: 'hr/training', icon: 'school', label: 'Обучение' },
    ]},
    { id: 'marketing',  icon: 'speakerphone',    label: 'Маркетинг', subs: [
      { id: 'marketing/promo',   icon: 'discount', label: 'Акции' },
      { id: 'marketing/loyalty', icon: 'gift',     label: 'Лояльность' },
    ]},
    { id: 'operations', icon: 'clipboard-check', label: 'Операции', subs: [
      { id: 'operations/licenses',  icon: 'certificate', label: 'Лицензии' },
      { id: 'operations/standards', icon: 'checklist',   label: 'Стандарты' },
    ]},
    { id: 'it',         icon: 'device-desktop',  label: 'IT', badge: '3', subs: [
      { id: 'it/servicedesk', icon: 'ticket', label: 'Service Desk' },
      { id: 'it/1c',          icon: 'code',   label: '1С разработка' },
      { id: 'it/infra',       icon: 'server', label: 'Инфраструктура' },
      { id: 'it/security',    icon: 'lock',   label: 'Безопасность' },
    ]},
    { id: 'legal',      icon: 'scale',           label: 'Юридический', subs: [
      { id: 'legal/contracts', icon: 'file-text',    label: 'Договоры' },
      { id: 'legal/licenses',  icon: 'certificate',  label: 'Лицензии аптек' },
    ]},
  ]},
  { section: 'Топ-уровень', items: [
    { id: 'board',  icon: 'crown', label: 'Совет директоров' },
    { id: 'agents', icon: 'robot', label: 'AI-агенты' },
  ]},
];

const TITLES: Record<string,string> = {
  overview:'Обзор компании', alerts:'Алерты',
  'control/reputation':'Репутация', 'control/nps':'NPS и сервис',
  'control/revision':'Ревизии', 'control/antifraud':'Антифрод',
  'control/aggregators':'Агрегаторы', 'control/cash':'Кассы и чеки',
  'retail/network':'Сеть аптек', 'retail/managers':'Менеджеры розницы', 'retail/kpi':'KPI розницы',
  'wholesale/clients':'Клиенты опта', 'wholesale/orders':'Заказы опта', 'wholesale/buyers':'Закупщики',
  'develop/procurement':'Закуп', 'develop/categories':'Категории', 'develop/pricing':'Ценообразование',
  'finance/reports':'Финотчётность', 'finance/analytics':'Аналитика', 'finance/accounting':'Бухгалтерия', 'finance/agent':'AI-аналитик',
  'hr/staff':'Персонал', 'hr/rating':'Рейтинг сотрудников', 'hr/training':'Обучение',
  'marketing/promo':'Акции', 'marketing/loyalty':'Лояльность',
  'operations/licenses':'Лицензии', 'operations/standards':'Стандарты',
  'it/servicedesk':'Service Desk', 'it/1c':'1С разработка', 'it/infra':'Инфраструктура', 'it/security':'Безопасность',
  'legal/contracts':'Договоры', 'legal/licenses':'Лицензии аптек',
  board:'Совет директоров', agents:'AI-агенты',
};

const MOZG: Record<string,{text:string,level:'crit'|'warn'}[]> = {
  overview:[
    {text:'Выручка растёт +4% но NPS падает −6 — клиенты платят но недовольны. Требует немедленного внимания.',level:'crit'},
    {text:'Алматы-3: тройная аномалия — антифрод + текучесть + жалобы. Рекомендую внутреннюю проверку.',level:'crit'},
  ],
  'control/antifraud':[
    {text:'34 отложенных чека в Астана-7 — паттерн 3 недели подряд. Высокая вероятность намеренных действий.',level:'crit'},
    {text:'Glovo: 12 заказов не отражены в 1С за неделю — Алматы-2. Риск ₸48К.',level:'warn'},
  ],
  'control/nps':[
    {text:'Фармацевт Ахметова Д. (Алматы-3) — 18 негативных отзывов за месяц. Рейтинг 3.1. Требует беседы.',level:'crit'},
    {text:'Время ответа на отзывы 8.2ч при цели 4ч. Рекомендую агента авто-ответов.',level:'warn'},
  ],
  'control/aggregators':[
    {text:'Яндекс Еда: 22 заказа приняты но не в 1С. Алматы-2 и Алматы-4. Риск ₸88К.',level:'crit'},
    {text:'Wolt: 7 отменённых заказов не возвращены в остатки. Астана-1.',level:'warn'},
  ],
  'control/cash':[
    {text:'Астана-7: 34 чека одновременно в 20:00 — налоговый риск. Передано в СБ.',level:'crit'},
    {text:'9 отложенных чеков в Алматы-3 старше 3 дней — нарушение ФНО.',level:'warn'},
  ],
  'control/revision':[
    {text:'Алматы-3 просрочила плановую ревизию на 12 дней. Требует объяснительной.',level:'crit'},
    {text:'Астана-7: недостача ₸48 200 по ревизии 03.06. Срок закрытия акта: 10.06.',level:'warn'},
  ],
  'retail/network':[
    {text:'Алматы-3 показывает падение по всем метрикам: выручка −8%, NPS 2.9, текучесть 14%.',level:'crit'},
    {text:'Шымкент-2: рейтинг 3.5 — ниже среднего по сети. Рекомендую аудит.',level:'warn'},
  ],
  'wholesale/orders':[
    {text:'3 крупных клиента не сделали заказ 2 недели подряд — риск потери контракта.',level:'crit'},
  ],
  'develop/procurement':[
    {text:'34 SKU в дефиците — цены на аналоги не скорректированы. Упущенная маржа ₸800К.',level:'crit'},
    {text:'Сезонный рост на антигистамины через 3 недели. Рекомендую увеличить заказ на 40%.',level:'warn'},
  ],
  'finance/reports':[
    {text:'Расходы Астана-2 выросли на 18% при падении выручки — аномалия требует проверки.',level:'crit'},
  ],
  'hr/staff':[
    {text:'Алматы-3: текучесть 14% совпадает с антифрод-зоной. Рекомендую проверку персонала.',level:'crit'},
    {text:'8 вакансий открыты более 30 дней — риск перегрузки действующих сотрудников.',level:'warn'},
  ],
  'it/servicedesk':[
    {text:'1С Астана-2 не синхронизировалась 6 часов — финансовые данные могут быть неточными.',level:'crit'},
  ],
  board:[
    {text:'Ключевой риск: рост выручки маскирует падение качества. Рекомендую KPI по NPS для директоров.',level:'crit'},
    {text:'Алматы-3 требует комплексного расследования: 4 аномалии одновременно.',level:'crit'},
  ],
};

// ─── Components ────────────────────────────────────────────
function KPIGrid({items}:{items:{label:string,value:string,delta?:string,color?:string}[]}) {
  const vc:Record<string,string> = {green:'text-teal-400',red:'text-red-400',amber:'text-orange-400',gray:'text-white'};
  return (
    <div className="grid gap-3 mb-4" style={{gridTemplateColumns:`repeat(${Math.min(items.length,4)},1fr)`}}>
      {items.map(k=>(
        <div key={k.label} className="rounded-xl p-4 border border-white/10" style={{background:'rgba(255,255,255,0.05)'}}>
          <div className="text-xs mb-1.5" style={{color:'rgba(255,255,255,0.5)'}}>{k.label}</div>
          <div className={`text-2xl font-bold ${vc[k.color||'gray']}`}>{k.value}</div>
          {k.delta&&<div className="text-xs mt-1" style={{color:'rgba(255,255,255,0.4)'}}>{k.delta}</div>}
        </div>
      ))}
    </div>
  );
}

function Card({title,subtitle,children,accent}:{title?:string,subtitle?:string,children:React.ReactNode,accent?:string}) {
  return (
    <div className="rounded-xl p-4 mb-3 border border-white/10" style={{background:'rgba(255,255,255,0.05)'}}>
      {title&&(
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">{title}</span>
          {subtitle&&<span className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>{subtitle}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function AlertRow({icon,title,meta,level='warn'}:{icon:string,title:string,meta:string,level?:'crit'|'warn'|'ok'}) {
  const cfg = {
    crit:{bg:'rgba(239,68,68,0.15)',ic:'text-red-400',badge:'bg-red-500/20 text-red-400',label:'Критично'},
    warn:{bg:'rgba(249,115,22,0.15)',ic:'text-orange-400',badge:'bg-orange-500/20 text-orange-400',label:'Внимание'},
    ok:  {bg:'rgba(29,158,117,0.15)',ic:'text-teal-400', badge:'bg-teal-500/20 text-teal-400',  label:'OK'},
  }[level];
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl mb-2 border border-white/5" style={{background:cfg.bg}}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.ic}`} style={{background:'rgba(255,255,255,0.05)'}}>
        <i className={`ti ti-${icon} text-sm`}></i>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-white leading-relaxed">{title}</div>
        <div className="text-xs mt-0.5" style={{color:'rgba(255,255,255,0.4)'}}>{meta}</div>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${cfg.badge}`}>{cfg.label}</span>
    </div>
  );
}

function Bar({label,pct,color,val}:{label:string,pct:number,color:string,val:string}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-xs w-36 flex-shrink-0 truncate" style={{color:'rgba(255,255,255,0.6)'}}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{background:'rgba(255,255,255,0.1)'}}>
        <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct}%`,background:color}}></div>
      </div>
      <span className="text-xs w-16 text-right flex-shrink-0 font-medium text-white">{val}</span>
    </div>
  );
}

function SDot({s}:{s:'ok'|'warn'|'crit'|'off'}) {
  const c={ok:'bg-teal-400',warn:'bg-orange-400',crit:'bg-red-400',off:'bg-gray-600'};
  return <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${c[s]}`}></span>;
}

// ─── МОЗГ Right Panel ──────────────────────────────────────
function MozgPanel({pageId}:{pageId:string}) {
  const hints = MOZG[pageId] || MOZG[pageId.split('/')[0]] || [];
  const hasCrit = hints.some(h=>h.level==='crit');
  if(hints.length===0) return (
    <div className="w-64 flex-shrink-0 rounded-2xl p-4 border border-white/10" style={{background:'rgba(29,158,117,0.08)'}}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(29,158,117,0.2)'}}>
          <i className="ti ti-brain text-teal-400 text-sm"></i>
        </div>
        <span className="text-xs font-bold text-teal-400">МОЗГ — Садыхан</span>
      </div>
      <div className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>Замечаний нет. Всё в норме.</div>
    </div>
  );
  return (
    <div className={`w-64 flex-shrink-0 rounded-2xl p-4 border ${hasCrit?'border-red-500/30':'border-orange-500/30'}`}
      style={{background:hasCrit?'rgba(239,68,68,0.08)':'rgba(249,115,22,0.08)'}}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${hasCrit?'text-red-400':'text-orange-400'}`}
          style={{background:'rgba(255,255,255,0.05)'}}>
          <i className="ti ti-brain text-sm"></i>
        </div>
        <div>
          <div className="text-xs font-bold text-white">МОЗГ — Садыхан</div>
          <div className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>{hints.length} замечания</div>
        </div>
      </div>
      <div className="space-y-2">
        {hints.map((h,i)=>(
          <div key={i} className={`p-2.5 rounded-xl text-xs leading-relaxed border ${h.level==='crit'?'border-red-500/20 text-red-200':'border-orange-500/20 text-orange-200'}`}
            style={{background:h.level==='crit'?'rgba(239,68,68,0.1)':'rgba(249,115,22,0.1)'}}>
            <div className="flex items-start gap-1.5">
              <i className={`ti ti-${h.level==='crit'?'alert-circle':'info-circle'} text-xs mt-0.5 flex-shrink-0`}></i>
              {h.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="text-xs" style={{color:'rgba(255,255,255,0.3)'}}>Только для АД и CEO</div>
      </div>
    </div>
  );
}

// ─── Finance Agent Embed ────────────────────────────────────
function FinanceAgentEmbed() {
  return (
    <div style={{ margin: '-20px', height: 'calc(100vh - 88px)' }}>
      <Suspense fallback={<div className="text-white/40 p-8 text-sm">Загрузка агента...</div>}>
        <FinanceAgentPage />
      </Suspense>
    </div>
  );
}

// ─── Page content ──────────────────────────────────────────
function PageOverview({setPage}:{setPage:(p:string)=>void}) {
  return (
    <div>
      <KPIGrid items={[
        {label:'Рейтинг сети',value:'3.48',delta:'↓ −0.14 vs пр. мес.',color:'amber'},
        {label:'NPS',value:'44',delta:'↓ −6 за неделю',color:'amber'},
        {label:'Выручка май',value:'₸48.2М',delta:'↑ план 96%',color:'green'},
        {label:'Алертов',value:'4',delta:'3 критических',color:'red'},
      ]}/>
      <div className="grid grid-cols-2 gap-3">
        <Card title="Отделы — статус">
          {[
            {id:'control/antifraud',icon:'shield-check',name:'Контроль и аудит',kpi:'3 тикета · Рейтинг 3.48',s:'crit'},
            {id:'retail/network',icon:'building-store',name:'Розница',kpi:'24 аптеки · Выручка ₸48.2М',s:'ok'},
            {id:'wholesale/orders',icon:'truck',name:'Опт',kpi:'3 клиента неактивны',s:'warn'},
            {id:'develop/procurement',icon:'trending-up',name:'Развитие',kpi:'Дефицит 34 SKU',s:'warn'},
            {id:'finance/reports',icon:'cash',name:'Финансы',kpi:'₸48.2М · план 96%',s:'ok'},
            {id:'it/servicedesk',icon:'device-desktop',name:'IT',kpi:'3 открытых заявки',s:'warn'},
          ].map(d=>(
            <div key={d.id} onClick={()=>setPage(d.id)}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-white/5 cursor-pointer mb-2 transition-all hover:border-teal-500/40"
              style={{background:'rgba(255,255,255,0.03)'}}>
              <i className={`ti ti-${d.icon} text-sm text-teal-400`}></i>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white">{d.name}</div>
                <div className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>{d.kpi}</div>
              </div>
              <SDot s={d.s as any}/>
            </div>
          ))}
        </Card>
        <Card title="Последние алерты">
          <AlertRow icon="alert-circle" title="Алматы-3 — аномалия лояльности, ущерб ~₸45 000" meta="2 ч · Антифрод" level="crit"/>
          <AlertRow icon="message-x" title="567 отзывов без ответа — норматив превышен" meta="5 ч · Репутация" level="crit"/>
          <AlertRow icon="package" title="Дефицит 34 SKU — угроза продажам" meta="1 д · Закуп" level="warn"/>
          <AlertRow icon="device-desktop" title="1С ошибка синхронизации Астана-2" meta="3 ч · IT" level="warn"/>
        </Card>
      </div>
    </div>
  );
}

function PageBoard() {
  return (
    <div>
      <div className="rounded-2xl p-5 mb-4 border border-teal-500/30" style={{background:'rgba(29,158,117,0.1)'}}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{background:'rgba(29,158,117,0.2)'}}>
            <i className="ti ti-crown text-teal-400 text-2xl"></i>
          </div>
          <div>
            <div className="text-base font-bold text-white">Совет директоров Садыхан</div>
            <div className="text-xs" style={{color:'rgba(255,255,255,0.5)'}}>5 AI-агентов · Доступ: АД, CEO, руководители департаментов</div>
          </div>
          <span className="ml-auto text-xs bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full font-medium">Активен</span>
        </div>
        <KPIGrid items={[
          {label:'Агентов',value:'5',color:'green'},
          {label:'Решений за месяц',value:'12',color:'green'},
          {label:'Открытых вопросов',value:'2',color:'amber'},
          {label:'Последнее заседание',value:'Вчера',color:'gray'},
        ]}/>
        <div className="text-xs font-medium text-white mb-2">Как работает Совет:</div>
        <div className="flex items-center gap-2 flex-wrap">
          {['МОЗГ выявил проблему','→','Совет получает доклад','→','5 агентов голосуют','→','Решение → АД и CEO'].map((s,i)=>(
            s==='→'
              ?<span key={i} style={{color:'rgba(255,255,255,0.3)'}}>→</span>
              :<div key={i} className="text-xs px-3 py-1.5 rounded-lg text-white border border-white/10" style={{background:'rgba(255,255,255,0.05)'}}>{s}</div>
          ))}
        </div>
      </div>
      <Card title="Состав Совета директоров">
        {[
          {avatar:'🚀',name:'Илон Маск',role:'Автоматизация и AI',focus:'Зачем здесь человек? Автоматизировать немедленно.'},
          {avatar:'🍎',name:'Стив Джобс',role:'Бренд и клиентский опыт',focus:'Клиент должен влюбиться в Садыхан с первого визита.'},
          {avatar:'🦅',name:'Маргулан Сейсембаев',role:'Стратегия КЗ и Кайдзен',focus:'Маленькое улучшение каждый день — через год революция.'},
          {avatar:'⚙️',name:'Масааки Имаи',role:'Процессы и улучшения',focus:'Найти потери. Устранить. Измерить. Повторить.'},
          {avatar:'📈',name:'Тимур Турлов',role:'Финансы и масштабирование',focus:'Нельзя защищаться — нужно атаковать новые рынки.'},
        ].map(a=>(
          <div key={a.name} className="flex items-center gap-3 p-3 rounded-xl mb-2 border border-white/5" style={{background:'rgba(255,255,255,0.03)'}}>
            <span className="text-2xl flex-shrink-0">{a.avatar}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white">{a.name}</div>
              <div className="text-xs text-teal-400">{a.role}</div>
              <div className="text-xs mt-0.5 italic" style={{color:'rgba(255,255,255,0.4)'}}>"{a.focus}"</div>
            </div>
            <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full flex-shrink-0">Активен</span>
          </div>
        ))}
      </Card>
      <Card title="Последнее решение Совета" subtitle="4 июня 2026">
        <AlertRow icon="gavel" title="Голосование 5:0 — приоритет №1: внутренняя проверка Алматы-3 (антифрод + HR). Срок: 7 дней." meta="МОЗГ передал · Все 5 агентов согласны" level="crit"/>
        <AlertRow icon="gavel" title="Голосование 4:1 — запустить агента авто-ответов на отзывы. Маск против — хочет полную автоматизацию." meta="Решение принято большинством" level="warn"/>
      </Card>
    </div>
  );
}

function SimpleKPI(items:{label:string,value:string,delta?:string,color?:string}[]) {
  return <KPIGrid items={items}/>;
}

function renderContent(page:string, setPage:(p:string)=>void) {
  switch(page) {
    case 'overview': return <PageOverview setPage={setPage}/>;
    case 'board': return <PageBoard/>;
    case 'alerts': return (
      <div>
        <div className="text-xs uppercase tracking-wider mb-2" style={{color:'rgba(255,255,255,0.4)'}}>Критические</div>
        <AlertRow icon="alert-circle" title="Алматы-3 — аномалия лояльности каждую пятницу 18–20:00, ущерб ~₸45 000" meta="2 ч · Антифрод · Открыт" level="crit"/>
        <AlertRow icon="receipt-2" title="Кассир Астана-7 — 34 чека одновременно в 20:00, налоговый риск" meta="4 ч · Антифрод · Открыт" level="crit"/>
        <AlertRow icon="message-x" title="567 отзывов без ответа — норматив 18% превышен" meta="5 ч · Репутация · Открыт" level="crit"/>
        <div className="text-xs uppercase tracking-wider mb-2 mt-4" style={{color:'rgba(255,255,255,0.4)'}}>Предупреждения</div>
        <AlertRow icon="chart-line-down" title="NPS снизился на 6 пунктов за неделю" meta="2 д · NPS" level="warn"/>
        <AlertRow icon="device-desktop" title="1С ошибка синхронизации Астана-2" meta="3 ч · IT" level="warn"/>
      </div>
    );
    case 'control/reputation': return <KPIGrid items={[{label:'Рейтинг сети',value:'3.48',delta:'↓ −0.14',color:'amber'},{label:'Всего отзывов',value:'4 182',delta:'↑ +312'},{label:'Негативных',value:'1 063',color:'red'},{label:'Без ответа',value:'567',color:'amber'}]}/>;
    case 'control/nps': return <KPIGrid items={[{label:'NPS',value:'44',delta:'↓ −6 нед.',color:'amber'},{label:'Промоутеры',value:'58%',color:'green'},{label:'Пассивные',value:'28%'},{label:'Детракторы',value:'14%',color:'red'}]}/>;
    case 'control/antifraud': return (
      <div>
        <KPIGrid items={[{label:'Открытых тикетов',value:'3',color:'red'},{label:'Решено за месяц',value:'41',color:'green'},{label:'Предотвращён ущерб',value:'₸1.2М',color:'green'},{label:'Время реакции',value:'18 ч',color:'amber'}]}/>
        <Card title="Активные тикеты">
          <AlertRow icon="alert-circle" title="Алматы-3 — систематическая аномалия лояльности, 6 недель подряд по пятницам" meta="Открыт 2 ч · Назначен: СБ" level="crit"/>
          <AlertRow icon="receipt-2" title="Астана-7 — кассир Мухамедова: 34 чека в 20:00 одновременно" meta="Открыт 4 ч · Назначен: Гл. бухгалтер" level="crit"/>
          <AlertRow icon="package" title="Алматы-5 — недостача ВТД: 50 единиц не оприходованы" meta="Открыт 1 д · Назначен: Склад" level="warn"/>
        </Card>
        <Card title="Топ нарушений по филиалам">
          <Bar label="Алматы-3" pct={88} color="#EF4444" val="12 случаев"/>
          <Bar label="Астана-7" pct={65} color="#F97316" val="8 случаев"/>
          <Bar label="Алматы-5" pct={40} color="#F59E0B" val="5 случаев"/>
        </Card>
      </div>
    );
    case 'control/aggregators': return (
      <div>
        <KPIGrid items={[{label:'Аптек в агрегаторах',value:'22/24',color:'green'},{label:'Расхождений',value:'47',color:'red'},{label:'Сумма',value:'₸184К',color:'red'},{label:'Последняя сверка',value:'Сегодня 9:00',color:'green'}]}/>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[{name:'Glovo',orders:1240,diff:18,sum:'₸72К'},{name:'Яндекс Еда',orders:890,diff:22,sum:'₸88К'},{name:'Wolt',orders:310,diff:7,sum:'₸24К'}].map(ag=>(
            <div key={ag.name} className="p-3 rounded-xl border border-white/10" style={{background:'rgba(255,255,255,0.05)'}}>
              <div className="text-sm font-bold text-white mb-2">{ag.name}</div>
              <div className="text-xs mb-1" style={{color:'rgba(255,255,255,0.5)'}}>Заказов: <span className="text-white font-medium">{ag.orders}</span></div>
              <div className="text-xs mb-1" style={{color:'rgba(255,255,255,0.5)'}}>Расхождений: <span className="text-red-400 font-medium">{ag.diff}</span></div>
              <div className="text-xs" style={{color:'rgba(255,255,255,0.5)'}}>Сумма: <span className="text-red-400 font-medium">{ag.sum}</span></div>
            </div>
          ))}
        </div>
      </div>
    );
    case 'control/cash': return (
      <div>
        <KPIGrid items={[{label:'Чеков за сегодня',value:'4 218',color:'green'},{label:'Отложенных',value:'34',color:'red'},{label:'Аннулированных',value:'12',color:'amber'},{label:'Средний чек',value:'₸3 420'}]}/>
        <Card title="Отложенные чеки по аптекам">
          {[{name:'Астана-7',count:14,sum:'₸48 200',s:'crit'},{name:'Алматы-3',count:9,sum:'₸31 400',s:'crit'},{name:'Алматы-5',count:7,sum:'₸24 100',s:'warn'},{name:'Шымкент-2',count:4,sum:'₸13 800',s:'warn'}].map(r=>(
            <div key={r.name} className="flex items-center gap-3 p-2.5 rounded-xl mb-2 border border-white/5" style={{background:'rgba(255,255,255,0.03)'}}>
              <SDot s={r.s as any}/><span className="text-xs text-white flex-1">{r.name}</span>
              <span className="text-xs text-red-400 font-medium">{r.count} чеков</span>
              <span className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>{r.sum}</span>
            </div>
          ))}
        </Card>
      </div>
    );
    case 'control/revision': return (
      <div>
        <KPIGrid items={[{label:'Аптек всего',value:'24'},{label:'Ревизий в месяце',value:'18',color:'green'},{label:'Просрочено',value:'2',color:'red'},{label:'Ср. недостача',value:'₸12К',color:'amber'}]}/>
        <Card title="График ревизий">
          {[{name:'Алматы-1',date:'02.06',s:'ok',result:'Норма',diff:'₸0'},{name:'Алматы-3',date:'—',s:'crit',result:'Просрочена',diff:'−'},{name:'Астана-7',date:'03.06',s:'warn',result:'Недостача',diff:'−₸48 200'},{name:'Шымкент-1',date:'05.06',s:'ok',result:'Норма',diff:'₸0'}].map(r=>(
            <div key={r.name} className="flex items-center gap-3 p-2.5 rounded-xl mb-2 border border-white/5" style={{background:'rgba(255,255,255,0.03)'}}>
              <SDot s={r.s as any}/><span className="text-xs text-white w-24">{r.name}</span>
              <span className="text-xs w-16" style={{color:'rgba(255,255,255,0.4)'}}>{r.date}</span>
              <span className={`text-xs flex-1 ${r.s==='crit'?'text-red-400':r.s==='warn'?'text-orange-400':'text-teal-400'}`}>{r.result}</span>
              <span className={`text-xs font-medium ${r.diff.startsWith('-')?'text-red-400':r.diff==='₸0'?'text-teal-400':'text-white'}`}>{r.diff}</span>
            </div>
          ))}
        </Card>
      </div>
    );
    case 'retail/network': return (
      <div>
        <KPIGrid items={[{label:'Аптек всего',value:'24',color:'green'},{label:'Активных',value:'24',color:'green'},{label:'Выручка май',value:'₸48.2М',color:'green'},{label:'Ср. выручка/аптека',value:'₸2.0М'}]}/>
        <Card title="Рейтинг аптек по выручке">
          <Bar label="Алматы-1" pct={95} color="#1D9E75" val="₸9.1М"/>
          <Bar label="Алматы-2" pct={82} color="#1D9E75" val="₸7.8М"/>
          <Bar label="Астана-1" pct={71} color="#F97316" val="₸6.8М"/>
          <Bar label="Астана-2" pct={60} color="#F97316" val="₸5.7М"/>
          <Bar label="Алматы-3" pct={45} color="#EF4444" val="₸4.3М"/>
        </Card>
      </div>
    );
    case 'retail/managers': return <KPIGrid items={[{label:'Менеджеров',value:'4'},{label:'Аптек на 1 менеджера',value:'6',color:'amber'},{label:'Выполнение KPI',value:'78%',color:'amber'},{label:'Посещений в месяц',value:'96'}]}/>;
    case 'retail/kpi': return <KPIGrid items={[{label:'Выполнение плана',value:'96%',color:'green'},{label:'Рост vs прошлый год',value:'+12%',color:'green'},{label:'Средний чек',value:'₸3 420',color:'green'},{label:'Конверсия',value:'68%',color:'amber'}]}/>;
    case 'wholesale/clients': return <KPIGrid items={[{label:'Активных клиентов',value:'47',color:'green'},{label:'Новых за месяц',value:'3',color:'green'},{label:'Неактивных',value:'3',color:'red'},{label:'Ср. заказ',value:'₸840К'}]}/>;
    case 'wholesale/orders': return (
      <div>
        <KPIGrid items={[{label:'Заказов за май',value:'184'},{label:'Выручка опт',value:'₸38.9М',color:'green'},{label:'Просроченных',value:'2',color:'red'},{label:'Ср. время доставки',value:'2.1 дн.',color:'green'}]}/>
        <Card title="Активные заказы">
          <AlertRow icon="alert-circle" title="Клиент АО МедПлюс — заказ просрочен на 3 дня, сумма ₸2.4М" meta="Менеджер Коротков · Требует звонка" level="crit"/>
          <AlertRow icon="package" title="Клиент ТОО ФармСервис — не сделали заказ 2 недели подряд" meta="Риск потери клиента" level="warn"/>
        </Card>
      </div>
    );
    case 'wholesale/buyers': return <KPIGrid items={[{label:'Закупщиков',value:'2'},{label:'Поставщиков',value:'18',color:'green'},{label:'Активных контрактов',value:'24',color:'green'},{label:'Истекают в 30 дн.',value:'3',color:'amber'}]}/>;
    case 'develop/procurement': return (
      <div>
        <KPIGrid items={[{label:'SKU всего',value:'2 840'},{label:'Дефицит',value:'34',color:'red'},{label:'Активных заказов',value:'12',color:'amber'},{label:'Оборачиваемость',value:'18 дн.',color:'green'}]}/>
        <Card title="Товары в дефиците" subtitle="срочно заказать">
          {[{name:'Нурофен 400мг №10',stock:0,reorder:200},{name:'Амоксициллин 500мг №20',stock:3,reorder:150},{name:'Лоратадин 10мг №30',stock:5,reorder:300}].map(r=>(
            <div key={r.name} className="flex items-center gap-3 p-2.5 rounded-xl mb-2" style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)'}}>
              <SDot s="crit"/><span className="text-xs text-white flex-1">{r.name}</span>
              <span className="text-xs text-red-400">Остаток: {r.stock}</span>
              <span className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>Заказ: {r.reorder} шт</span>
            </div>
          ))}
        </Card>
      </div>
    );
    case 'develop/categories': return <KPIGrid items={[{label:'Категорий A',value:'284',color:'green'},{label:'Категорий B',value:'710',color:'amber'},{label:'Категорий C',value:'1 846',color:'red'},{label:'На вывод',value:'43',color:'amber'}]}/>;
    case 'develop/pricing': return <KPIGrid items={[{label:'Ср. маржа',value:'28%',color:'green'},{label:'Ниже рынка',value:'127',color:'red'},{label:'Выше рынка',value:'84',color:'amber'},{label:'Конкурентов',value:'6'}]}/>;
    case 'finance/reports': return (
      <div>
        <KPIGrid items={[{label:'Выручка май',value:'₸48.2М',delta:'↑ +4.1%',color:'green'},{label:'Расходы',value:'₸31.1М'},{label:'Прибыль',value:'₸17.1М',color:'green'},{label:'План',value:'96%',color:'green'}]}/>
        <Card title="По филиалам">
          <Bar label="Алматы-1" pct={95} color="#1D9E75" val="₸9.1М"/>
          <Bar label="Алматы-2" pct={82} color="#1D9E75" val="₸7.8М"/>
          <Bar label="Астана-1" pct={71} color="#F97316" val="₸6.8М"/>
          <Bar label="Астана-2" pct={60} color="#F97316" val="₸5.7М"/>
          <Bar label="Шымкент" pct={48} color="#EF4444" val="₸4.6М"/>
        </Card>
      </div>
    );
    case 'finance/analytics': return <KPIGrid items={[{label:'Выручка vs план',value:'96%',color:'green'},{label:'Прогноз июнь',value:'₸51М',color:'green'},{label:'Расходы vs план',value:'102%',color:'amber'},{label:'EBITDA',value:'35.5%',color:'green'}]}/>;
    case 'finance/accounting': return <KPIGrid items={[{label:'Документов',value:'1 248',color:'green'},{label:'Ошибок',value:'2',color:'red'},{label:'Точность',value:'99.1%',color:'green'},{label:'Сверок',value:'48/50',color:'green'}]}/>;
    case 'finance/agent': return <FinanceAgentEmbed />;
    case 'hr/staff': return (
      <div>
        <KPIGrid items={[{label:'Сотрудников',value:'214'},{label:'Вакансий',value:'8',color:'amber'},{label:'Текучесть',value:'6.2%',delta:'Цель: <5%',color:'amber'},{label:'На обучении',value:'31',color:'green'}]}/>
        <Card title="Текучесть по филиалам">
          <Bar label="Алматы-3" pct={88} color="#EF4444" val="14%"/>
          <Bar label="Астана-7" pct={60} color="#F97316" val="9.6%"/>
          <Bar label="Шымкент-2" pct={40} color="#F59E0B" val="6.4%"/>
          <Bar label="Алматы-1" pct={20} color="#1D9E75" val="3.2%"/>
        </Card>
      </div>
    );
    case 'hr/rating': return <KPIGrid items={[{label:'Лучший',value:'Нурланова А.',color:'green'},{label:'Ср. рейтинг',value:'3.8 ★',color:'green'},{label:'Ниже нормы',value:'4 чел.',color:'red'},{label:'Жалоб всего',value:'1 063',color:'amber'}]}/>;
    case 'hr/training': return <KPIGrid items={[{label:'На обучении',value:'31',color:'green'},{label:'Завершили',value:'18',color:'green'},{label:'Новых сотрудников',value:'5',color:'amber'},{label:'Ср. балл теста',value:'87%',color:'green'}]}/>;
    case 'marketing/promo': return <KPIGrid items={[{label:'Активных акций',value:'7',color:'green'},{label:'Конверсия',value:'12.4%',color:'amber'},{label:'Доп. выручка',value:'₸4.2М',color:'green'},{label:'ROI акций',value:'340%',color:'green'}]}/>;
    case 'marketing/loyalty': return <KPIGrid items={[{label:'Участников',value:'48 200',color:'green'},{label:'Активных',value:'31 400',color:'green'},{label:'Повторные покупки',value:'64%',color:'green'},{label:'Ср. чек с картой',value:'₸4 800',color:'green'}]}/>;
    case 'operations/licenses': return <KPIGrid items={[{label:'Лицензий',value:'24/24',color:'green'},{label:'Истекают в 30 дн.',value:'2',color:'amber'},{label:'Продлено в году',value:'5',color:'green'},{label:'Проверок Минздрава',value:'0',color:'green'}]}/>;
    case 'operations/standards': return <KPIGrid items={[{label:'Аптек проверено',value:'21/24',color:'green'},{label:'Нарушений',value:'1',color:'red'},{label:'Предписаний',value:'2',color:'amber'},{label:'Устранено',value:'1/2',color:'amber'}]}/>;
    case 'it/servicedesk': return (
      <div>
        <KPIGrid items={[{label:'Открытых заявок',value:'3',color:'amber'},{label:'Выполнено за месяц',value:'47',color:'green'},{label:'Среднее время',value:'4.2 ч',color:'amber'}]}/>
        <Card title="Заявки в работе">
          {[{p:'high',t:'1С — ошибка синхронизации Астана-2',f:'Финансы · 3 ч',s:'В работе'},{p:'med',t:'Кассовый терминал Алматы-5',f:'Операции · 6 ч',s:'Назначено'},{p:'low',t:'Доступ для нового сотрудника',f:'HR · 1 д',s:'Очередь'}].map((r,i)=>{
            const pc:Record<string,string>={high:'bg-red-500/20 text-red-400',med:'bg-orange-500/20 text-orange-400',low:'bg-teal-500/20 text-teal-400'};
            const pl:Record<string,string>={high:'Высокий',med:'Средний',low:'Низкий'};
            return (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl mb-2 border border-white/5" style={{background:'rgba(255,255,255,0.03)'}}>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${pc[r.p]}`}>{pl[r.p]}</span>
                <div className="flex-1"><div className="text-xs text-white">{r.t}</div><div className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>{r.f}</div></div>
                <span className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>{r.s}</span>
              </div>
            );
          })}
        </Card>
      </div>
    );
    case 'it/1c': return <KPIGrid items={[{label:'Задач в спринте',value:'8'},{label:'Выполнено',value:'5',color:'green'},{label:'Критических багов',value:'1',color:'red'},{label:'Синхронизаций/день',value:'24',color:'green'}]}/>;
    case 'it/infra': return <KPIGrid items={[{label:'Серверов',value:'6'},{label:'Uptime',value:'99.8%',color:'green'},{label:'Инцидентов',value:'0',color:'green'},{label:'Бэкапов',value:'7/7',color:'green'}]}/>;
    case 'it/security': return <KPIGrid items={[{label:'Активных доступов',value:'214'},{label:'Подозрительных входов',value:'2',color:'red'},{label:'Заблокировано',value:'1',color:'amber'},{label:'Последний аудит',value:'01.06',color:'green'}]}/>;
    case 'legal/contracts': return <KPIGrid items={[{label:'Активных договоров',value:'84'},{label:'Истекают в 30 дн.',value:'6',color:'amber'},{label:'На подписании',value:'3',color:'amber'},{label:'Просроченных',value:'0',color:'green'}]}/>;
    case 'legal/licenses': return <KPIGrid items={[{label:'Лицензий аптек',value:'24/24',color:'green'},{label:'Истекают скоро',value:'2',color:'amber'},{label:'Стоимость продления',value:'₸480К'},{label:'Следующая проверка',value:'15.07'}]}/>;
    case 'agents': return (
      <div>
        <div className="rounded-2xl p-4 mb-4 border border-teal-500/30" style={{background:'rgba(29,158,117,0.1)'}}>
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(29,158,117,0.2)'}}><i className="ti ti-brain text-teal-400 text-xl"></i></div><div><div className="text-sm font-bold text-white">МОЗГ — Садыхан</div><div className="text-xs" style={{color:'rgba(255,255,255,0.5)'}}>Перекрёстная проверка · советуется с Советом директоров · доклад АД и CEO</div></div><span className="ml-auto text-xs bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full">Активен</span></div>
        </div>
        <div className="text-xs uppercase tracking-wider mb-2" style={{color:'rgba(255,255,255,0.4)'}}>Активные агенты</div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{name:'NPS-агент',desc:'Анализирует отзывы, задачи фармацевтам',s:'active'},{name:'Агент репутации',desc:'Мониторит 2ГИС/Google/Яндекс каждый час',s:'active'},{name:'IT Service агент',desc:'Принимает и распределяет заявки',s:'dev'}].map(a=>(
            <div key={a.name} className="p-3 rounded-xl border border-white/10" style={{background:'rgba(255,255,255,0.05)'}}>
              <div className="flex justify-between gap-2 mb-2"><span className="text-xs font-bold text-white">{a.name}</span><span className={`text-xs px-2 py-0.5 rounded-full ${a.s==='active'?'bg-teal-500/20 text-teal-400':'bg-orange-500/20 text-orange-400'}`}>{a.s==='active'?'Активен':'Разработка'}</span></div>
              <div className="text-xs leading-relaxed" style={{color:'rgba(255,255,255,0.5)'}}>{a.desc}</div>
            </div>
          ))}
        </div>
        <div className="text-xs uppercase tracking-wider mb-2" style={{color:'rgba(255,255,255,0.4)'}}>Запланированные</div>
        <div className="grid grid-cols-3 gap-3">
          {[{name:'Антифрод-агент',desc:'Аномалии → тикет СБ'},{name:'Агент агрегаторов',desc:'Сверка Glovo/Яндекс/Wolt'},{name:'Reorder-агент',desc:'Авто-заявки при дефиците'},{name:'Финансовый агент',desc:'P&L, план-факт, Cash flow'},{name:'Агент ревизий',desc:'Планирует и фиксирует ревизии'},{name:'1С-агент',desc:'Мониторинг ошибок синхронизации'}].map(a=>(
            <div key={a.name} className="p-3 rounded-xl border border-white/10" style={{background:'rgba(255,255,255,0.03)'}}>
              <div className="flex justify-between gap-2 mb-2"><span className="text-xs font-bold text-white">{a.name}</span><span className="text-xs bg-white/5 text-white/40 px-2 py-0.5 rounded-full">Запланирован</span></div>
              <div className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
    default: return <div className="text-sm p-4" style={{color:'rgba(255,255,255,0.4)'}}>Раздел в разработке</div>;
  }
}

// ─── Main ──────────────────────────────────────────────────
export default function PortalPage() {
  const [page, setPage] = useState('overview');
  const [openDepts, setOpenDepts] = useState<Record<string,boolean>>({control:true});
  const [mounted, setMounted] = useState(false);
  useEffect(()=>{setMounted(true);},[]);
  if(!mounted) return null;

  const toggle = (id:string) => setOpenDepts(p=>({...p,[id]:!p[id]}));

  return (
    <div className="flex h-screen" style={{background:'#0A2218',fontFamily:'Inter,sans-serif'}}>
      {/* Sidebar */}
      <div className="w-56 flex flex-col flex-shrink-0 border-r" style={{background:'#0D2B1F',borderColor:'rgba(255,255,255,0.08)'}}>
        {/* Logo */}
        <div className="p-4 border-b" style={{borderColor:'rgba(255,255,255,0.08)'}}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'linear-gradient(135deg,#1D9E75,#0D6B50)'}}>
              <i className="ti ti-building-store text-white text-base"></i>
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide">САДЫХАН</div>
              <div className="text-xs" style={{color:'rgba(255,255,255,0.4)'}}>Корп. платформа</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {NAV.map(sec=>(
            <div key={sec.section}>
              <div className="text-xs uppercase tracking-widest px-4 pt-4 pb-1.5 font-semibold" style={{color:'rgba(255,255,255,0.25)',letterSpacing:'0.1em'}}>{sec.section}</div>
              {sec.items.map((it:any)=>(
                <div key={it.id}>
                  <button onClick={()=>it.subs?toggle(it.id):setPage(it.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-all duration-150 text-left border-l-2"
                    style={{
                      borderLeftColor: page===it.id||page.startsWith(it.id+'/')?'#1D9E75':'transparent',
                      background: page===it.id||page.startsWith(it.id+'/')?'rgba(29,158,117,0.15)':'transparent',
                      color: page===it.id||page.startsWith(it.id+'/')?'#1D9E75':'rgba(255,255,255,0.6)',
                    }}>
                    <i className={`ti ti-${it.icon} text-sm flex-shrink-0`}></i>
                    <span className="flex-1 truncate font-medium">{it.label}</span>
                    {it.badge&&<span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{background:'rgba(249,115,22,0.2)',color:'#F97316'}}>{it.badge}</span>}
                    {it.subs&&<i className={`ti ti-chevron-${openDepts[it.id]?'up':'down'} text-xs transition-transform duration-200`} style={{color:'rgba(255,255,255,0.3)'}}></i>}
                  </button>
                  {it.subs&&openDepts[it.id]&&(
                    <div className="ml-4 border-l" style={{borderColor:'rgba(255,255,255,0.08)'}}>
                      {it.subs.map((sub:any)=>(
                        <button key={sub.id} onClick={()=>setPage(sub.id)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-all duration-150 text-left my-0.5 rounded-lg mx-1"
                          style={{
                            background: page===sub.id?'rgba(29,158,117,0.2)':'transparent',
                            color: page===sub.id?'#1D9E75':'rgba(255,255,255,0.45)',
                            width:'calc(100% - 8px)',
                          }}>
                          <i className={`ti ti-${sub.icon} text-xs flex-shrink-0`}></i>
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

        {/* User */}
        <div className="p-3 border-t flex items-center gap-2" style={{borderColor:'rgba(255,255,255,0.08)'}}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background:'linear-gradient(135deg,#1D9E75,#0D6B50)'}}>АД</div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white">Владелец</div>
            <div className="text-xs truncate" style={{color:'rgba(255,255,255,0.35)'}}>Полный доступ</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <div className="h-12 flex items-center gap-3 px-5 border-b flex-shrink-0" style={{background:'#0D2B1F',borderColor:'rgba(255,255,255,0.08)'}}>
          <div className="text-sm font-bold text-white">{TITLES[page]||page}</div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={()=>setPage('alerts')} className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium transition-all" style={{background:'rgba(239,68,68,0.15)',color:'#F87171'}}>
              <i className="ti ti-alert-triangle text-xs"></i> 4 алерта
            </button>
            <button onClick={()=>setPage('board')} className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium transition-all" style={{background:'rgba(249,115,22,0.15)',color:'#FB923C'}}>
              <i className="ti ti-crown text-xs"></i> Совет
            </button>
            <i className="ti ti-bell text-sm cursor-pointer" style={{color:'rgba(255,255,255,0.4)'}}></i>
          </div>
        </div>

        {/* Content + МОЗГ panel */}
        <div className="flex-1 overflow-hidden flex gap-0">
          {/* Page content */}
          <div className="flex-1 overflow-y-auto p-5">
            {renderContent(page, setPage)}
          </div>

          {/* МОЗГ right panel */}
          <div className="w-72 flex-shrink-0 overflow-y-auto p-4 border-l" style={{borderColor:'rgba(255,255,255,0.06)',background:'rgba(0,0,0,0.15)'}}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:'rgba(29,158,117,0.2)'}}>
                <i className="ti ti-brain text-teal-400 text-xs"></i>
              </div>
              <span className="text-xs font-bold text-teal-400">МОЗГ — Садыхан</span>
            </div>
            <MozgPanel pageId={page}/>

            {/* Совет директоров в панели */}
            <div className="mt-4 pt-4 border-t" style={{borderColor:'rgba(255,255,255,0.08)'}}>
              <div className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                <i className="ti ti-crown text-orange-400 text-xs"></i>
                Совет директоров
              </div>
              <div className="text-xs mb-3" style={{color:'rgba(255,255,255,0.4)'}}>Последнее решение:</div>
              <div className="p-2.5 rounded-xl text-xs border" style={{background:'rgba(249,115,22,0.08)',borderColor:'rgba(249,115,22,0.2)',color:'rgba(255,255,255,0.7)'}}>
                <div className="font-medium text-orange-400 mb-1">Голосование 5:0</div>
                Внутренняя проверка Алматы-3. Срок: 7 дней.
              </div>
              <button onClick={()=>setPage('board')} className="w-full mt-2 text-xs py-2 rounded-xl font-medium transition-all" style={{background:'rgba(249,115,22,0.15)',color:'#FB923C'}}>
                Открыть Совет →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
