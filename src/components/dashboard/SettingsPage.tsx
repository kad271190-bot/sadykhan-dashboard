'use client'
import { useState, useRef } from 'react'
import { Upload, Save, Bell, Globe, Shield, Palette, RefreshCw, Trash2, Check, Eye, EyeOff, Plus } from 'lucide-react'

const BRAND_TEAL = '#3A9EA5'
const BRAND_ORANGE = '#F5813F'

const SECTIONS = [
  { id: 'brand', label: 'Бренд и логотип', icon: Palette },
  { id: 'sources', label: 'Источники данных', icon: Globe },
  { id: 'notifications', label: 'Уведомления', icon: Bell },
  { id: 'access', label: 'Команда', icon: Shield },
  { id: 'update', label: 'Обновление данных', icon: RefreshCw },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('brand')
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [brandName, setBrandName] = useState('садыхан')
  const [subtitle, setSubtitle] = useState('Центр репутации')
  const [primaryColor, setPrimaryColor] = useState('#3A9EA5')
  const [accentColor, setAccentColor] = useState('#F5813F')
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [telegramBot, setTelegramBot] = useState('')
  const [emailAlert, setEmailAlert] = useState('')
  const [alertOnNegative, setAlertOnNegative] = useState(true)
  const [alertOnDrop, setAlertOnDrop] = useState(true)
  const [alertOnNoReply, setAlertOnNoReply] = useState(true)
  const [noReplyHours, setNoReplyHours] = useState('4')
  const [twogisEnabled, setTwogisEnabled] = useState(true)
  const [yandexEnabled, setYandexEnabled] = useState(true)
  const [googleEnabled, setGoogleEnabled] = useState(false)
  const [twogisKey, setTwogisKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [newEmail, setNewEmail] = useState('')

  const teamMembers = [
    { name: 'Администратор', email: 'admin@sadykhan.kz', role: 'Владелец' },
    { name: 'Менеджер', email: 'manager@sadykhan.kz', role: 'Менеджер' },
  ]

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    document.documentElement.style.setProperty('--accent', primaryColor)
    document.documentElement.style.setProperty('--brand-orange', accentColor)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="card p-3 h-fit">
        <div className="text-xs uppercase tracking-wider text-gray-400 font-medium px-2 mb-2">Настройки</div>
        <nav className="space-y-0.5">
          {SECTIONS.map((s) => {
            const Icon = s.icon
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors"
                style={activeSection === s.id ? { background: BRAND_TEAL, color: 'white' } : { color: '#6b7280' }}>
                <Icon className="w-4 h-4 shrink-0" />
                {s.label}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="md:col-span-3 space-y-4">

        {activeSection === 'brand' && (
          <div className="card p-5 space-y-5">
            <div className="text-sm font-medium text-gray-900">Бренд и внешний вид</div>

            <div>
              <div className="text-xs text-gray-500 mb-2 font-medium">Логотип компании</div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                  {logoPreview
                    ? <img src={logoPreview} alt="logo" className="w-full h-full object-contain p-1" />
                    : <Upload className="w-5 h-5 text-gray-300" />
                  }
                </div>
                <div>
                  <button onClick={() => fileRef.current?.click()}
                    className="text-sm font-medium px-4 py-2 rounded-lg text-white"
                    style={{ background: BRAND_TEAL }}>
                    Загрузить логотип
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  {logoPreview && (
                    <button onClick={() => setLogoPreview(null)} className="ml-2 text-xs text-red-500">Удалить</button>
                  )}
                  <div className="text-xs text-gray-400 mt-1">PNG, SVG до 2MB</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1.5 font-medium">Название компании</div>
                <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-400" />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1.5 font-medium">Подпись под логотипом</div>
                <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-400" />
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-2 font-medium">Цвета бренда</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Основной цвет</div>
                  <div className="flex items-center gap-2">
                    <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-200" />
                    <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none" />
                    <button onClick={() => setPrimaryColor('#3A9EA5')} className="text-xs text-gray-400">сброс</button>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Акцентный цвет</div>
                  <div className="flex items-center gap-2">
                    <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-200" />
                    <input type="text" value={accentColor} onChange={e => setAccentColor(e.target.value)}
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none" />
                    <button onClick={() => setAccentColor('#F5813F')} className="text-xs text-gray-400">сброс</button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-2 font-medium">Предпросмотр</div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: primaryColor }}>
                  {logoPreview ? <img src={logoPreview} alt="logo" className="w-full h-full object-contain" /> : 'С'}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: primaryColor }}>{brandName}</div>
                  <div className="text-[10px] text-gray-400">{subtitle}</div>
                </div>
                <div className="ml-auto flex gap-2">
                  <div className="w-5 h-5 rounded-full" style={{ background: primaryColor }} />
                  <div className="w-5 h-5 rounded-full" style={{ background: accentColor }} />
                </div>
              </div>
            </div>

            <button onClick={handleSave}
              className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg text-white"
              style={{ background: saved ? '#22c55e' : BRAND_TEAL }}>
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Сохранено!' : 'Сохранить изменения'}
            </button>
          </div>
        )}

        {activeSection === 'sources' && (
          <div className="card p-5 space-y-4">
            <div className="text-sm font-medium text-gray-900">Источники данных</div>
            {[
              { label: '2GIS', desc: 'Рейтинги и отзывы из 2GIS', enabled: twogisEnabled, setEnabled: setTwogisEnabled, color: '#27AE60' },
              { label: 'Яндекс Карты', desc: 'Рейтинги и отзывы из Яндекс', enabled: yandexEnabled, setEnabled: setYandexEnabled, color: '#FF3333' },
              { label: 'Google Maps', desc: 'Рейтинги из Google Maps', enabled: googleEnabled, setEnabled: setGoogleEnabled, color: '#4285F4' },
            ].map((src) => (
              <div key={src.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: src.color }}>
                  {src.label[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{src.label}</div>
                  <div className="text-xs text-gray-400">{src.desc}</div>
                </div>
                <div className="relative cursor-pointer" onClick={() => src.setEnabled(!src.enabled)}>
                  <div className="w-9 h-5 rounded-full transition-colors" style={{ background: src.enabled ? BRAND_TEAL : '#d1d5db' }} />
                  <div className="absolute w-3.5 h-3.5 bg-white rounded-full shadow transition-transform"
                    style={{ top: '3px', left: '3px', transform: src.enabled ? 'translateX(16px)' : 'translateX(0)' }} />
                </div>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs text-gray-500 mb-2 font-medium">API ключ 2GIS Business</div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input type={showKey ? 'text' : 'password'} value={twogisKey} onChange={e => setTwogisKey(e.target.value)}
                    placeholder="Вставьте API ключ..."
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 pr-9 focus:outline-none focus:border-teal-400" />
                  <button onClick={() => setShowKey(!showKey)} className="absolute right-2 top-2 text-gray-400">
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button className="text-sm font-medium px-4 py-2 rounded-lg text-white" style={{ background: BRAND_TEAL }}>Проверить</button>
              </div>
              <div className="text-xs text-gray-400 mt-1">Без ключа — данные обновляются вручную.</div>
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="card p-5 space-y-4">
            <div className="text-sm font-medium text-gray-900">Уведомления</div>
            <div>
              <div className="text-xs text-gray-500 mb-1.5 font-medium">Telegram бот</div>
              <input type="text" value={telegramBot} onChange={e => setTelegramBot(e.target.value)}
                placeholder="@sadykhan_alerts_bot"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-400" />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1.5 font-medium">Email для алертов</div>
              <input type="email" value={emailAlert} onChange={e => setEmailAlert(e.target.value)}
                placeholder="manager@sadykhan.kz"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-400" />
            </div>
            <div className="space-y-3">
              {[
                { label: 'Новый негативный отзыв', value: alertOnNegative, set: setAlertOnNegative },
                { label: 'Падение рейтинга филиала', value: alertOnDrop, set: setAlertOnDrop },
                { label: 'Отзыв без ответа более N часов', value: alertOnNoReply, set: setAlertOnNoReply },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <div className="relative cursor-pointer" onClick={() => item.set(!item.value)}>
                    <div className="w-9 h-5 rounded-full transition-colors" style={{ background: item.value ? BRAND_TEAL : '#d1d5db' }} />
                    <div className="absolute w-3.5 h-3.5 bg-white rounded-full shadow transition-transform"
                      style={{ top: '3px', left: '3px', transform: item.value ? 'translateX(16px)' : 'translateX(0)' }} />
                  </div>
                </div>
              ))}
              {alertOnNoReply && (
                <div className="flex items-center gap-3 pl-2">
                  <span className="text-sm text-gray-500">Без ответа более</span>
                  <input type="number" value={noReplyHours} onChange={e => setNoReplyHours(e.target.value)}
                    className="w-16 text-sm border border-gray-200 rounded-lg px-2 py-1 text-center focus:outline-none" />
                  <span className="text-sm text-gray-500">часов</span>
                </div>
              )}
            </div>
            <button onClick={handleSave}
              className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg text-white"
              style={{ background: saved ? '#22c55e' : BRAND_TEAL }}>
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Сохранено!' : 'Сохранить'}
            </button>
          </div>
        )}

        {activeSection === 'access' && (
          <div className="card p-5 space-y-4">
            <div className="text-sm font-medium text-gray-900">Команда и доступ</div>
            <div className="space-y-2">
              {teamMembers.map((m) => (
                <div key={m.email} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium" style={{ background: BRAND_TEAL }}>
                    {m.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{m.name}</div>
                    <div className="text-xs text-gray-400">{m.email}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={m.role === 'Владелец' ? { background: '#E8F6F7', color: BRAND_TEAL } : { background: '#f3f4f6', color: '#6b7280' }}>
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs text-gray-500 mb-2 font-medium">Пригласить сотрудника</div>
              <div className="flex gap-2">
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                  placeholder="email@sadykhan.kz"
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-400" />
                <button className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg text-white" style={{ background: BRAND_TEAL }}>
                  <Plus className="w-4 h-4" />Добавить
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'update' && (
          <div className="card p-5 space-y-4">
            <div className="text-sm font-medium text-gray-900">Обновление данных</div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div className="text-sm font-medium text-amber-800 mb-1">Текущий режим: ручное обновление</div>
              <div className="text-xs text-amber-700">Для автообновления подключите API ключ 2GIS в разделе "Источники данных".</div>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Последнее обновление', value: '29 мая 2026, 10:00' },
                { label: 'Источников активно', value: '2 (2GIS + Яндекс)' },
                { label: 'Филиалов отслеживается', value: '15' },
                { label: 'Следующее обновление', value: 'Вручную' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-medium text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg text-white w-full justify-center"
              style={{ background: BRAND_TEAL }}>
              <RefreshCw className="w-4 h-4" />Обновить данные сейчас
            </button>
            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs text-red-500 font-medium mb-3">Опасная зона</div>
              <button className="flex items-center gap-2 text-sm text-red-500 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50">
                <Trash2 className="w-4 h-4" />Очистить все данные
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
