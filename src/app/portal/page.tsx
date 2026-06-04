'use client';
import { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────
type PageId = 'overview'|'alerts'|'mozg'|'control'|'develop'|'finance'|'hr'|'marketing'|'operations'|'it'|'legal'|'board'|'agents';
type TabColor = 'green'|'red'|'amber'|'blue'|'purple'|'gray';

// ─── Data ────────────────────────────────────────────────
const NAV = [
  { section:'Главная', items:[
    {id:'overview',icon:'layout-dashboard',label:'Обзор'},
    {id:'alerts',icon:'bell',label:'Алерты',badge:'4',bc:'red'},
    {id:'mozg',icon:'brain',label:'МОЗГ — Садыхан',badge:'AI',bc:'green'},
  ]},
  { section:'Отделы', items:[
    {id:'control',icon:'shield-check',label:'Контроль и аудит'},
    {id:'develop',icon:'trending-up',label:'Развитие'},
    {id:'finance',icon:'cash',label:'Финансы'},
    {id:'hr',icon:'users',label:'HR'},
    {id:'marketing',icon:'speakerphone',label:'Маркетинг'},
    {id:'operations',icon:'clipboard-check',label:'Операции'},
    {id:'it',icon:'device-desktop',label:'IT',badge:'3',bc:'amber'},
    {id:'legal',icon:'scale',label:'Юридический'},
  ]},
  { section:'Топ-уровень', items:[
    {id:'board',icon:'crown',label:'Совет директоров'},
    {id:'agents',icon:'robot',label:'AI-агенты'},
  ]},
];

const TITLES: Record<string,string> = {
  overview:'Обзор компании',alerts:'Алерты',mozg:'МОЗГ — Садыхан',
  control:'Контроль и аудит',develop:'Развитие',finance:'Финансы',
  hr:'HR и сотрудники',marketing:'Маркетинг и лояльность',
  operations:'Операционный контроль',it:'IT и Service Desk',
  legal:'Юридический / Комплаенс',board:'Совет директоров',agents:'AI-агенты'
};

const MOZG_HINTS: Record<string,{text:string,level:'crit'|'warn'|'ok'}[]> = {
  overview:[
    {text:'Выручка растёт +4% но NPS падает −6 — клиенты платят но недовольны',level:'crit'},
    {text:'Алматы-3: текучесть кадров совпадает с зоной антифрод-аномалий',level:'crit'},
  ],
  control:[
    {text:'34 отложенных чека в Астана-7 за последние 3 дня — паттерн схож с мошенничеством',level:'crit'},
    {text:'Glovo: расхождение 12 заказов в Алматы-2 за неделю — требует сверки',level:'warn'},
    {text:'Рейтинг фармацевта Ахметова Д. снизился на 1.2 за месяц — 18 негативных отзывов',level:'warn'},
  ],
  develop:[
    {text:'34 SKU в дефиците но Ценообразование не скорректировало цены на замены — потеря маржи ₸800К',level:'crit'},
    {text:'Сезонный рост спроса на антигистамины ожидается через 3 недели — рекомендую увеличить заказ',level:'warn'},
  ],
  finance:[
    {text:'Расходы Астана-2 выросли на 18% при падении выручки — аномалия требует проверки',level:'crit'},
    {text:'Cash flow на следующий месяц: риск кассового разрыва ₸3.2М если дефицит не устранить',level:'warn'},
  ],
  hr:[
    {text:'Алматы-3 — текучесть 14% (норма 5%). Совпадает с антифрод-зоной. Рекомендую проверку',level:'crit'},
    {text:'8 вакансий открыты более 30 дней — риск перегрузки действующих сотрудников',level:'warn'},
  ],
  it:[
    {text:'1С Астана-2 не синхронизировалась 6 часов — финансовые данные могут быть неточными',level:'crit'},
    {text:'2 подозрительных входа с нового IP — рекомендую проверить',level:'warn'},
  ],
  board:[
    {text:'Ключевой риск: рост выручки маскирует падение качества сервиса. Рекомендация — KPI по NPS для директоров',level:'crit'},
    {text:'Алматы-3 требует внутреннего расследования: антифрод + текучесть + жалобы клиентов',level:'crit'},
  ],
};

// ─── Small Components ────────────────────────────────────
function KPI({label,value,delta,color='gray',cols=4}:{label:string,value:string,delta?:string,color?:TabColor,cols?:number}) {
  const vc: Record<TabColor,string> = {green:'text-emerald-700',red:'text-red-700',amber:'text-amber-700',blue:'text-blue-700',purple:'text-purple-700',gray:'text-gray-900'};
  return (
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
      <div className="text-xs text-gray-500 mb-1.5">{label}</div>
      <div className={`text-2xl font-semibold ${vc[color]}`}>{value}</div>
      {delta&&<div className="text-xs text-gray-400 mt-1">{delta}</div>}
    </div>
  );
}

function KPIGrid({items}:{items:{label:string,value:string,delta?:string,color?:TabColor}[]}) {
  return (
    <div className={`grid gap-3 mb-4`} style={{gridTemplateColumns:`repeat(${Math.min(items.length,4)},1fr)`}}>
      {items.map(k=><KPI key={k.label} {...k}/>)}
    </div>
  );
}

function TabBar({tabs,active,onSelect}:{tabs:string[],active:string,onSelect:(t:string)=>void}) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
      {tabs.map(t=>(
        <button key={t} onClick={()=>onSelect(t)}
          className={`flex-1 text-xs py-2 rounded-lg font-medium transition-all duration-200 ${active===t?'bg-white shadow-sm text-gray-900':'text-gray-500 hover:text-gray-700'}`}>
          {t}
        </button>
      ))}
    </div>
  );
}

