'use client';
import { useState } from 'react';

const titles: Record<string,string> = {
  overview:'Обзор компании',alerts:'Алерты',mozg:'МОЗГ — Садыхан',
  control:'Контроль и аудит',develop:'Развитие',finance:'Финансы',
  hr:'HR и сотрудники',marketing:'Маркетинг и лояльность',
  operations:'Операционный контроль',it:'IT и Service Desk',
  legal:'Юридический / Комплаенс',board:'Совет директоров',agents:'AI-агенты'
};

const navItems = [
  { section:'Главная', items:[
    {id:'overview',icon:'layout-dashboard',label:'Обзор'},
    {id:'alerts',icon:'bell',label:'Алерты',badge:'4',badgeColor:'red'},
    {id:'mozg',icon:'brain',label:'МОЗГ — Садыхан',badge:'AI',badgeColor:'green'},
  ]},
  { section:'Отделы', items:[
    {id:'control',icon:'shield-check',label:'Контроль и аудит'},
    {id:'develop',icon:'trending-up',label:'Развитие'},
    {id:'finance',icon:'cash',label:'Финансы'},
    {id:'hr',icon:'users',label:'HR'},
    {id:'marketing',icon:'speakerphone',label:'Маркетинг'},
    {id:'operations',icon:'clipboard-check',label:'Операции'},
    {id:'it',icon:'device-desktop',label:'IT',badge:'3',badgeColor:'amber'},
    {id:'legal',icon:'scale',label:'Юридический'},
  ]},
  { section:'Топ-уровень', items:[
    {id:'board',icon:'crown',label:'Совет директоров'},
    {id:'agents',icon:'robot',label:'AI-агенты'},
  ]},
];

function KpiGrid({items}:{items:{label:string,value:string,delta?:string,color?:string}[]}) {
  return (
    <div className="grid grid-cols-4 gap-2 mb-3">
      {items.map(k=>(
        <div key={k.label} className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">{k.label}</div>
          <div className={`text-xl font-medium ${k.color==='green'?'text-emerald-700':k.color==='red'?'text-red-700':k.color==='amber'?'text-amber-700':'text-gray-900'}`}>{k.value}</div>
          {k.delta&&<div className="text-xs text-gray-400 mt-0.5">{k.delta}</div>}
        </div>
      ))}
    </div>
  );
}

function Tabs({tabs,active,onSelect}:{tabs:string[],active:string,onSelect:(t:string)=>void}) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-3">
      {tabs.map(t=>(
        <button key={t} onClick={()=>onSelect(t)}
          className={`flex-1 text-xs py-1.5 rounded-md transition-all ${active===t?'bg-white font-medium text-gray-900 border border-gray-200':'text-gray-500'}`}>
          {t}
        </button>
      ))}
    </div>
  );
}

function AlertItem({icon,color,text,meta}:{icon:string,color:string,text:string,meta:string}) {
  const bg: Record<string,string> = {red:'bg-red-50',amber:'bg-amber-50',green:'bg-emerald-50',purple:'bg-purple-50'};
  const ic: Record<string,string> = {red:'text-red-700',amber:'text-amber-700',green:'text-emerald-700',purple:'text-purple-700'};
  return (
    <div className="flex items-start gap-2 p-2.5 border border-gray-200 rounded-lg">
      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${bg[color]}`}>
        <i className={`ti ti-${icon} text-sm ${ic[color]}`}></i>
      </div>
      <div><div className="text-xs text-gray-900 leading-snug">{text}</div><div className="text-xs text-gray-400 mt-0.5">{meta}</div></div>
    </div>
  );
}

function BarChart({rows}:{rows:{label:string,pct:number,color:string,val:string}[]}) {
  return (
    <div className="space-y-1.5 mt-2">
      {rows.map(r=>(
        <div key={r.label} className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-24 truncate">{r.label}</span>
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{width:`${r.pct}%`,background:r.color}}></div>
          </div>
          <span className="text-xs text-gray-500 w-10 text-right">{r.val}</span>
        </div>
      ))}
    </div>
  );
}

function TicketRow({priority,title,from,status}:{priority:'high'|'med'|'low',title:string,from:string,status:string}) {
  const pc = {high:'bg-red-100 text-red-700',med:'bg-amber-100 text-amber-700',low:'bg-emerald-100 text-emerald-700'};
  const pl = {high:'Высокий',med:'Средний',low:'Низкий'};
  return (
    <div className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg">
      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${pc[priority]}`}>{pl[priority]}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-900 truncate">{title}</div>
        <div className="text-xs text-gray-400">{from}</div>
      </div>
      <span className="text-xs text-gray-500 flex-shrink-0">{status}</span>
    </div>
  );
}

