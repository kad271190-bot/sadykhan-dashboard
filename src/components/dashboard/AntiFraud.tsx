'use client'

import { useState } from 'react'

const CITIES = [
  { name: 'Алматы', risk: 82, color: '#e53e3e', level: 'Высокий' },
  { name: 'Астана', risk: 54, color: '#F7941D', level: 'Средний' },
  { name: 'Тараз', risk: 28, color: '#2dbcb4', level: 'Низкий' },
  { name: 'Шымкент', risk: 19, color: '#2dbcb4', level: 'Низкий' },
]

const ALERTS = [
  { text: 'Кассир Иванова А. — 5 отмен чеков за 30 мин, аптека Мамыр', time: '14:01', color: '#e53e3e' },
  { text: 'Расхождение 1С vs Glovo: чек №4821 на 3 200 ₸ не найден', time: '13:47', color: '#F7941D' },
  { text: 'Накладная №1093 не проведена 2 дня — аптека Шахристан', time: '13:22', color: '#F7941D' },
  { text: 'Сверка Bolt Food завершена — расхождений нет', time: '12:55', color: '#2dbcb4' },
]

const CASHIERS = [
  { initials: 'ИА', name: 'Иванова А.', branch: 'Мамыр, Алматы', score: 8.4, bg: '#fff0f0', color: '#c53030' },
  { initials: 'СМ', name: 'Сейткали М.', branch: 'Центр, Астана', score: 5.1, bg: '#fffbeb', color: '#b7791f' },
  { initials: 'АБ', name: 'Абдова Б.', branch: 'Тараз, центр', score: 1.2, bg: '#f0fff4', color: '#276749' },
]

export default function AntiFraud() {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'cashiers'>('overview')

  return (
    <div style={{ padding: '24px', fontFamily: 'Open Sans, sans-serif' }}>
      
      {/* Header */}
      <div style={{ background: '#204d52', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2dbcb4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛡️</div>
          <div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 500 }}>садыхан — антифрод</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Система контроля касс и движения товара</div>
          </div>
        </div>
        <span style={{ background: '#F7941D', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 20 }}>3 алерта</span>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Выручка сегодня', value: '4 820 000 ₸', delta: '+6% к вчера', deltaColor: '#2dbcb4' },
          { label: 'Аномалий выявлено', value: '7', delta: '+3 за час', deltaColor: '#c53030', valueColor: '#c53030' },
          { label: 'Сторно / возвраты', value: '23', delta: 'норма: до 10', deltaColor: '#c53030' },
          { label: 'Сверка эквайринга', value: '98.2%', delta: 'расхождение: 87 500 ₸', deltaColor: '#2dbcb4', valueColor: '#276749' },
        ].map((m, i) => (
          <div key={i} style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 12, color: '#718096', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: m.valueColor || '#1a202c' }}>{m.value}</div>
            <div style={{ fontSize: 11, color: m.deltaColor, marginTop: 2 }}>{m.delta}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['overview', 'alerts', 'cashiers'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
            background: activeTab === tab ? '#2dbcb4' : '#f7fafc',
            color: activeTab === tab ? '#fff' : '#4a5568', fontWeight: activeTab === tab ? 500 : 400
          }}>
            {tab === 'overview' ? 'Города' : tab === 'alerts' ? 'Алерты' : 'Кассиры'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Риск по городам</div>
          {CITIES.map((city, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: i < CITIES.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: city.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, flex: 1 }}>{city.name}</span>
              <div style={{ flex: 2, height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${city.risk}%`, height: '100%', background: city.color, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 12, color: '#718096', minWidth: 36, textAlign: 'right' }}>{city.risk}%</span>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: city.color + '20', color: city.color, fontWeight: 500 }}>{city.level}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Последние алерты</div>
          {ALERTS.map((alert, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: i < ALERTS.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: alert.color, marginTop: 4, flexShrink: 0 }} />
              <span style={{ fontSize: 12, flex: 1, lineHeight: 1.4 }}>{alert.text}</span>
              <span style={{ fontSize: 11, color: '#718096', whiteSpace: 'nowrap' }}>{alert.time}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'cashiers' && (
        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Рейтинг риска кассиров</div>
          {CASHIERS.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px', borderRadius: 8, background: c.bg, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: c.color + '30', color: c.color, fontSize: 11, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#718096' }}>{c.branch}</div>
              </div>
              <span style={{ fontSize: 16, fontWeight: 500, color: c.color }}>{c.score}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