function Card({title,subtitle,children}:{title?:string,subtitle?:string,children:React.ReactNode}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
      {title&&<div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-900">{title}</span>
        {subtitle&&<span className="text-xs text-gray-400">{subtitle}</span>}
      </div>}
      {children}
    </div>
  );
}

function AlertRow({icon,color,title,meta,level='warn'}:{icon:string,color:string,title:string,meta:string,level?:'crit'|'warn'|'ok'}) {
  const bg: Record<string,string> = {red:'bg-red-50',amber:'bg-amber-50',green:'bg-emerald-50',purple:'bg-purple-50',blue:'bg-blue-50'};
  const ic: Record<string,string> = {red:'text-red-600',amber:'text-amber-600',green:'text-emerald-600',purple:'text-purple-600',blue:'text-blue-600'};
  const lb = {crit:'bg-red-100 text-red-700',warn:'bg-amber-100 text-amber-700',ok:'bg-emerald-100 text-emerald-700'};
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${bg[color]}`}>
        <i className={`ti ti-${icon} text-sm ${ic[color]}`}></i>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-900 leading-relaxed">{title}</div>
        <div className="text-xs text-gray-400 mt-0.5">{meta}</div>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${lb[level]}`}>
        {level==='crit'?'Критично':level==='warn'?'Внимание':'OK'}
      </span>
    </div>
  );
}

function Bar({label,pct,color,val}:{label:string,pct:number,color:string,val:string}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-xs text-gray-500 w-28 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct}%`,background:color}}></div>
      </div>
      <span className="text-xs text-gray-600 w-16 text-right flex-shrink-0 font-medium">{val}</span>
    </div>
  );
}

function StatusDot({status}:{status:'ok'|'warn'|'crit'|'off'}) {
  const c = {ok:'bg-emerald-500',warn:'bg-amber-400',crit:'bg-red-500',off:'bg-gray-300'};
  return <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${c[status]}`}></span>;
}

function AgentBadge({status}:{status:'active'|'dev'|'planned'}) {
  const s = {active:'bg-emerald-100 text-emerald-700',dev:'bg-amber-100 text-amber-700',planned:'bg-gray-100 text-gray-500'};
  const l = {active:'Активен',dev:'Разработка',planned:'Запланирован'};
  return <span className={`text-xs px-2 py-0.5 rounded-full ${s[status]}`}>{l[status]}</span>;
}