export default function PortalPage() {
  const [page, setPage] = useState('overview');
  const [ctTab, setCtTab] = useState('Антифрод');
  const [dvTab, setDvTab] = useState('Закуп');
  const [itTab, setItTab] = useState('Service Desk');

  return (
    <div className="flex h-screen bg-gray-100 text-sm">
      {/* Sidebar */}
      <div className="w-52 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
              <i className="ti ti-building-store text-white text-sm"></i>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-900">Садыхан</div>
              <div className="text-xs text-gray-400">Корп. платформа</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map(sec=>(
            <div key={sec.section}>
              <div className="text-xs text-gray-400 uppercase tracking-wider px-3 pt-3 pb-1">{sec.section}</div>
              {sec.items.map(it=>(
                <button key={it.id} onClick={()=>setPage(it.id)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs border-l-2 transition-all text-left ${page===it.id?'bg-emerald-50 text-emerald-800 border-emerald-500 font-medium':'text-gray-600 border-transparent hover:bg-gray-50'}`}>
                  <i className={`ti ti-${it.icon} text-sm flex-shrink-0`}></i>
                  <span className="flex-1">{it.label}</span>
                  {it.badge&&<span className={`text-xs px-1.5 py-0.5 rounded-full ${it.badgeColor==='red'?'bg-red-100 text-red-700':it.badgeColor==='amber'?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>{it.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200 flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">АД</div>
          <div><div className="text-xs font-medium text-gray-900">АД</div><div className="text-xs text-gray-400">Полный доступ</div></div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white border-b border-gray-200 px-4 h-11 flex items-center gap-3">
          <div>
            <div className="text-sm font-medium text-gray-900">{titles[page]}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={()=>setPage('alerts')} className="bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <i className="ti ti-alert-triangle text-xs"></i> 4 алерта
            </button>
            <i className="ti ti-bell text-gray-400 text-base cursor-pointer"></i>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">

          {/* ОБЗОР */}
          {page==='overview'&&(
            <div>
              <KpiGrid items={[
                {label:'Рейтинг сети',value:'3.48',delta:'↓ −0.14',color:'amber'},
                {label:'NPS',value:'44',delta:'↓ −6 нед.',color:'amber'},
                {label:'Выручка май',value:'₸48.2М',delta:'↑ план 96%',color:'green'},
                {label:'Алертов',value:'4',delta:'3 критических',color:'red'},
              ]}/>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-3">
                  <div className="text-xs font-medium text-gray-900 mb-2">Отделы — статус</div>
                  <div className="space-y-2">
                    {[
                      {id:'control',icon:'shield-check',color:'#FCEBEB',ic:'#A32D2D',name:'Контроль и аудит',kpi:'3 тикета · Рейтинг 3.48',dot:'bg-red-500'},
                      {id:'develop',icon:'trending-up',color:'#FAEEDA',ic:'#854F0B',name:'Развитие',kpi:'Дефицит 34 SKU',dot:'bg-amber-400'},
                      {id:'finance',icon:'cash',color:'#E6F1FB',ic:'#185FA5',name:'Финансы',kpi:'₸48.2М · план 96%',dot:'bg-emerald-500'},
                      {id:'it',icon:'device-desktop',color:'#EEEDFE',ic:'#534AB7',name:'IT',kpi:'3 открытых заявки',dot:'bg-amber-400'},
                      {id:'operations',icon:'clipboard-check',color:'#EAF3DE',ic:'#3B6D11',name:'Операции',kpi:'2 лицензии истекают',dot:'bg-amber-400'},
                    ].map(d=>(
                      <div key={d.id} onClick={()=>setPage(d.id)} className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg cursor-pointer hover:border-gray-300">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{background:d.color}}>
                          <i className={`ti ti-${d.icon} text-xs`} style={{color:d.ic}}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-900">{d.name}</div>
                          <div className="text-xs text-gray-400">{d.kpi}</div>
                        </div>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${d.dot}`}></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-3">
                  <div className="text-xs font-medium text-gray-900 mb-2">Последние алерты</div>
                  <div className="space-y-2">
                    <AlertItem icon="alert-circle" color="red" text="Аномалия лояльности — Алматы-3, ущерб ~₸45 000" meta="2 ч · Антифрод"/>
                    <AlertItem icon="message-x" color="red" text="567 отзывов без ответа — норматив превышен" meta="5 ч · Репутация"/>
                    <AlertItem icon="package" color="amber" text="Дефицит 34 SKU — угроза продажам" meta="1 д · Закуп"/>
                    <AlertItem icon="device-desktop" color="purple" text="1С ошибка синхронизации Астана-2" meta="3 ч · IT"/>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* МОЗГ */}
          {page==='mozg'&&(
            <div>
              <div className="bg-white border-2 border-emerald-500 rounded-xl p-4 mb-3">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="ti ti-brain text-emerald-700 text-xl"></i>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-emerald-800">МОЗГ — Садыхан</div>
                    <div className="text-xs text-gray-500">Главный AI-агент · перекрёстная проверка всех отделов каждые 24 ч</div>
                  </div>
                  <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">Активен</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[{l:'Агентов под контролем',v:'12'},{l:'Противоречий найдено',v:'3'},{l:'Последний доклад',v:'Вчера'},{l:'Следующий',v:'Завтра 9:00'}].map(k=>(
                    <div key={k.l} className="bg-emerald-50 rounded-lg p-2.5">
                      <div className="text-xs text-emerald-700 mb-1">{k.l}</div>
                      <div className="text-base font-medium text-emerald-900">{k.v}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {['Все агенты → отчёт','Перекрёстная проверка','Найти противоречия','Доклад CEO и АД'].map((s,i,arr)=>(
                    <div key={s} className="flex items-center gap-2">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 flex items-center gap-1">
                        <i className="ti ti-brain text-emerald-600 text-xs"></i>{s}
                      </div>
                      {i<arr.length-1&&<span className="text-gray-400 text-xs">→</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-3">
                <div className="text-xs font-medium text-gray-900 mb-2">Противоречия которые нашёл МОЗГ</div>
                <div className="space-y-2">
                  <AlertItem icon="arrows-exchange" color="red" text="Выручка растёт +4%, но NPS падает −6. Клиенты платят но недовольны. Рекомендация: аудит сервиса в топ-аптеках" meta="Финансы ↔ Контроль · Критично"/>
                  <AlertItem icon="arrows-exchange" color="amber" text="34 SKU в дефиците, но Ценообразование не скорректировало цены на замены. Потеря маржи ~₸800 000" meta="Закуп ↔ Ценообразование · Внимание"/>
                  <AlertItem icon="arrows-exchange" color="amber" text="Текучесть растёт в Алматы-3 — том же филиале где аномалия лояльности. Вероятная связь" meta="HR ↔ Антифрод · Внимание"/>
                </div>
              </div>
            </div>
          )}

          {/* АЛЕРТЫ */}
          {page==='alerts'&&(
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Критические</div>
              <div className="space-y-2 mb-4">
                <AlertItem icon="alert-circle" color="red" text="Аномалия лояльности — Алматы-3, каждую пятницу 18–20:00, ущерб ~₸45 000" meta="2 ч · Антифрод · Открыт"/>
                <AlertItem icon="receipt-2" color="red" text="Кассир Астана-7 — все чеки одновременно в 20:00, налоговый риск" meta="4 ч · Антифрод · Открыт"/>
                <AlertItem icon="message-x" color="red" text="567 отзывов без ответа — норматив 18% превышен" meta="5 ч · Репутация · Открыт"/>
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Предупреждения</div>
              <div className="space-y-2">
                <AlertItem icon="chart-line-down" color="amber" text="NPS снизился на 6 пунктов за неделю" meta="2 д · NPS"/>
                <AlertItem icon="device-desktop" color="amber" text="1С ошибка синхронизации Астана-2 — данные могут быть неточными" meta="3 ч · IT"/>
              </div>
            </div>
          )}

          {/* КОНТРОЛЬ */}
          {page==='control'&&(
            <div>
              <Tabs tabs={['Антифрод','NPS и сервис','Репутация']} active={ctTab} onSelect={setCtTab}/>
              {ctTab==='Антифрод'&&<KpiGrid items={[{label:'Открытых тикетов',value:'3',color:'red'},{label:'Решено за месяц',value:'41',color:'green'},{label:'Предотвращён ущерб',value:'₸1.2М',color:'green'},{label:'Время реакции',value:'18 ч',color:'amber'}]}/>}
              {ctTab==='NPS и сервис'&&<KpiGrid items={[{label:'NPS',value:'44',color:'amber'},{label:'Промоутеры',value:'58%',color:'green'},{label:'Пассивные',value:'28%'},{label:'Детракторы',value:'14%',color:'red'}]}/>}
              {ctTab==='Репутация'&&<KpiGrid items={[{label:'Рейтинг сети',value:'3.48',color:'amber'},{label:'Всего отзывов',value:'4 182'},{label:'Негативных',value:'1 063',color:'red'},{label:'Без ответа',value:'567',color:'amber'}]}/>}
            </div>
          )}

          {/* РАЗВИТИЕ */}
          {page==='develop'&&(
            <div>
              <Tabs tabs={['Закуп','Категории','Ценообразование']} active={dvTab} onSelect={setDvTab}/>
              {dvTab==='Закуп'&&<KpiGrid items={[{label:'SKU всего',value:'2 840'},{label:'Дефицит',value:'34',color:'red'},{label:'Активных заказов',value:'12',color:'amber'},{label:'Оборачиваемость',value:'18 дн.',color:'green'}]}/>}
              {dvTab==='Категории'&&<KpiGrid items={[{label:'Категорий A',value:'284',color:'green'},{label:'Категорий B',value:'710',color:'amber'},{label:'Категорий C',value:'1 846',color:'red'},{label:'На вывод',value:'43',color:'amber'}]}/>}
              {dvTab==='Ценообразование'&&<KpiGrid items={[{label:'Ср. маржа',value:'28%',color:'green'},{label:'Ниже рынка',value:'127',color:'red'},{label:'Выше рынка',value:'84',color:'amber'},{label:'Конкурентов',value:'6'}]}/>}
            </div>
          )}

          {/* ФИНАНСЫ */}
          {page==='finance'&&(
            <div>
              <KpiGrid items={[{label:'Выручка май',value:'₸48.2М',delta:'↑ +4.1%',color:'green'},{label:'Расходы',value:'₸31.1М'},{label:'Прибыль',value:'₸17.1М',color:'green'},{label:'Выполнение плана',value:'96%',color:'green'}]}/>
              <div className="bg-white border border-gray-200 rounded-xl p-3">
                <div className="text-xs font-medium text-gray-900 mb-1">Выручка по филиалам</div>
                <BarChart rows={[
                  {label:'Алматы-1',pct:95,color:'#1D9E75',val:'₸9.1М'},
                  {label:'Алматы-2',pct:82,color:'#1D9E75',val:'₸7.8М'},
                  {label:'Астана-1',pct:71,color:'#EF9F27',val:'₸6.8М'},
                  {label:'Астана-2',pct:60,color:'#EF9F27',val:'₸5.7М'},
                  {label:'Шымкент',pct:48,color:'#E24B4A',val:'₸4.6М'},
                ]}/>
              </div>
            </div>
          )}

          {/* HR */}
          {page==='hr'&&<KpiGrid items={[{label:'Сотрудников',value:'214'},{label:'Вакансий',value:'8',color:'amber'},{label:'Текучесть',value:'6.2%',delta:'Цель: <5%',color:'amber'},{label:'На обучении',value:'31',color:'green'}]}/>}

          {/* МАРКЕТИНГ */}
          {page==='marketing'&&<KpiGrid items={[{label:'Активных акций',value:'7',color:'green'},{label:'Участников лояльности',value:'48 200'},{label:'Конверсия акций',value:'12.4%',color:'amber'},{label:'Повторные покупки',value:'64%',color:'green'}]}/>}

          {/* ОПЕРАЦИИ */}
          {page==='operations'&&<KpiGrid items={[{label:'Аптек всего',value:'24'},{label:'Лицензий истекает',value:'2',delta:'В течение 30 дн.',color:'amber'},{label:'Проверок прошло',value:'21/24',color:'green'},{label:'Нарушений',value:'1',color:'red'}]}/>}

          {/* IT */}
          {page==='it'&&(
            <div>
              <Tabs tabs={['Service Desk','1С разработка','Инфраструктура','Безопасность']} active={itTab} onSelect={setItTab}/>
              {itTab==='Service Desk'&&(
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[{label:'Открытых заявок',value:'3',color:'amber'},{label:'Выполнено за месяц',value:'47',color:'green'},{label:'Среднее время',value:'4.2 ч',color:'amber'}].map(k=>(
                      <div key={k.label} className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">{k.label}</div><div className={`text-xl font-medium ${k.color==='green'?'text-emerald-700':'text-amber-700'}`}>{k.value}</div></div>
                    ))}
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-3">
                    <div className="text-xs font-medium text-gray-900 mb-2">Заявки в работе</div>
                    <div className="space-y-2">
                      <TicketRow priority="high" title="1С — ошибка синхронизации Астана-2" from="Финансы · 3 ч назад" status="В работе"/>
                      <TicketRow priority="med" title="Кассовый терминал не печатает — Алматы-5" from="Операции · 6 ч назад" status="Назначено"/>
                      <TicketRow priority="low" title="Доступ к порталу для нового сотрудника" from="HR · 1 д назад" status="Очередь"/>
                    </div>
                  </div>
                </div>
              )}
              {itTab==='1С разработка'&&<div className="grid grid-cols-3 gap-2"><div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Задач в спринте</div><div className="text-xl font-medium text-gray-900">8</div></div><div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Выполнено</div><div className="text-xl font-medium text-emerald-700">5</div></div><div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Критических багов</div><div className="text-xl font-medium text-red-700">1</div></div></div>}
              {itTab==='Инфраструктура'&&<div className="grid grid-cols-3 gap-2"><div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Серверов</div><div className="text-xl font-medium text-gray-900">6</div></div><div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Uptime</div><div className="text-xl font-medium text-emerald-700">99.8%</div></div><div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Инцидентов</div><div className="text-xl font-medium text-emerald-700">0</div></div></div>}
              {itTab==='Безопасность'&&<div className="grid grid-cols-3 gap-2"><div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Активных доступов</div><div className="text-xl font-medium text-gray-900">214</div></div><div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Подозрительных входов</div><div className="text-xl font-medium text-red-700">2</div></div><div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Бэкапов</div><div className="text-xl font-medium text-emerald-700">7/7</div></div></div>}
            </div>
          )}

          {/* ЮРИДИЧЕСКИЙ */}
          {page==='legal'&&<KpiGrid items={[{label:'Активных договоров',value:'84'},{label:'Истекают в 30 дн.',value:'6',color:'amber'},{label:'Лицензий аптек',value:'24/24',color:'green'},{label:'Проверок Минздрава',value:'0',color:'green'}]}/>}

          {/* СОВЕТ ДИРЕКТОРОВ */}
          {page==='board'&&(
            <div>
              <div className="bg-white border-2 border-emerald-500 rounded-xl p-3 mb-3">
                <div className="text-xs font-medium text-emerald-800 mb-2 flex items-center gap-1"><i className="ti ti-brain"></i> Доклад от МОЗГ — Садыхан</div>
                <div className="space-y-2">
                  <AlertItem icon="trending-up" color="green" text="Выручка растёт +4.1% но NPS падает. Требуется решение на уровне операций" meta="МОЗГ · Приоритет 1"/>
                  <AlertItem icon="alert-triangle" color="amber" text="Алматы-3 — связь между антифродом и текучестью кадров. Рекомендована внутренняя проверка" meta="МОЗГ · Приоритет 2"/>
                </div>
              </div>
              <KpiGrid items={[{label:'Выручка май',value:'₸48.2М',delta:'↑ план 96%',color:'green'},{label:'NPS',value:'44',delta:'↓ −6',color:'amber'},{label:'Рейтинг сети',value:'3.48',color:'amber'},{label:'Крит. алертов',value:'3',color:'red'}]}/>
            </div>
          )}

          {/* АГЕНТЫ */}
          {page==='agents'&&(
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Главный агент</div>
              <div className="bg-white border-2 border-emerald-500 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"><i className="ti ti-brain text-emerald-700"></i></div>
                  <div><div className="text-xs font-medium text-emerald-800">МОЗГ — Садыхан</div><div className="text-xs text-gray-500">Перекрёстная проверка всех агентов · еженедельный доклад CEO и АД</div></div>
                  <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Активен</span>
                </div>
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Активные</div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[{name:'NPS-агент',desc:'Анализирует отзывы, задачи фармацевтам, рейтинг сотрудников',status:'active'},{name:'Агент репутации',desc:'Мониторит 2ГИС / Google каждый час, алерт при негативе',status:'active'},{name:'IT Service агент',desc:'Принимает заявки, распределяет по приоритету и исполнителю',status:'dev'}].map(a=>(
                  <div key={a.name} className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="text-xs font-medium text-gray-900 mb-1">{a.name}</div>
                    <div className="text-xs text-gray-500 mb-2 leading-snug">{a.desc}</div>
                    <div className="flex items-center gap-1 text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full ${a.status==='active'?'bg-emerald-500':'bg-amber-400'}`}></div>
                      <span className="text-gray-500">{a.status==='active'?'Активен':'В разработке'}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Запланированные</div>
              <div className="grid grid-cols-3 gap-2">
                {[{name:'Антифрод-агент',desc:'Аномалии лояльности и кассы → тикет СБ'},{name:'Reorder-агент',desc:'Остатки ниже минимума → авто-заявка поставщику'},{name:'Финансовый агент',desc:'P&L авто-генерация, план-факт, Cash flow'},{name:'Операционный агент',desc:'Лицензии, сроки годности, стандарты хранения'},{name:'Юридический агент',desc:'Сроки договоров, проверки Минздрава'},{name:'1С-агент',desc:'Мониторинг ошибок синхронизации, алерт IT'}].map(a=>(
                  <div key={a.name} className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="text-xs font-medium text-gray-900 mb-1">{a.name}</div>
                    <div className="text-xs text-gray-500 mb-2 leading-snug">{a.desc}</div>
                    <div className="flex items-center gap-1 text-xs"><div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div><span className="text-gray-400">Запланирован</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
