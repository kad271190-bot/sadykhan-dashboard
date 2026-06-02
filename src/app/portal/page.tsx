'use client';

import { useState } from 'react';

const departments = [
  {
    id: 'control',
    name: 'Контроль и аудит',
    icon: '🛡️',
    color: 'red',
    head: 'АД (Вы)',
    access: 'Полный доступ',
    subs: [
      {
        name: 'Антифрод',
        agents: ['Аномалии лояльности → тикет СБ', 'Кассовые нарушения → алерт', 'ВТД-сверка → недостачи'],
        status: 'active',
        kpi: { label: 'Открытых тикетов', value: '3', color: 'red' },
      },
      {
        name: 'NPS и сервис',
        agents: ['NPS-отчёт → задача фармацевту', 'Рейтинг сотрудников авто', 'Тренд жалоб → рекомендации'],
        status: 'active',
        kpi: { label: 'NPS', value: '44', color: 'amber' },
      },
      {
        name: 'Репутация',
        agents: ['2ГИС / Google мониторинг', 'Негатив → задача ответственному', 'Авто-ответы (в разработке)'],
        status: 'active',
        kpi: { label: 'Рейтинг', value: '3.48', color: 'amber' },
        link: '/dashboard',
      },
    ],
  },
  {
    id: 'development',
    name: 'Развитие',
    icon: '📈',
    color: 'amber',
    head: 'Директор по развитию',
    access: 'Руководитель отдела',
    subs: [
      {
        name: 'Закуп',
        agents: ['Reorder → авто-заявки', 'Дефицит → алерт', 'Сезонность → прогноз спроса'],
        status: 'planned',
        kpi: { label: 'Дефицит SKU', value: '34', color: 'red' },
      },
      {
        name: 'Категории',
        agents: ['ABC-анализ товаров', 'Матрица авто-обновление', 'Новинки рынка → рекомендация'],
        status: 'planned',
        kpi: { label: 'SKU всего', value: '2840', color: 'green' },
      },
      {
        name: 'Ценообразование',
        agents: ['Мониторинг цен конкурентов', 'Авто-пересчёт по правилам', 'Маржа → алерт при падении'],
        status: 'planned',
        kpi: { label: 'Маржа', value: '28%', color: 'green' },
      },
    ],
  },
  {
    id: 'finance',
    name: 'Финансы',
    icon: '💰',
    color: 'blue',
    head: 'Финансовый директор',
    access: 'Руководитель отдела',
    subs: [
      {
        name: 'Финотчётность',
        agents: ['P&L авто-генерация', 'План-факт → отклонения CEO', 'Cash flow прогноз 30 дней'],
        status: 'planned',
        kpi: { label: 'Выручка май', value: '₸48.2М', color: 'green' },
      },
      {
        name: 'Аналитика',
        agents: ['Выручка по филиалам', 'Прогноз следующего месяца', 'Аномалии расходов → алерт'],
        status: 'planned',
        kpi: { label: 'План', value: '96%', color: 'green' },
      },
      {
        name: 'Бухгалтерия',
        agents: ['Проверка счёт-фактур', 'Сверка ВТД и инвойсов', 'Налоговые риски → сигнал'],
        status: 'planned',
        kpi: { label: 'Ошибок', value: '2', color: 'red' },
      },
    ],
  },
  {
    id: 'hr',
    name: 'HR',
    icon: '👥',
    color: 'purple',
    head: 'HR-директор',
    access: 'Руководитель отдела',
    subs: [
      {
        name: 'Персонал',
        agents: ['Онбординг → авто-обучение', 'KPI сотрудников → отчёт', 'Текучесть → предупреждение'],
        status: 'planned',
        kpi: { label: 'Сотрудников', value: '214', color: 'green' },
      },
      {
        name: 'Рейтинг персонала',
        agents: ['Рейтинг фармацевтов из NPS', 'Лучший сотрудник месяца', 'Нарушения → в личное дело'],
        status: 'planned',
        kpi: { label: 'Текучесть', value: '6.2%', color: 'amber' },
      },
    ],
  },
];

const topKpi = [
  { label: 'Рейтинг сети', value: '3.48', delta: '↓ -0.14', color: 'text-amber-600' },
  { label: 'NPS', value: '44', delta: '↓ -6 нед.', color: 'text-amber-600' },
  { label: 'Выручка май', value: '₸48.2М', delta: '↑ план 96%', color: 'text-emerald-600' },
  { label: 'Алертов', value: '4', delta: '3 критических', color: 'text-red-600' },
];

export default function PortalPage() {
  const [activeDept, setActiveDept] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">С</div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Садыхан</div>
            <div className="text-xs text-gray-500">Корпоративная платформа</div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">⚠ 4 алерта</span>
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">АД</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {topKpi.map((k) => (
            <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">{k.label}</div>
              <div className={`text-2xl font-semibold ${k.color}`}>{k.value}</div>
              <div className="text-xs text-gray-400 mt-1">{k.delta}</div>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Отделы компании</div>
        <div className="space-y-4">
          {departments.map((dept) => (
            <div key={dept.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <div
                className="px-5 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setActiveDept(activeDept === dept.id ? null : dept.id)}
              >
                <span className="text-xl">{dept.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{dept.name}</div>
                  <div className="text-xs text-gray-500">{dept.head} — {dept.access}</div>
                </div>
                <div className="ml-auto text-gray-400">{activeDept === dept.id ? '▲' : '▼'}</div>
              </div>

              {activeDept === dept.id && (
                <div className="p-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {dept.subs.map((sub) => (
                    <div key={sub.name} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-gray-900">{sub.name}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${sub.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {sub.status === 'active' ? 'Активен' : 'Планируется'}
                        </span>
                      </div>
                      <div className="mb-3">
                        <div className="text-xs text-gray-400">{sub.kpi.label}</div>
                        <div className="text-lg font-semibold text-gray-900">{sub.kpi.value}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400 mb-1">AI-агенты:</div>
                        {sub.agents.map((agent) => (
                          <div key={agent} className="flex items-start gap-1.5 text-xs text-gray-600">
                            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${sub.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                            {agent}
                          </div>
                        ))}
                      </div>
                      {sub.link && (
                        <a href={sub.link} className="mt-3 block text-xs text-blue-600 hover:underline">
                          Открыть дашборд →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-4">
          <div>
            <div className="text-sm font-medium text-gray-900">🗄️ ClickHouse — единая база данных</div>
            <div className="text-xs text-gray-400">1С → репликация каждый час · Все агенты читают отсюда (read-only)</div>
          </div>
          <div className="ml-auto flex gap-2">
            {['1С', 'ОФД', '2ГИС', 'Лояльность'].map((tag) => (
              <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
