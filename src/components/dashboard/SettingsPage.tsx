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
  const [save