// ─── МОЗГ Panel (показывается в каждом отделе) ───────────
function MozgPanel({pageId}:{pageId:string}) {
  const [open,setOpen] = useState(false);
  const hints = MOZG_HINTS[pageId];
  if(!hints||hints.length===0) return null;
  const hasCrit = hints.some(h=>h.level==='crit');
  return (
    <div className={`mb-4 rounded-xl border-2 transition-all duration-300 ${hasCrit?'border-red-300 bg-red-50':'border-amber-300 bg-amber-50'}`}>
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center gap-2 p-3 text-left">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${hasCrit?'bg-red-100':'bg-amber-100'}`}>
          <i className={`ti ti-brain text-sm ${hasCrit?'text-red-700':'text-amber-700'}`}></i>
        </div>
        <div className="flex-1">
          <span className="text-xs font-semibold text-gray-900">МОЗГ — Садыхан</span>
          <span className="text-xs text-gray-500 ml-2">нашёл {hints.length} {hints.length===1?'замечание':'замечания'} по этому отделу</span>
        </div>
        <i className={`ti ti-chevron-${open?'up':'down'} text-gray-400 text-sm`}></i>
      </button>
      {open&&(
        <div className="px-3 pb-3 space-y-2 border-t border-white/50 pt-2">
          {hints.map((h,i)=>(
            <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg ${h.level==='crit'?'bg-red-100':'bg-amber-100'}`}>
              <i className={`ti ti-${h.level==='crit'?'alert-circle':'info-circle'} text-sm mt-0.5 flex-shrink-0 ${h.level==='crit'?'text-red-700':'text-amber-700'}`}></i>
              <span className="text-xs text-gray-800 leading-relaxed">{h.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Pages ───────────────────────────────────────────────

function PageOverview({setPage}:{setPage:(p:PageId)=>void}) {
  return (
    <div>
      <MozgPanel pageId="overview"/>
      <KPIGrid items={[
        {label:'Рейтинг сети',value:'3.48',delta:'↓ −0.14 vs прошлый мес.',color:'amber'},
        {label:'NPS',value:'44',delta:'↓ −6 за неделю',color:'amber'},
        {label:'Выручка май',value:'₸48.2М',delta:'↑ план 96%',color:'green'},
        {label:'Алертов',value:'4',delta:'3 критических',color:'red'},
      ]}/>
      <div className="grid grid-cols-2 gap-3">
        <Card title="Отделы — статус" subtitle="сегодня">
          <div className="space-y-2">
            {[
              {id:'control',icon:'shield-check',bg:'#FEF2F2',ic:'#B91C1C',name:'Контроль и аудит',kpi:'3 тикета · Рейтинг 3.48',s:'crit'},
              {id:'develop',icon:'trending-up',bg:'#FFFBEB',ic:'#92400E',name:'Развитие',kpi:'Дефицит 34 SKU',s:'warn'},
              {id:'finance',icon:'cash',bg:'#EFF6FF',ic:'#1D4ED8',name:'Финансы',kpi:'₸48.2М · план 96%',s:'ok'},
              {id:'it',icon:'device-desktop',bg:'#F5F3FF',ic:'#6D28D9',name:'IT',kpi:'3 открытых заявки',s:'warn'},
              {id:'operations',icon:'clipboard-check',bg:'#F0FDF4',ic:'#15803D',name:'Операции',kpi:'2 лицензии истекают',s:'warn'},
              {id:'marketing',icon:'speakerphone',bg:'#FFF7ED',ic:'#C2410C',name:'Маркетинг',kpi:'7 активных акций',s:'ok'},
            ].map(d=>(
              <div key={d.id} onClick={()=>setPage(d.id as PageId)}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-150">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:d.bg}}>
                  <i className={`ti ti-${d.icon} text-sm`} style={{color:d.ic}}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-900">{d.name}</div>
                  <div className="text-xs text-gray-400">{d.kpi}</div>
                </div>
                <StatusDot status={d.s as any}/>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-3">
          <Card title="Последние алерты">
            <div className="space-y-2">
              <AlertRow icon="alert-circle" color="red" title="Аномалия лояльности — Алматы-3, ущерб ~₸45 000" meta="2 ч · Антифрод" level="crit"/>
              <AlertRow icon="message-x" color="red" title="567 отзывов без ответа — норматив превышен" meta="5 ч · Репутация" level="crit"/>
              <AlertRow icon="package" color="amber" title="Дефицит 34 SKU — угроза продажам" meta="1 д · Закуп" level="warn"/>
              <AlertRow icon="device-desktop" color="purple" title="1С ошибка синхронизации Астана-2" meta="3 ч · IT" level="warn"/>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PageControl() {
  const [tab,setTab] = useState('Антифрод');
  return (
    <div>
      <MozgPanel pageId="control"/>
      <TabBar tabs={['Антифрод','Агрегаторы','Кассы и чеки','NPS и сервис','Репутация']} active={tab} onSelect={setTab}/>

      {tab==='Антифрод'&&(
        <div>
          <KPIGrid items={[
            {label:'Открытых тикетов',value:'3',color:'red'},
            {label:'Решено за месяц',value:'41',color:'green'},
            {label:'Предотвращён ущерб',value:'₸1.2М',color:'green'},
            {label:'Среднее время реакции',value:'18 ч',color:'amber'},
          ]}/>
          <Card title="Активные тикеты" subtitle="требуют расследования">
            <div className="space-y-2">
              <AlertRow icon="alert-circle" color="red" title="Алматы-3 — систематическое использование лояльности каждую пятницу 18–20:00, паттерн 6 недель подряд" meta="Открыт 2 ч назад · Назначен: СБ" level="crit"/>
              <AlertRow icon="receipt-2" color="red" title="Астана-7 — кассир Мухамедова: все 34 чека пробиты в 20:00 одновременно. Налоговый риск" meta="Открыт 4 ч назад · Назначен: Гл. бухгалтер" level="crit"/>
              <AlertRow icon="package" color="amber" title="Алматы-5 — недостача по ВТД: 50 единиц из последней поставки не оприходованы" meta="Открыт 1 д назад · Назначен: Склад" level="warn"/>
            </div>
          </Card>
          <Card title="Статистика по филиалам" subtitle="топ нарушений за месяц">
            <Bar label="Алматы-3" pct={88} color="#EF4444" val="12 случаев"/>
            <Bar label="Астана-7" pct={65} color="#F97316" val="8 случаев"/>
            <Bar label="Алматы-5" pct={40} color="#F59E0B" val="5 случаев"/>
            <Bar label="Шымкент-1" pct={25} color="#10B981" val="3 случая"/>
            <Bar label="Астана-2" pct={15} color="#10B981" val="2 случая"/>
          </Card>
        </div>
      )}

      {tab==='Агрегаторы'&&(
        <div>
          <KPIGrid items={[
            {label:'Аптек в агрегаторах',value:'22 из 24',color:'green'},
            {label:'Расхождений за неделю',value:'47',color:'red'},
            {label:'Сумма расхождений',value:'₸184К',color:'red'},
            {label:'Последняя сверка',value:'Сегодня 9:00',color:'green'},
          ]}/>
          <Card title="Сверка по агрегаторам" subtitle="за последние 7 дней">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                {name:'Glovo',orders:1240,diff:18,sum:'₸72К',color:'#FF6B35',status:'warn'},
                {name:'Яндекс Еда',orders:890,diff:22,sum:'₸88К',color:'#FFCC00',status:'crit'},
                {name:'Wolt',orders:310,diff:7,sum:'₸24К',color:'#00C2E8',status:'warn'},
              ].map(ag=>(
                <div key={ag.name} className="border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{ag.name}</span>
                    <StatusDot status={ag.status as any}/>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">Заказов: <span className="font-medium text-gray-900">{ag.orders}</span></div>
                  <div className="text-xs text-gray-500 mb-1">Расхождений: <span className="font-medium text-red-600">{ag.diff}</span></div>
                  <div className="text-xs text-gray-500">Сумма: <span className="font-medium text-red-600">{ag.sum}</span></div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <AlertRow icon="arrows-exchange" color="red" title="Яндекс Еда — 22 заказа приняты в системе агрегатора но не отражены в 1С. Алматы-2 и Алматы-4" meta="Требует сверки · ₸88К" level="crit"/>
              <AlertRow icon="arrows-exchange" color="amber" title="Glovo — 18 заказов с расхождением в составе. Возможно ручное изменение заказа без уведомления" meta="Проверить кассиров · ₸72К" level="warn"/>
              <AlertRow icon="arrows-exchange" color="amber" title="Wolt — 7 отменённых заказов не возвращены в остатки 1С" meta="Астана-1 · ₸24К" level="warn"/>
            </div>
          </Card>
        </div>
      )}

      {tab==='Кассы и чеки'&&(
        <div>
          <KPIGrid items={[
            {label:'Чеков за сегодня',value:'4 218',color:'green'},
            {label:'Отложенных чеков',value:'34',color:'red'},
            {label:'Аннулированных',value:'12',color:'amber'},
            {label:'Средний чек',value:'₸3 420',color:'gray'},
          ]}/>
          <Card title="Отложенные чеки по аптекам" subtitle="критично — требуют закрытия">
            <div className="space-y-1.5">
              {[
                {name:'Астана-7',count:14,sum:'₸48 200',status:'crit'},
                {name:'Алматы-3',count:9,sum:'₸31 400',status:'crit'},
                {name:'Алматы-5',count:7,sum:'₸24 100',status:'warn'},
                {name:'Шымкент-2',count:4,sum:'₸13 800',status:'warn'},
              ].map(r=>(
                <div key={r.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <StatusDot status={r.status as any}/>
                  <span className="text-xs font-medium text-gray-900 flex-1">{r.name}</span>
                  <span className="text-xs text-red-600 font-medium">{r.count} чеков</span>
                  <span className="text-xs text-gray-500">{r.sum}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Аномалии по времени" subtitle="за последние 30 дней">
            <AlertRow icon="clock" color="red" title="Астана-7: 34 чека пробиты одновременно в 20:00 — явная ошибка или фрод" meta="Кассир: Мухамедова · Сегодня" level="crit"/>
            <div className="mt-2">
              <AlertRow icon="receipt-off" color="amber" title="Алматы-3: 9 отложенных чека старше 3 дней — нарушение кассовой дисциплины" meta="Требует закрытия · ФНО риск" level="warn"/>
            </div>
          </Card>
        </div>
      )}

      {tab==='NPS и сервис'&&(
        <div>
          <KPIGrid items={[
            {label:'NPS',value:'44',delta:'↓ −6 за неделю',color:'amber'},
            {label:'Промоутеры',value:'58%',color:'green'},
            {label:'Пассивные',value:'28%'},
            {label:'Детракторы',value:'14%',color:'red'},
          ]}/>
          <Card title="Рейтинг фармацевтов" subtitle="топ-5 худших за месяц">
            <div className="space-y-1.5">
              {[
                {name:'Ахметова Д. (Алматы-3)',rating:3.1,neg:18,color:'red'},
                {name:'Сейткали М. (Астана-7)',rating:3.4,neg:12,color:'amber'},
                {name:'Жумагулов К. (Алматы-5)',rating:3.6,neg:8,color:'amber'},
                {name:'Нурланова А. (Шымкент-1)',rating:3.8,neg:5,color:'gray'},
                {name:'Байжанов Т. (Астана-2)',rating:3.9,neg:4,color:'gray'},
              ].map(f=>(
                <div key={f.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50">
                  <span className="text-xs text-gray-900 flex-1">{f.name}</span>
                  <span className={`text-xs font-semibold ${f.color==='red'?'text-red-600':f.color==='amber'?'text-amber-600':'text-gray-600'}`}>{f.rating} ★</span>
                  <span className="text-xs text-red-500">{f.neg} негат.</span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Топ категорий жалоб">
            <Bar label="Грубость персонала" pct={88} color="#EF4444" val="312 жалоб"/>
            <Bar label="Долгое ожидание" pct={65} color="#F97316" val="231 жалоб"/>
            <Bar label="Нет товара" pct={52} color="#F59E0B" val="184 жалобы"/>
            <Bar label="Цены" pct={38} color="#10B981" val="136 жалоб"/>
            <Bar label="Чистота" pct={28} color="#10B981" val="98 жалоб"/>
          </Card>
        </div>
      )}

      {tab==='Репутация'&&(
        <div>
          <KPIGrid items={[
            {label:'Рейтинг сети',value:'3.48',delta:'↓ −0.14',color:'amber'},
            {label:'Всего отзывов',value:'4 182',delta:'↑ +312'},
            {label:'Негативных',value:'1 063',color:'red'},
            {label:'Без ответа',value:'567',color:'amber'},
          ]}/>
          <Card title="Рейтинг по источникам">
            <Bar label="2ГИС" pct={70} color="#1D9E75" val="3.5 ★"/>
            <Bar label="Google" pct={66} color="#4285F4" val="3.3 ★"/>
            <Bar label="Яндекс" pct={72} color="#FFCC00" val="3.6 ★"/>
            <Bar label="Glovo" pct={75} color="#FF6B35" val="3.75 ★"/>
          </Card>
          <Card title="Рейтинг по филиалам" subtitle="топ худших">
            <Bar label="Алматы-3" pct={58} color="#EF4444" val="2.9 ★"/>
            <Bar label="Астана-7" pct={64} color="#F97316" val="3.2 ★"/>
            <Bar label="Шымкент-2" pct={70} color="#F59E0B" val="3.5 ★"/>
            <Bar label="Алматы-1" pct={82} color="#10B981" val="4.1 ★"/>
            <Bar label="Астана-1" pct={86} color="#10B981" val="4.3 ★"/>
          </Card>
        </div>
      )}
    </div>
  );
}

function PageDevelop() {
  const [tab,setTab] = useState('Закуп');
  return (
    <div>
      <MozgPanel pageId="develop"/>
      <TabBar tabs={['Закуп','Категории','Ценообразование']} active={tab} onSelect={setTab}/>
      {tab==='Закуп'&&(
        <div>
          <KPIGrid items={[{label:'SKU всего',value:'2 840'},{label:'Дефицит',value:'34',color:'red'},{label:'Активных заказов',value:'12',color:'amber'},{label:'Оборачиваемость',value:'18 дн.',color:'green'}]}/>
          <Card title="Товары в дефиците" subtitle="срочно заказать">
            <div className="space-y-1.5">
              {[
                {name:'Нурофен 400мг №10',stock:0,reorder:200,supplier:'Фармамаг'},
                {name:'Амоксициллин 500мг №20',stock:3,reorder:150,supplier:'МедФарм'},
                {name:'Лоратадин 10мг №30',stock:5,reorder:300,supplier:'Фармамаг'},
              ].map(r=>(
                <div key={r.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-red-50 border border-red-100">
                  <StatusDot status="crit"/>
                  <span className="text-xs text-gray-900 flex-1">{r.name}</span>
                  <span className="text-xs text-red-600">Остаток: {r.stock}</span>
                  <span className="text-xs text-gray-500">Заказ: {r.reorder} шт</span>
                  <span className="text-xs text-gray-400">{r.supplier}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      {tab==='Категории'&&(
        <div>
          <KPIGrid items={[{label:'Категорий A',value:'284',color:'green'},{label:'Категорий B',value:'710',color:'amber'},{label:'Категорий C',value:'1 846',color:'red'},{label:'На вывод',value:'43',color:'amber'}]}/>
          <Card title="ABC-анализ" subtitle="по выручке за май">
            <Bar label="Категория A (80% выручки)" pct={80} color="#10B981" val="284 SKU"/>
            <Bar label="Категория B (15% выручки)" pct={25} color="#F59E0B" val="710 SKU"/>
            <Bar label="Категория C (5% выручки)" pct={65} color="#EF4444" val="1846 SKU"/>
          </Card>
        </div>
      )}
      {tab==='Ценообразование'&&(
        <div>
          <KPIGrid items={[{label:'Ср. маржа',value:'28%',color:'green'},{label:'Ниже рынка',value:'127',color:'red'},{label:'Выше рынка',value:'84',color:'amber'},{label:'Конкурентов',value:'6'}]}/>
          <Card title="Позиции ниже рыночной цены" subtitle="потенциальная упущенная маржа">
            <Bar label="Витамин D3 2000МЕ" pct={70} color="#EF4444" val="−15%"/>
            <Bar label="Магний B6 №60" pct={55} color="#F97316" val="−12%"/>
            <Bar label="Омега-3 №30" pct={40} color="#F59E0B" val="−8%"/>
          </Card>
        </div>
      )}
    </div>
  );
}

function PageFinance() {
  return (
    <div>
      <MozgPanel pageId="finance"/>
      <KPIGrid items={[
        {label:'Выручка май',value:'₸48.2М',delta:'↑ +4.1%',color:'green'},
        {label:'Расходы',value:'₸31.1М'},
        {label:'Чистая прибыль',value:'₸17.1М',color:'green'},
        {label:'Выполнение плана',value:'96%',color:'green'},
      ]}/>
      <Card title="Выручка по филиалам" subtitle="топ-5">
        <Bar label="Алматы-1" pct={95} color="#10B981" val="₸9.1М"/>
        <Bar label="Алматы-2" pct={82} color="#10B981" val="₸7.8М"/>
        <Bar label="Астана-1" pct={71} color="#F59E0B" val="₸6.8М"/>
        <Bar label="Астана-2" pct={60} color="#F59E0B" val="₸5.7М"/>
        <Bar label="Шымкент" pct={48} color="#EF4444" val="₸4.6М"/>
      </Card>
    </div>
  );
}

function PageHR() {
  return (
    <div>
      <MozgPanel pageId="hr"/>
      <KPIGrid items={[
        {label:'Сотрудников',value:'214'},
        {label:'Вакансий',value:'8',color:'amber'},
        {label:'Текучесть',value:'6.2%',delta:'Цель: <5%',color:'amber'},
        {label:'На обучении',value:'31',color:'green'},
      ]}/>
      <Card title="Текучесть по филиалам" subtitle="проблемные зоны">
        <Bar label="Алматы-3" pct={88} color="#EF4444" val="14%"/>
        <Bar label="Астана-7" pct={60} color="#F97316" val="9.6%"/>
        <Bar label="Шымкент-2" pct={40} color="#F59E0B" val="6.4%"/>
        <Bar label="Алматы-1" pct={20} color="#10B981" val="3.2%"/>
      </Card>
    </div>
  );
}

function PageIT() {
  const [tab,setTab] = useState('Service Desk');
  return (
    <div>
      <MozgPanel pageId="it"/>
      <TabBar tabs={['Service Desk','1С разработка','Инфраструктура','Безопасность']} active={tab} onSelect={setTab}/>
      {tab==='Service Desk'&&(
        <div>
          <KPIGrid items={[{label:'Открытых заявок',value:'3',color:'amber'},{label:'Выполнено за месяц',value:'47',color:'green'},{label:'Среднее время',value:'4.2 ч',color:'amber'}]}/>
          <Card title="Заявки в работе" subtitle="от всех отделов">
            <div className="space-y-2">
              {[
                {priority:'high',title:'1С — ошибка синхронизации Астана-2',from:'Финансы · 3 ч назад',status:'В работе'},
                {priority:'med',title:'Кассовый терминал не печатает чеки — Алматы-5',from:'Операции · 6 ч назад',status:'Назначено'},
                {priority:'low',title:'Доступ к порталу для нового сотрудника HR',from:'HR · 1 д назад',status:'Очередь'},
              ].map((t,i)=>{
                const pc: Record<string,string> = {high:'bg-red-100 text-red-700',med:'bg-amber-100 text-amber-700',low:'bg-emerald-100 text-emerald-700'};
                const pl: Record<string,string> = {high:'Высокий',med:'Средний',low:'Низкий'};
                return (
                  <div key={i} className="flex items-center gap-3 p-2.5 border border-gray-100 rounded-lg">
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${pc[t.priority]}`}>{pl[t.priority]}</span>
                    <div className="flex-1 min-w-0"><div className="text-xs font-medium text-gray-900">{t.title}</div><div className="text-xs text-gray-400">{t.from}</div></div>
                    <span className="text-xs text-gray-500 flex-shrink-0">{t.status}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
      {tab==='1С разработка'&&<KPIGrid items={[{label:'Задач в спринте',value:'8'},{label:'Выполнено',value:'5',color:'green'},{label:'Критических багов',value:'1',color:'red'}]}/>}
      {tab==='Инфраструктура'&&<KPIGrid items={[{label:'Серверов',value:'6'},{label:'Uptime',value:'99.8%',color:'green'},{label:'Инцидентов',value:'0',color:'green'}]}/>}
      {tab==='Безопасность'&&<KPIGrid items={[{label:'Активных доступов',value:'214'},{label:'Подозрительных входов',value:'2',color:'red'},{label:'Бэкапов',value:'7/7',color:'green'}]}/>}
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
            <div className="text-base font-semibold text-emerald-800">МОЗГ — Садыхан</div>
            <div className="text-xs text-gray-500">Главный AI-агент · перекрёстная проверка всех отделов каждые 24 ч · доступ только АД и CEO</div>
          </div>
          <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">Активен</span>
        </div>
        <KPIGrid items={[
          {label:'Агентов под контролем',value:'12',color:'green'},
          {label:'Противоречий найдено',value:'3',color:'red'},
          {label:'Последний доклад',value:'Вчера',color:'gray'},
          {label:'Следующий доклад',value:'Завтра 9:00',color:'gray'},
        ]}/>
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {['Все агенты → отчёт','→','Перекрёстная проверка','→','Найти противоречия','→','Доклад CEO и АД'].map((s,i)=>(
            s==='→'
              ?<span key={i} className="text-gray-300 text-sm">→</span>
              :<div key={i} className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-xs text-emerald-800 flex items-center gap-1">
                <i className="ti ti-brain text-emerald-500 text-xs"></i>{s}
              </div>
          ))}
        </div>
      </div>
      <Card title="Противоречия которые нашёл МОЗГ" subtitle="требуют решения на уровне руководства">
        <div className="space-y-2">
          <AlertRow icon="arrows-exchange" color="red" title="Выручка растёт +4% но NPS падает −6. Клиенты платят но недовольны. Рекомендация: аудит сервиса в топ-аптеках" meta="Финансы ↔ Контроль · Критично" level="crit"/>
          <AlertRow icon="arrows-exchange" color="red" title="34 SKU в дефиците, но Ценообразование не скорректировало цены на аналоги. Упущенная маржа ~₸800К" meta="Закуп ↔ Ценообразование · Критично" level="crit"/>
          <AlertRow icon="arrows-exchange" color="amber" title="Алматы-3: текучесть кадров 14% совпадает с зоной антифрод-аномалий. Вероятная внутренняя связь — рекомендована проверка" meta="HR ↔ Антифрод · Внимание" level="warn"/>
        </div>
      </Card>
    </div>
  );
}

function PageBoard() {
  return (
    <div>
      <MozgPanel pageId="board"/>
      <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <i className="ti ti-brain text-emerald-700"></i>
          <span className="text-sm font-semibold text-emerald-800">Еженедельный доклад от МОЗГ — Садыхан</span>
          <span className="ml-auto text-xs text-gray-400">4 июня 2026</span>
        </div>
        <div className="space-y-2">
          <AlertRow icon="trending-up" color="green" title="Выручка растёт +4.1% но NPS падает. Требуется решение на уровне операций — предлагаю KPI по сервису для директоров" meta="МОЗГ · Приоритет 1" level="crit"/>
          <AlertRow icon="alert-triangle" color="amber" title="Алматы-3 — тройная аномалия: антифрод + текучесть + жалобы клиентов. Рекомендована внутренняя проверка" meta="МОЗГ · Приоритет 2" level="crit"/>
        </div>
      </div>
      <KPIGrid items={[
        {label:'Выручка май',value:'₸48.2М',delta:'↑ план 96%',color:'green'},
        {label:'NPS',value:'44',delta:'↓ −6',color:'amber'},
        {label:'Рейтинг сети',value:'3.48',color:'amber'},
        {label:'Крит. алертов',value:'3',color:'red'},
      ]}/>
    </div>
  );
}

function PageAgents() {
  return (
    <div>
      <div className="bg-white border-2 border-emerald-400 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <i className="ti ti-brain text-emerald-700 text-xl"></i>
          </div>
          <div>
            <div className="text-sm font-semibold text-emerald-800">МОЗГ — Садыхан</div>
            <div className="text-xs text-gray-500">Перекрёстная проверка всех агентов · еженедельный доклад CEO и АД</div>
          </div>
          <AgentBadge status="active"/>
        </div>
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Активные агенты</div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          {name:'NPS-агент',desc:'Анализирует отзывы, создаёт задачи фармацевтам, строит рейтинг сотрудников',status:'active'},
          {name:'Агент репутации',desc:'Мониторит 2ГИС/Google/Яндекс каждый час, алерт при новом негативе',status:'active'},
          {name:'IT Service агент',desc:'Принимает заявки от всех отделов, распределяет по приоритету',status:'dev'},
        ].map(a=>(
          <div key={a.name} className="bg-white border border-gray-200 rounded-xl p-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="text-xs font-semibold text-gray-900">{a.name}</div>
              <AgentBadge status={a.status as any}/>
            </div>
            <div className="text-xs text-gray-500 leading-relaxed">{a.desc}</div>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Запланированные</div>
      <div className="grid grid-cols-3 gap-3">
        {[
          {name:'Антифрод-агент',desc:'Аномалии лояльности и кассы → тикет СБ в Telegram'},
          {name:'Агент агрегаторов',desc:'Сверка Glovo/Яндекс/Wolt с 1С ежедневно'},
          {name:'Reorder-агент',desc:'Остатки ниже минимума → авто-заявка поставщику'},
          {name:'Финансовый агент',desc:'P&L авто-генерация, план-факт, Cash flow прогноз'},
          {name:'Юридический агент',desc:'Сроки договоров, проверки Минздрава, лицензии'},
          {name:'1С-агент',desc:'Мониторинг ошибок синхронизации, авто-алерт IT'},
        ].map(a=>(
          <div key={a.name} className="bg-white border border-gray-200 rounded-xl p-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="text-xs font-semibold text-gray-900">{a.name}</div>
              <AgentBadge status="planned"/>
            </div>
            <div className="text-xs text-gray-500 leading-relaxed">{a.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────
export default function PortalPage() {
  const [page,setPage] = useState<PageId>('overview');
  const [mounted,setMounted] = useState(false);
  useEffect(()=>{ setMounted(true); },[]);
  if(!mounted) return null;

  const renderPage = () => {
    switch(page) {
      case 'overview': return <PageOverview setPage={setPage}/>;
      case 'mozg': return <PageMozg/>;
      case 'alerts': return (
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Критические</div>
          <div className="space-y-2 mb-4">
            <AlertRow icon="alert-circle" color="red" title="Аномалия лояльности — Алматы-3, каждую пятницу 18–20:00, ущерб ~₸45 000" meta="2 ч · Антифрод · Открыт" level="crit"/>
            <AlertRow icon="receipt-2" color="red" title="Кассир Астана-7 — все 34 чека одновременно в 20:00, налоговый риск" meta="4 ч · Антифрод · Открыт" level="crit"/>
            <AlertRow icon="message-x" color="red" title="567 отзывов без ответа — норматив 18% превышен" meta="5 ч · Репутация · Открыт" level="crit"/>
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Предупреждения</div>
          <div className="space-y-2">
            <AlertRow icon="chart-line-down" color="amber" title="NPS снизился на 6 пунктов за неделю" meta="2 д · NPS" level="warn"/>
            <AlertRow icon="device-desktop" color="purple" title="1С ошибка синхронизации Астана-2 — данные неточны" meta="3 ч · IT" level="warn"/>
          </div>
        </div>
      );
      case 'control': return <PageControl/>;
      case 'develop': return <PageDevelop/>;
      case 'finance': return <PageFinance/>;
      case 'hr': return <PageHR/>;
      case 'it': return <PageIT/>;
      case 'board': return <PageBoard/>;
      case 'agents': return <PageAgents/>;
      case 'marketing': return (
        <div>
          <KPIGrid items={[{label:'Активных акций',value:'7',color:'green'},{label:'Участников лояльности',value:'48 200'},{label:'Конверсия акций',value:'12.4%',color:'amber'},{label:'Повторные покупки',value:'64%',color:'green'}]}/>
        </div>
      );
      case 'operations': return (
        <div>
          <KPIGrid items={[{label:'Аптек всего',value:'24'},{label:'Лицензий истекает',value:'2',delta:'В течение 30 дн.',color:'amber'},{label:'Проверок прошло',value:'21/24',color:'green'},{label:'Нарушений',value:'1',color:'red'}]}/>
        </div>
      );
      case 'legal': return (
        <div>
          <KPIGrid items={[{label:'Активных договоров',value:'84'},{label:'Истекают в 30 дн.',value:'6',color:'amber'},{label:'Лицензий аптек',value:'24/24',color:'green'},{label:'Проверок Минздрава',value:'0',color:'green'}]}/>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-52 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
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
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV.map(sec=>(
            <div key={sec.section}>
              <div className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-3 pb-1 font-medium">{sec.section}</div>
              {sec.items.map(it=>(
                <button key={it.id} onClick={()=>setPage(it.id as PageId)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs border-l-2 transition-all duration-150 text-left ${page===it.id?'bg-emerald-50 text-emerald-800 border-emerald-500 font-semibold':'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'}`}>
                  <i className={`ti ti-${it.icon} text-sm flex-shrink-0 ${page===it.id?'text-emerald-600':'text-gray-400'}`}></i>
                  <span className="flex-1 truncate">{it.label}</span>
                  {(it as any).badge&&<span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${(it as any).bc==='red'?'bg-red-100 text-red-700':(it as any).bc==='amber'?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>{(it as any).badge}</span>}
                </button>
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
          <div>
            <div className="text-sm font-semibold text-gray-900">{TITLES[page]}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={()=>setPage('alerts')} className="bg-red-50 text-red-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium hover:bg-red-100 transition-colors">
              <i className="ti ti-alert-triangle text-xs"></i> 4 алерта
            </button>
            <button onClick={()=>setPage('mozg')} className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium hover:bg-emerald-100 transition-colors">
              <i className="ti ti-brain text-xs"></i> МОЗГ
            </button>
            <i className="ti ti-bell text-gray-400 text-base cursor-pointer hover:text-gray-600 transition-colors"></i>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
