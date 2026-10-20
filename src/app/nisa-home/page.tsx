'use client'

import { useState, useEffect } from 'react'

const C = {
  ivory: '#F6F2EC',
  linen: '#EFE7DC',
  warmSand: '#D8C9B7',
  softClay: '#C8A98D',
  taupe: '#B6A38F',
  stoneGray: '#8A8178',
  charcoal: '#3D3D3D',
  deepBrown: '#4A3F38',
  white: '#FFFFFF',
}

const serif = `var(--font-cormorant), 'Cormorant Garamond', Georgia, serif`
const serifAlt = `var(--font-playfair), 'Playfair Display', Georgia, serif`
const sans = `var(--font-manrope), 'Manrope', system-ui, sans-serif`

/* ── LOGOS ──────────────────────────────────────────────── */
function LogoFull({ light = false, size = 1 }: { light?: boolean; size?: number }) {
  const ink = light ? C.ivory : C.charcoal
  const sub = light ? C.warmSand : C.stoneGray
  const rule = light ? '#6b6056' : C.warmSand
  return (
    <svg width={320 * size} height={80 * size} viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="160" y="36" textAnchor="middle" fontFamily={serif} fontSize="34" letterSpacing="10" fill={ink} fontWeight="300">NISA</text>
      <line x1="90" y1="48" x2="230" y2="48" stroke={rule} strokeWidth="0.6" />
      <text x="160" y="66" textAnchor="middle" fontFamily={serif} fontSize="14" letterSpacing="14" fill={sub} fontWeight="300">HOME</text>
    </svg>
  )
}

function LogoCompact({ light = false, size = 1 }: { light?: boolean; size?: number }) {
  const ink = light ? C.ivory : C.charcoal
  return (
    <svg width={160 * size} height={48 * size} viewBox="0 0 160 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="80" y="34" textAnchor="middle" fontFamily={serif} fontSize="30" letterSpacing="8" fill={ink} fontWeight="300">NISA</text>
    </svg>
  )
}

function LogoMonogram({ bg = C.charcoal, ink = C.ivory, size = 80 }: { bg?: string; ink?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" fill={bg} />
      <text x="40" y="57" textAnchor="middle" fontFamily={serif} fontSize="46" fill={ink} fontWeight="300" letterSpacing="1">N</text>
    </svg>
  )
}

/* ── NAV ─────────────────────────────────────────────────── */
const NAV = [
  { n: '01', label: 'Brand Essence', id: 'essence' },
  { n: '02', label: 'Logo System', id: 'logo' },
  { n: '03', label: 'Color Palette', id: 'colors' },
  { n: '04', label: 'Typography', id: 'type' },
  { n: '05', label: 'Visual Style', id: 'visual' },
  { n: '06', label: 'Instagram', id: 'instagram' },
  { n: '07', label: 'Taplink', id: 'taplink' },
  { n: '08', label: 'Packaging', id: 'packaging' },
  { n: '09', label: 'Tone of Voice', id: 'tone' },
  { n: '10', label: 'Deliverables', id: 'deliverables' },
]

function SideNav({ active }: { active: string }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, width: 200, height: '100vh',
      background: C.charcoal, zIndex: 50, padding: '48px 0',
      display: 'flex', flexDirection: 'column', gap: 2,
      overflowY: 'auto',
    }}>
      <div style={{ padding: '0 24px 32px', borderBottom: `1px solid rgba(255,255,255,.08)` }}>
        <LogoFull light size={0.5} />
      </div>
      {NAV.map(({ n, label, id }) => {
        const isActive = active === id
        return (
          <a key={id} href={`#${id}`} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 24px', textDecoration: 'none',
            background: isActive ? 'rgba(214,201,183,.12)' : 'transparent',
            borderRight: isActive ? `2px solid ${C.warmSand}` : '2px solid transparent',
            transition: 'all .2s',
          }}>
            <span style={{ fontFamily: sans, fontSize: 10, color: C.stoneGray, letterSpacing: 1, minWidth: 20 }}>{n}</span>
            <span style={{ fontFamily: sans, fontSize: 12, color: isActive ? C.warmSand : C.stoneGray, fontWeight: isActive ? 500 : 400, letterSpacing: .3 }}>{label}</span>
          </a>
        )
      })}
    </nav>
  )
}

/* ── SECTION WRAPPER ────────────────────────────────────── */
function Section({ id, n, title, bg, children }: { id: string; n: string; title: string; bg?: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{
      background: bg || C.ivory,
      padding: '96px 80px',
      borderTop: `1px solid ${C.warmSand}`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 20, right: 60,
        fontFamily: serif, fontSize: 140, color: 'rgba(184,163,143,.12)',
        fontWeight: 300, lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>{n}</div>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 56 }}>
          <span style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase' }}>{n}</span>
          <h2 style={{ fontFamily: serif, fontSize: 48, fontWeight: 300, color: C.charcoal, margin: 0, letterSpacing: 1 }}>{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}

/* ── 01 BRAND ESSENCE ───────────────────────────────────── */
const values = [
  { en: 'Aesthetics', ru: 'Эстетика', desc: 'Форма, пропорция, тактильность — каждый предмет создаётся как художественный объект' },
  { en: 'Individuality', ru: 'Индивидуальность', desc: '3D-технология позволяет создавать уникальные решения под конкретный интерьер и стиль' },
  { en: 'Quality', ru: 'Качество', desc: 'Ручная сборка и финальная обработка каждого изделия на всех этапах производства' },
  { en: 'Calmness', ru: 'Уют', desc: 'Предметы созданы для ощущения дома — тепла, спокойствия и гармонии в пространстве' },
  { en: 'Sustainability', ru: 'Осознанность', desc: 'Производство без лишних отходов — создаём только то, что нужно и будет любимо' },
]

function BrandEssenceSection() {
  return (
    <Section id="essence" n="01" title="Brand Essence">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        {/* Mission */}
        <div style={{ gridColumn: '1 / -1', background: C.charcoal, padding: 48, borderRadius: 2 }}>
          <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Mission</p>
          <p style={{ fontFamily: serif, fontSize: 26, color: C.ivory, fontWeight: 300, lineHeight: 1.6, margin: 0, maxWidth: 680 }}>
            NISA HOME создаёт предметы интерьера, которые превращают пространство в живую среду — тёплую, красивую и по-настоящему индивидуальную. Мы используем 3D-технологии не ради демонстрации возможностей, а ради формы, точности и эстетики.
          </p>
        </div>
        {/* Values */}
        <div style={{ gridColumn: '1 / -1' }}>
          <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>Values</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2 }}>
            {values.map((v, i) => (
              <div key={i} style={{ background: i % 2 === 0 ? C.linen : C.white, padding: '32px 24px' }}>
                <p style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, color: C.charcoal, margin: '0 0 8px' }}>{v.en}</p>
                <p style={{ fontFamily: sans, fontSize: 11, color: C.stoneGray, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 16px' }}>{v.ru}</p>
                <p style={{ fontFamily: sans, fontSize: 13, color: C.stoneGray, lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Character */}
        <div style={{ background: C.linen, padding: 40, borderRadius: 2 }}>
          <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Brand Character</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Спокойный', 'Уверенный', 'Эстетичный', 'Вдохновляющий'].map(c => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 28, height: 1, background: C.taupe }} />
                <span style={{ fontFamily: serif, fontSize: 24, fontWeight: 300, color: C.charcoal }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Slogan */}
        <div style={{ background: C.deepBrown, padding: 40, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Slogan</p>
          <p style={{ fontFamily: serif, fontSize: 28, color: C.ivory, fontWeight: 300, lineHeight: 1.55, margin: '0 0 24px', fontStyle: 'italic' }}>
            &ldquo;Мягкий свет. Чистая форма. Тихая эстетика.&rdquo;
          </p>
          <div style={{ borderTop: `1px solid rgba(214,201,183,.2)`, paddingTop: 20 }}>
            <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 2, margin: 0 }}>KEY MESSAGE</p>
            <p style={{ fontFamily: sans, fontSize: 15, color: C.warmSand, margin: '8px 0 0', fontWeight: 400 }}>«Предметы, которые делают дом теплее»</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ── 02 LOGO SYSTEM ─────────────────────────────────────── */
function LogoSystemSection() {
  const usageRules = [
    'Минимальный размер логотипа: 120px по ширине на экране / 30мм в печати',
    'Охранное поле: не менее высоты буквы «N» со всех сторон',
    'Не деформировать, не растягивать, не менять пропорции',
    'Не применять эффекты: тень, градиент, обводку, прозрачность',
    'Не размещать на пёстрых или контрастно-сложных фонах',
    'Монограмма «N» используется только как аватар и иконка приложения',
  ]
  return (
    <Section id="logo" n="02" title="Logo System" bg={C.linen}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        {/* Primary wordmark light bg */}
        <div style={{ background: C.ivory, padding: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <LogoFull light={false} size={0.9} />
          <p style={{ fontFamily: sans, fontSize: 11, color: C.stoneGray, letterSpacing: 2, margin: 0, textTransform: 'uppercase' }}>Primary — Light Background</p>
        </div>
        {/* Primary wordmark dark bg */}
        <div style={{ background: C.charcoal, padding: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <LogoFull light size={0.9} />
          <p style={{ fontFamily: sans, fontSize: 11, color: C.stoneGray, letterSpacing: 2, margin: 0, textTransform: 'uppercase' }}>Primary — Dark Background</p>
        </div>
        {/* Compact + monogram */}
        <div style={{ background: C.warmSand, padding: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <LogoCompact light={false} size={0.9} />
          <p style={{ fontFamily: sans, fontSize: 11, color: C.deepBrown, letterSpacing: 2, margin: 0, textTransform: 'uppercase' }}>Compact Version</p>
        </div>
        <div style={{ background: C.linen, padding: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <LogoMonogram bg={C.charcoal} ink={C.ivory} size={80} />
            <LogoMonogram bg={C.ivory} ink={C.charcoal} size={80} />
            <LogoMonogram bg={C.warmSand} ink={C.deepBrown} size={80} />
          </div>
          <p style={{ fontFamily: sans, fontSize: 11, color: C.stoneGray, letterSpacing: 2, margin: 0, textTransform: 'uppercase' }}>Monogram — Avatar &amp; Icon</p>
        </div>
        {/* Usage rules */}
        <div style={{ gridColumn: '1 / -1', background: C.white, padding: 40 }}>
          <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>Usage Rules</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px 32px' }}>
            {usageRules.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 18, height: 18, minWidth: 18, borderRadius: '50%', background: C.linen, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                  <span style={{ fontSize: 9, color: C.taupe, fontFamily: sans, fontWeight: 500 }}>{i + 1}</span>
                </div>
                <p style={{ fontFamily: sans, fontSize: 13, color: C.stoneGray, lineHeight: 1.6, margin: 0 }}>{r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ── 03 COLOR PALETTE ───────────────────────────────────── */
const primaryColors = [
  { name: 'Ivory', hex: '#F6F2EC', rgb: '246, 242, 236', use: 'Основной фон, фон карточек, пространство' },
  { name: 'Warm Sand', hex: '#D8C9B7', rgb: '216, 201, 183', use: 'Декоративные акценты, разделители, рамки' },
  { name: 'Taupe', hex: '#B6A38F', rgb: '182, 163, 143', use: 'Нейтральный акцент, иллюстрации, фон' },
  { name: 'Stone Gray', hex: '#8A8178', rgb: '138, 129, 120', use: 'Вторичный текст, подписи, лейблы' },
  { name: 'Charcoal', hex: '#3D3D3D', rgb: '61, 61, 61', use: 'Основной текст, логотип, кнопки CTA' },
]
const secondaryColors = [
  { name: 'Soft Clay', hex: '#C8A98D', rgb: '200, 169, 141', use: 'Тёплый акцент, иллюстрации, декор' },
  { name: 'Linen', hex: '#EFE7DC', rgb: '239, 231, 220', use: 'Фон карточек, упаковка, нежный фон' },
  { name: 'Deep Brown', hex: '#4A3F38', rgb: '74, 63, 56', use: 'Глубокий акцент, тёмный фон, детали' },
]

function Swatch({ name, hex, rgb, use, large }: { name: string; hex: string; rgb: string; use: string; large?: boolean }) {
  const isLight = ['#F6F2EC', '#EFE7DC', '#D8C9B7'].includes(hex)
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        height: large ? 140 : 100,
        background: hex,
        border: isLight ? `1px solid ${C.warmSand}` : 'none',
        marginBottom: 14,
      }} />
      <p style={{ fontFamily: serif, fontSize: 18, fontWeight: 400, color: C.charcoal, margin: '0 0 4px' }}>{name}</p>
      <p style={{ fontFamily: sans, fontSize: 12, color: C.charcoal, margin: '0 0 2px', letterSpacing: .5, fontWeight: 600 }}>{hex}</p>
      <p style={{ fontFamily: sans, fontSize: 11, color: C.stoneGray, margin: '0 0 8px' }}>RGB {rgb}</p>
      <p style={{ fontFamily: sans, fontSize: 12, color: C.stoneGray, lineHeight: 1.5, margin: 0 }}>{use}</p>
    </div>
  )
}

function ColorPaletteSection() {
  return (
    <Section id="colors" n="03" title="Color Palette">
      <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 28 }}>Primary Colors</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, marginBottom: 56 }}>
        {primaryColors.map(c => <Swatch key={c.hex} {...c} large />)}
      </div>
      <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 28 }}>Secondary Colors</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, marginBottom: 48 }}>
        {secondaryColors.map(c => <Swatch key={c.hex} {...c} />)}
      </div>
      {/* Combination example */}
      <div style={{ background: C.charcoal, padding: 40, display: 'flex', gap: 2, alignItems: 'stretch' }}>
        {[C.ivory, C.linen, C.warmSand, C.softClay, C.taupe, C.stoneGray, C.deepBrown, C.charcoal].map((hex, i) => (
          <div key={i} style={{ flex: 1, height: 56, background: hex, border: hex === C.charcoal ? `1px solid ${C.stoneGray}` : 'none' }} />
        ))}
        <div style={{ marginLeft: 32, display: 'flex', alignItems: 'center' }}>
          <p style={{ fontFamily: sans, fontSize: 12, color: C.stoneGray, margin: 0, letterSpacing: 1 }}>Full palette gradient</p>
        </div>
      </div>
    </Section>
  )
}

/* ── 04 TYPOGRAPHY ──────────────────────────────────────── */
function TypographySection() {
  return (
    <Section id="type" n="04" title="Typography" bg={C.linen}>
      {/* Heading fonts */}
      <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 32 }}>Display / Heading Fonts</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3, marginBottom: 48 }}>
        {[
          { name: 'Cormorant Garamond', font: serif, specimen: 'Form follows\nfeeling', use: 'Главные заголовки, цитаты, hero-текст', size: 48 },
          { name: 'Playfair Display', font: serifAlt, specimen: 'The art of\nhome', use: 'Подзаголовки, названия разделов, акценты', size: 44 },
          { name: 'Bodoni Moda', font: `'Bodoni Moda', ${serif}`, specimen: 'Quiet\nluxury', use: 'Специальные акценты, обложки, брендинг', size: 44 },
        ].map(({ name, font, specimen, use, size }) => (
          <div key={name} style={{ background: C.ivory, padding: '40px 32px' }}>
            <p style={{ fontFamily: sans, fontSize: 10, color: C.taupe, letterSpacing: 2, margin: '0 0 24px', textTransform: 'uppercase' }}>{name}</p>
            <p style={{ fontFamily: font, fontSize: size, fontWeight: 300, color: C.charcoal, lineHeight: 1.2, margin: '0 0 24px', whiteSpace: 'pre-line' }}>{specimen}</p>
            <p style={{ fontFamily: sans, fontSize: 12, color: C.stoneGray, margin: 0, lineHeight: 1.6 }}>{use}</p>
          </div>
        ))}
      </div>
      {/* Body fonts */}
      <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 32 }}>Body / UI Fonts</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3, marginBottom: 48 }}>
        {[
          { name: 'Manrope', font: sans, specimen: 'Создано с вниманием к деталям — для тех, кто ценит живой дом', use: 'Основной текст, описания, длинные абзацы', weight: 400 },
          { name: 'Montserrat', font: `'Montserrat', ${sans}`, specimen: 'НОВИНКИ КОЛЛЕКЦИИ · СВЕТИЛЬНИКИ · ВАЗЫ', use: 'Навигация, метки, лейблы, кнопки', weight: 500 },
          { name: 'Inter', font: `'Inter', ${sans}`, specimen: '12 500 ₸ · В наличии · 2–3 дня доставки', use: 'Цены, даты, числа, технические данные', weight: 400 },
        ].map(({ name, font, specimen, use, weight }) => (
          <div key={name} style={{ background: C.white, padding: '32px 28px' }}>
            <p style={{ fontFamily: sans, fontSize: 10, color: C.taupe, letterSpacing: 2, margin: '0 0 16px', textTransform: 'uppercase' }}>{name}</p>
            <p style={{ fontFamily: font, fontSize: 16, fontWeight: weight, color: C.charcoal, lineHeight: 1.65, margin: '0 0 20px' }}>{specimen}</p>
            <p style={{ fontFamily: sans, fontSize: 12, color: C.stoneGray, margin: 0, lineHeight: 1.6 }}>{use}</p>
          </div>
        ))}
      </div>
      {/* Usage hierarchy */}
      <div style={{ background: C.white, padding: 48 }}>
        <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 40 }}>Typography Hierarchy — Live Examples</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderLeft: `2px solid ${C.warmSand}`, paddingLeft: 32 }}>
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontFamily: sans, fontSize: 10, color: C.taupe, letterSpacing: 2, display: 'block', marginBottom: 8 }}>H1 · Cormorant Garamond · 64px · Light</span>
            <p style={{ fontFamily: serif, fontSize: 56, fontWeight: 300, color: C.charcoal, margin: 0, lineHeight: 1.1 }}>Современный декор для дома</p>
          </div>
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontFamily: sans, fontSize: 10, color: C.taupe, letterSpacing: 2, display: 'block', marginBottom: 8 }}>H2 · Playfair Display · 32px · Regular</span>
            <p style={{ fontFamily: serifAlt, fontSize: 30, fontWeight: 400, color: C.charcoal, margin: 0 }}>Свет, форма, уют</p>
          </div>
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontFamily: sans, fontSize: 10, color: C.taupe, letterSpacing: 2, display: 'block', marginBottom: 8 }}>Product Description · Manrope · 15px · Regular</span>
            <p style={{ fontFamily: sans, fontSize: 15, color: C.stoneGray, margin: 0, lineHeight: 1.7, maxWidth: 480 }}>Настольный светильник из 3D-печатных модулей с ручной сборкой. Матовая керамическая текстура, тёплый свет 2700K. Высота 38 см.</p>
          </div>
          <div style={{ marginBottom: 32, display: 'flex', gap: 40, alignItems: 'baseline' }}>
            <div>
              <span style={{ fontFamily: sans, fontSize: 10, color: C.taupe, letterSpacing: 2, display: 'block', marginBottom: 8 }}>Price · Inter · 24px · Semibold</span>
              <p style={{ fontFamily: `'Inter', ${sans}`, fontSize: 24, fontWeight: 600, color: C.charcoal, margin: 0 }}>12 500 ₸</p>
            </div>
            <div>
              <span style={{ fontFamily: sans, fontSize: 10, color: C.taupe, letterSpacing: 2, display: 'block', marginBottom: 8 }}>Button · Montserrat · 12px · Medium · Uppercase</span>
              <div style={{ background: C.charcoal, color: C.ivory, padding: '14px 32px', display: 'inline-block', fontFamily: `'Montserrat', ${sans}`, fontSize: 12, letterSpacing: 2, fontWeight: 500, textTransform: 'uppercase', cursor: 'pointer' }}>
                Заказать
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ── 05 VISUAL STYLE ────────────────────────────────────── */
function VisualStyleSection() {
  const dos = ['Натуральный свет, рассеянный или оконный', 'Тёплые тени с мягкими переходами', 'Бежевые, молочные, кремовые интерьеры', 'Натуральные материалы: дерево, лён, керамика, камень', 'Крупные планы текстуры и фактуры', 'Руки в кадре — живое, тёплое ощущение', 'Пустое пространство как элемент композиции', 'Минимум объектов в кадре — максимум воздуха']
  const donts = ['Кислотные и насыщенные цвета', 'Перегруженные, пёстрые фоны', 'Дешёвые Instagram-фильтры и пресеты', 'Яркие рекламные баннеры и оверлеи', 'Визуальный шум, коллажи, перегруженность', 'Холодный синий оттенок фотографий', 'Стоковые фото без атмосферы']

  const moodTiles = [
    { bg: `linear-gradient(145deg, ${C.linen} 0%, ${C.warmSand} 100%)`, label: 'Natural Light' },
    { bg: `linear-gradient(160deg, ${C.warmSand} 0%, ${C.softClay} 100%)`, label: 'Warm Texture' },
    { bg: `linear-gradient(135deg, ${C.ivory} 0%, ${C.linen} 100%)`, label: 'Minimal Space' },
    { bg: `linear-gradient(150deg, ${C.softClay} 0%, ${C.taupe} 100%)`, label: 'Clay & Ceramic' },
    { bg: `linear-gradient(145deg, ${C.taupe} 0%, ${C.stoneGray} 100%)`, label: 'Stone & Linen' },
    { bg: `linear-gradient(135deg, ${C.deepBrown} 0%, ${C.charcoal} 100%)`, label: 'Deep & Moody' },
  ]

  return (
    <Section id="visual" n="05" title="Visual Style">
      {/* Mood palette */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 3, marginBottom: 56 }}>
        {moodTiles.map(({ bg, label }) => (
          <div key={label} style={{ background: bg, aspectRatio: '1/1.2', display: 'flex', alignItems: 'flex-end', padding: 16 }}>
            <span style={{ fontFamily: sans, fontSize: 10, color: 'rgba(255,255,255,.7)', letterSpacing: 1 }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Do */}
        <div style={{ background: C.linen, padding: 40 }}>
          <p style={{ fontFamily: sans, fontSize: 11, color: '#6b8f71', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>✓ Do</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dos.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 4, height: 4, minWidth: 4, borderRadius: '50%', background: C.softClay, marginTop: 8 }} />
                <p style={{ fontFamily: sans, fontSize: 13, color: C.charcoal, margin: 0, lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Don't */}
        <div style={{ background: C.linen, padding: 40 }}>
          <p style={{ fontFamily: sans, fontSize: 11, color: '#9e6060', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>✕ Don&apos;t</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {donts.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 4, height: 4, minWidth: 4, borderRadius: '50%', background: C.stoneGray, marginTop: 8 }} />
                <p style={{ fontFamily: sans, fontSize: 13, color: C.stoneGray, margin: 0, lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ── 06 INSTAGRAM ───────────────────────────────────────── */
const gridPosts = [
  { bg: C.deepBrown, type: 'brand', label: 'NISA HOME' },
  { bg: `linear-gradient(155deg, ${C.linen} 30%, ${C.warmSand})`, type: 'product', shape: 'vase' },
  { bg: `linear-gradient(135deg, ${C.warmSand} 0%, ${C.softClay})`, type: 'quote', text: 'Создано\nвручную' },
  { bg: C.charcoal, type: 'product', shape: 'lamp' },
  { bg: `linear-gradient(160deg, ${C.ivory} 0%, ${C.linen})`, type: 'product', shape: 'kashpo' },
  { bg: `linear-gradient(145deg, ${C.softClay} 0%, ${C.taupe})`, type: 'lifestyle', label: 'Process' },
  { bg: `linear-gradient(130deg, ${C.taupe} 0%, ${C.stoneGray})`, type: 'quote', text: 'Мягкий\nсвет' },
  { bg: `linear-gradient(150deg, ${C.linen} 0%, ${C.warmSand})`, type: 'product', shape: 'organizer' },
  { bg: C.deepBrown, type: 'quote', text: 'Тихая\nэстетика' },
  { bg: `linear-gradient(155deg, ${C.warmSand} 0%, ${C.taupe})`, type: 'product', shape: 'vase2' },
  { bg: C.charcoal, type: 'brand', label: '3D + Ручная\nработа' },
  { bg: `linear-gradient(145deg, ${C.linen} 0%, ${C.softClay})`, type: 'product', shape: 'lamp2' },
]

function InstaPost({ post }: { post: typeof gridPosts[0] }) {
  const textColor = [C.deepBrown, C.charcoal].includes(post.bg as string) ? C.ivory : C.charcoal
  return (
    <div style={{ background: post.bg, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {post.type === 'brand' && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: serif, fontSize: 11, color: textColor, letterSpacing: 4, margin: '0 0 4px', textTransform: 'uppercase', opacity: .9, whiteSpace: 'pre-line' }}>{post.label}</p>
          {post.label === 'NISA HOME' && <div style={{ width: 24, height: 1, background: textColor === C.ivory ? C.warmSand : C.taupe, margin: '6px auto 0' }} />}
        </div>
      )}
      {post.type === 'quote' && (
        <p style={{ fontFamily: serif, fontSize: 13, color: textColor, letterSpacing: 1, textAlign: 'center', lineHeight: 1.5, margin: 0, padding: 8, whiteSpace: 'pre-line', fontStyle: 'italic', opacity: .92 }}>{post.text}</p>
      )}
      {post.type === 'product' && post.shape === 'vase' && (
        <div style={{ width: 28, height: 48, background: C.taupe, borderRadius: '50% 50% 40% 40% / 30% 30% 60% 60%', boxShadow: `4px 8px 24px rgba(0,0,0,.1)` }} />
      )}
      {post.type === 'product' && post.shape === 'vase2' && (
        <div style={{ width: 22, height: 42, background: C.softClay, borderRadius: '50% 50% 35% 35% / 25% 25% 55% 55%' }} />
      )}
      {post.type === 'product' && post.shape === 'lamp' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <div style={{ width: 2, height: 20, background: C.warmSand, opacity: .6 }} />
          <div style={{ width: 32, height: 22, background: C.warmSand, opacity: .8, borderRadius: '50% 50% 0 0 / 60% 60% 0 0' }} />
          <div style={{ width: 6, height: 12, background: C.taupe }} />
          <div style={{ width: 20, height: 3, background: C.taupe, borderRadius: 2 }} />
        </div>
      )}
      {post.type === 'product' && post.shape === 'lamp2' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 36, height: 26, background: C.deepBrown, opacity: .7, borderRadius: '50% 50% 0 0 / 60% 60% 0 0' }} />
          <div style={{ width: 4, height: 16, background: C.deepBrown, opacity: .6 }} />
          <div style={{ width: 18, height: 3, background: C.deepBrown, opacity: .6, borderRadius: 2 }} />
        </div>
      )}
      {post.type === 'product' && post.shape === 'kashpo' && (
        <div style={{ width: 32, height: 36, background: C.taupe, borderRadius: '4px 4px 8px 8px', boxShadow: `0 4px 16px rgba(0,0,0,.08)` }} />
      )}
      {post.type === 'product' && post.shape === 'organizer' && (
        <div style={{ display: 'flex', gap: 3 }}>
          {[36, 28, 44].map((h, i) => (
            <div key={i} style={{ width: 10, height: h, background: C.warmSand, borderRadius: 2, opacity: .8 }} />
          ))}
        </div>
      )}
      {post.type === 'lifestyle' && (
        <p style={{ fontFamily: sans, fontSize: 9, color: textColor, letterSpacing: 2, textTransform: 'uppercase', opacity: .7 }}>{post.label}</p>
      )}
    </div>
  )
}

const stories = ['Свет', 'Вазы', 'Кашпо', 'Процесс', 'Отзывы', 'Доставка', 'Заказ']

function InstagramSection() {
  return (
    <Section id="instagram" n="06" title="Instagram Identity" bg={C.linen}>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 56 }}>
        {/* Profile */}
        <div>
          <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>Profile</p>
          <div style={{ background: C.white, borderRadius: 12, padding: 28, boxShadow: '0 4px 32px rgba(61,61,61,.08)' }}>
            {/* Avatar + name row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
              <div style={{ borderRadius: '50%', overflow: 'hidden', border: `2px solid ${C.warmSand}` }}>
                <LogoMonogram bg={C.charcoal} ink={C.ivory} size={68} />
              </div>
              <div>
                <p style={{ fontFamily: sans, fontSize: 15, fontWeight: 600, color: '#000', margin: '0 0 2px' }}>nisa.home</p>
                <p style={{ fontFamily: sans, fontSize: 12, color: '#666', margin: 0 }}>Декор для дома</p>
              </div>
            </div>
            {/* Stats */}
            <div style={{ display: 'flex', gap: 0, borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '12px 0', marginBottom: 16 }}>
              {[{ n: '148', l: 'публикаций' }, { n: '4.2K', l: 'подписчиков' }, { n: '312', l: 'подписок' }].map(({ n, l }) => (
                <div key={l} style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontFamily: sans, fontSize: 15, fontWeight: 600, color: '#000', margin: '0 0 2px' }}>{n}</p>
                  <p style={{ fontFamily: sans, fontSize: 11, color: '#888', margin: 0 }}>{l}</p>
                </div>
              ))}
            </div>
            {/* Bio */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: sans, fontSize: 14, fontWeight: 600, color: '#000', margin: '0 0 4px' }}>NISA HOME</p>
              <p style={{ fontFamily: sans, fontSize: 13, color: '#222', margin: '0 0 2px', lineHeight: 1.5 }}>Современный декор для дома</p>
              <p style={{ fontFamily: sans, fontSize: 13, color: '#444', margin: '0 0 2px' }}>Светильники • Вазы • Кашпо</p>
              <p style={{ fontFamily: sans, fontSize: 13, color: '#444', margin: '0 0 2px' }}>Создано с помощью 3D-технологий</p>
              <p style={{ fontFamily: sans, fontSize: 13, color: '#3897f0', margin: '0 0 12px' }}>Заказ через WhatsApp ↓</p>
              <p style={{ fontFamily: sans, fontSize: 13, color: '#3897f0', margin: 0 }}>🔗 linktr.ee/nisahome</p>
            </div>
            {/* Follow button */}
            <div style={{ background: '#3897f0', color: '#fff', padding: '8px 0', textAlign: 'center', borderRadius: 8, fontFamily: sans, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Подписаться</div>
          </div>

          {/* Stories */}
          <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', margin: '36px 0 16px' }}>Stories Highlights</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {stories.map((s, i) => {
              const bgs = [C.charcoal, C.deepBrown, C.taupe, C.softClay, C.stoneGray, C.warmSand, C.deepBrown]
              return (
                <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: bgs[i % bgs.length], border: `2px solid ${C.warmSand}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: serif, fontSize: 18, color: C.ivory, fontWeight: 300 }}>{s[0]}</span>
                  </div>
                  <span style={{ fontFamily: sans, fontSize: 10, color: C.charcoal }}>{s}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Grid */}
        <div>
          <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>Feed Grid — 12 Posts Preview</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
            {gridPosts.map((post, i) => <InstaPost key={i} post={post} />)}
          </div>
          <p style={{ fontFamily: sans, fontSize: 12, color: C.stoneGray, marginTop: 16, lineHeight: 1.6 }}>
            Стиль сетки: чередование продуктовых снимков, lifestyle-кадров и текстовых плашек в едином цветовом коде. Публикации 3–5 раз в неделю.
          </p>
        </div>
      </div>
    </Section>
  )
}

/* ── 07 TAPLINK ─────────────────────────────────────────── */
const taplinks = [
  { icon: '💬', label: 'Написать в WhatsApp', type: 'cta' },
  { icon: '💡', label: 'Каталог светильников', type: 'link' },
  { icon: '🏺', label: 'Каталог ваз', type: 'link' },
  { icon: '🌿', label: 'Каталог кашпо', type: 'link' },
  { icon: '📦', label: 'Условия доставки', type: 'link' },
  { icon: '⭐', label: 'Отзывы покупателей', type: 'link' },
  { icon: '📸', label: 'Instagram', type: 'link' },
]

function TaplinkSection() {
  return (
    <Section id="taplink" n="07" title="Taplink / Link in Bio">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
        {/* Phone mockup */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative' }}>
            {/* Phone frame */}
            <div style={{
              width: 280, background: C.charcoal, borderRadius: 40,
              padding: '12px 8px', boxShadow: `0 24px 80px rgba(61,61,61,.3), inset 0 0 0 2px #5a5a5a`,
            }}>
              {/* Camera notch */}
              <div style={{ width: 80, height: 20, background: C.charcoal, borderRadius: 12, margin: '0 auto 4px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2a2a2a' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1e1e1e' }} />
              </div>
              {/* Screen */}
              <div style={{ background: C.ivory, borderRadius: 28, overflow: 'hidden', minHeight: 480 }}>
                {/* Header */}
                <div style={{ background: C.charcoal, padding: '28px 20px 24px', textAlign: 'center' }}>
                  <LogoMonogram bg={C.ivory} ink={C.charcoal} size={48} />
                  <p style={{ fontFamily: serif, fontSize: 16, color: C.ivory, letterSpacing: 3, margin: '10px 0 4px', fontWeight: 300 }}>NISA HOME</p>
                  <p style={{ fontFamily: sans, fontSize: 10, color: C.stoneGray, margin: 0, letterSpacing: 1 }}>Современный декор для дома</p>
                </div>
                {/* Links */}
                <div style={{ padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', gap: 8, background: C.ivory }}>
                  {taplinks.map(({ icon, label, type }) => (
                    <div key={label} style={{
                      background: type === 'cta' ? C.charcoal : C.white,
                      padding: '11px 16px', borderRadius: 12,
                      display: 'flex', alignItems: 'center', gap: 10,
                      border: type === 'cta' ? 'none' : `1px solid ${C.warmSand}`,
                    }}>
                      <span style={{ fontSize: 14 }}>{icon}</span>
                      <span style={{ fontFamily: sans, fontSize: 12, color: type === 'cta' ? C.ivory : C.charcoal, fontWeight: type === 'cta' ? 500 : 400 }}>{label}</span>
                    </div>
                  ))}
                  <p style={{ fontFamily: sans, fontSize: 9, color: C.taupe, textAlign: 'center', letterSpacing: 1, margin: '8px 0 0' }}>NISA HOME · 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div>
          <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 28 }}>Page Structure</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
            {taplinks.map(({ icon, label, type }, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', background: type === 'cta' ? C.charcoal : C.linen }}>
                <span style={{ fontFamily: sans, fontSize: 11, color: type === 'cta' ? C.stoneGray : C.taupe, minWidth: 20 }}>0{i + 1}</span>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontFamily: sans, fontSize: 14, color: type === 'cta' ? C.ivory : C.charcoal, fontWeight: type === 'cta' ? 500 : 400 }}>{label}</span>
                {type === 'cta' && <span style={{ fontFamily: sans, fontSize: 10, color: C.warmSand, marginLeft: 'auto', letterSpacing: 1 }}>PRIMARY CTA</span>}
              </div>
            ))}
          </div>
          <div style={{ background: C.linen, padding: 28 }}>
            <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Style Specs</p>
            {[
              ['Фон', 'Ivory #F6F2EC'],
              ['Текст', 'Charcoal #3D3D3D'],
              ['Кнопка CTA', 'Charcoal bg + Ivory text'],
              ['Кнопки links', 'White bg + Warm Sand border'],
              ['Border radius', '12px — мягкий, округлый'],
              ['Шрифт', 'Manrope, 12–14px'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.warmSand}` }}>
                <span style={{ fontFamily: sans, fontSize: 12, color: C.stoneGray }}>{k}</span>
                <span style={{ fontFamily: sans, fontSize: 12, color: C.charcoal, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ── 08 PACKAGING ───────────────────────────────────────── */
function PackagingSection() {
  return (
    <Section id="packaging" n="08" title="Packaging Identity" bg={C.linen}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 48 }}>
        {/* Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#c9b89a', padding: 24, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: `inset -4px -4px 12px rgba(0,0,0,.06)` }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: `linear-gradient(180deg, rgba(0,0,0,.04), transparent)` }} />
            <div style={{ textAlign: 'center' }}>
              <LogoMonogram bg="transparent" ink={C.deepBrown} size={48} />
            </div>
            <div style={{ position: 'absolute', bottom: 8, width: '80%', height: 1, background: 'rgba(74,63,56,.15)' }} />
          </div>
          <div>
            <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 600, color: C.charcoal, margin: '0 0 4px', letterSpacing: .5 }}>Коробка крафт/ivory</p>
            <p style={{ fontFamily: sans, fontSize: 12, color: C.stoneGray, margin: 0, lineHeight: 1.5 }}>Крафт-картон + матовая ламинация. Логотип тиснением.</p>
          </div>
        </div>

        {/* Label */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: C.ivory, padding: 20, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.warmSand}` }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <LogoFull light={false} size={0.38} />
              <div style={{ width: 48, height: .5, background: C.taupe }} />
              <p style={{ fontFamily: sans, fontSize: 7, color: C.stoneGray, letterSpacing: 1.5, margin: 0, textTransform: 'uppercase' }}>Handcrafted with care</p>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 600, color: C.charcoal, margin: '0 0 4px', letterSpacing: .5 }}>Наклейка с логотипом</p>
            <p style={{ fontFamily: sans, fontSize: 12, color: C.stoneGray, margin: 0, lineHeight: 1.5 }}>Ivory бумага, матовая. На каждую коробку.</p>
          </div>
        </div>

        {/* Thank you card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: C.charcoal, padding: 24, aspectRatio: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <LogoMonogram bg="transparent" ink={C.warmSand} size={28} />
            <div>
              <p style={{ fontFamily: serif, fontSize: 11, color: C.ivory, lineHeight: 1.7, margin: '0 0 8px', fontStyle: 'italic', fontWeight: 300 }}>
                &ldquo;Thank you for choosing NISA HOME. May this piece bring warmth, calm and beauty into your home.&rdquo;
              </p>
              <div style={{ width: 24, height: .5, background: C.warmSand }} />
            </div>
          </div>
          <div>
            <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 600, color: C.charcoal, margin: '0 0 4px', letterSpacing: .5 }}>Карточка благодарности</p>
            <p style={{ fontFamily: sans, fontSize: 12, color: C.stoneGray, margin: 0, lineHeight: 1.5 }}>Плотный картон 350г. Двусторонняя печать.</p>
          </div>
        </div>

        {/* Care card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: C.linen, padding: 20, aspectRatio: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: `1px solid ${C.warmSand}` }}>
            <p style={{ fontFamily: sans, fontSize: 8, color: C.taupe, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 10px' }}>Care Instructions</p>
            {['Протирать мягкой сухой тканью', 'Избегать прямого попадания воды', 'Не подвергать ударным нагрузкам', 'Хранить в сухом месте'].map(t => (
              <div key={t} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 5 }}>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: C.taupe, minWidth: 3 }} />
                <p style={{ fontFamily: sans, fontSize: 8, color: C.stoneGray, margin: 0 }}>{t}</p>
              </div>
            ))}
            <p style={{ fontFamily: serif, fontSize: 10, color: C.taupe, margin: '10px 0 0', letterSpacing: 1 }}>NISA HOME</p>
          </div>
          <div>
            <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 600, color: C.charcoal, margin: '0 0 4px', letterSpacing: .5 }}>Инструкция по уходу</p>
            <p style={{ fontFamily: sans, fontSize: 12, color: C.stoneGray, margin: 0, lineHeight: 1.5 }}>Вкладыш в коробку. Ivory бумага, чёрная печать.</p>
          </div>
        </div>
      </div>

      {/* Tag */}
      <div style={{ background: C.white, padding: 40, display: 'flex', gap: 40, alignItems: 'center' }}>
        <div style={{ width: 120, background: C.ivory, border: `1px solid ${C.warmSand}`, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, borderRadius: '50%', border: `1px solid ${C.taupe}`, background: C.ivory }} />
          <LogoMonogram bg={C.charcoal} ink={C.ivory} size={36} />
          <div style={{ width: '100%', height: .5, background: C.warmSand }} />
          <p style={{ fontFamily: sans, fontSize: 7, color: C.stoneGray, letterSpacing: 1.5, margin: 0, textTransform: 'uppercase', textAlign: 'center' }}>Handmade<br />with 3D technology</p>
        </div>
        <div>
          <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 600, color: C.charcoal, margin: '0 0 8px', letterSpacing: .5 }}>Бирка изделия</p>
          <p style={{ fontFamily: sans, fontSize: 13, color: C.stoneGray, margin: 0, lineHeight: 1.7 }}>
            Крепится к каждому изделию. Натуральный крафт-картон, тиснение или чёрная печать.<br />
            Верёвка из натурального льна.
          </p>
        </div>
      </div>
    </Section>
  )
}

/* ── 09 TONE OF VOICE ───────────────────────────────────── */
const phrases = [
  { type: 'do', text: '«Предметы, которые делают дом теплее»', note: 'Продуктовое описание / Hero' },
  { type: 'do', text: '«Создано для современного дома»', note: 'Слоган линейки' },
  { type: 'do', text: '«Мягкий свет. Чистая форма. Тихая эстетика.»', note: 'Главный слоган бренда' },
  { type: 'do', text: '«Декор, который не кричит, а создаёт настроение»', note: 'Описание бренда' },
  { type: 'do', text: '«Каждая деталь — решение, а не случайность»', note: 'Instagram / о бренде' },
  { type: 'do', text: '«Ваза, которая работает в любом интерьере»', note: 'Описание товара' },
  { type: 'dont', text: '«УСПЕЙ КУПИТЬ! СКИДКА 50% ТОЛЬКО СЕГОДНЯ!»', note: 'Навязчивые распродажи' },
  { type: 'dont', text: '«Лучший товар по лучшей цене в Казахстане!»', note: 'Пустые превосходные степени' },
  { type: 'dont', text: '«Не забудь поставить лайк и подписаться 🔥🔥»', note: 'Агрессивный SMM-язык' },
]

function ToneOfVoiceSection() {
  const traits = [
    { en: 'Calm', ru: 'Спокойный', desc: 'Не торопим. Не давим. Говорим так, как разговаривают с гостем в красивом пространстве.' },
    { en: 'Aesthetic', ru: 'Эстетичный', desc: 'Язык подбирается так же тщательно, как форма изделия. Каждое слово — намеренное.' },
    { en: 'Warm', ru: 'Тёплый', desc: 'Человеческий, живой. Мы говорим «ваш дом», а не «клиент» или «покупатель».' },
    { en: 'Confident', ru: 'Уверенный', desc: 'Знаем своё дело. Не извиняемся. Не задаём риторических вопросов без смысла.' },
  ]
  return (
    <Section id="tone" n="09" title="Tone of Voice">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, marginBottom: 56 }}>
        {traits.map(({ en, ru, desc }, i) => (
          <div key={en} style={{ background: i % 2 === 0 ? C.linen : C.white, padding: '32px 28px' }}>
            <p style={{ fontFamily: serif, fontSize: 28, fontWeight: 300, color: C.charcoal, margin: '0 0 4px' }}>{en}</p>
            <p style={{ fontFamily: sans, fontSize: 10, color: C.taupe, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 20px' }}>{ru}</p>
            <p style={{ fontFamily: sans, fontSize: 13, color: C.stoneGray, lineHeight: 1.7, margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <p style={{ fontFamily: sans, fontSize: 11, color: '#6b8f71', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>✓ Как говорит NISA HOME</p>
          {phrases.filter(p => p.type === 'do').map(({ text, note }) => (
            <div key={text} style={{ padding: '16px 0', borderBottom: `1px solid ${C.warmSand}` }}>
              <p style={{ fontFamily: serif, fontSize: 18, fontWeight: 400, color: C.charcoal, margin: '0 0 6px', fontStyle: 'italic' }}>{text}</p>
              <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, margin: 0, letterSpacing: .5 }}>{note}</p>
            </div>
          ))}
        </div>
        <div>
          <p style={{ fontFamily: sans, fontSize: 11, color: '#9e6060', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>✕ Так не говорит NISA HOME</p>
          {phrases.filter(p => p.type === 'dont').map(({ text, note }) => (
            <div key={text} style={{ padding: '16px 0', borderBottom: `1px solid ${C.warmSand}` }}>
              <p style={{ fontFamily: sans, fontSize: 14, color: C.stoneGray, margin: '0 0 6px', textDecoration: 'line-through' }}>{text}</p>
              <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, margin: 0, letterSpacing: .5 }}>{note}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ── 10 DELIVERABLES ────────────────────────────────────── */
const deliverables = [
  { category: 'Brand Foundation', items: ['Brand Platform v1.0', 'Mission & Values', 'Brand Character', 'Slogan & Key Messages', 'Tone of Voice Guide'] },
  { category: 'Logo & Identity', items: ['Logo Wordmark (SVG, PNG)', 'Compact Logo (SVG, PNG)', 'N Monogram (SVG, PNG)', 'Logo on Light Background', 'Logo on Dark Background', 'Logo Usage Rules'] },
  { category: 'Color & Typography', items: ['Full Color Palette (HEX, RGB)', 'Color Usage Guidelines', 'Typography System', 'Font Pairing Guide', 'Typography Hierarchy Examples'] },
  { category: 'Digital Assets', items: ['Instagram Profile Setup Guide', 'Instagram Grid Template', 'Stories Highlights Design', 'Taplink Page Template', 'Link-in-Bio Structure'] },
  { category: 'Packaging', items: ['Box Design Concept', 'Logo Sticker Layout', 'Thank You Card Design', 'Care Instruction Insert', 'Product Tag Design'] },
  { category: 'Brandbook', items: ['Web Brandbook (HTML)', 'PDF-ready Version', 'Visual Style Guide', 'Photography Guidelines', 'Do\'s & Don\'ts Reference'] },
]

function DeliverablesSection() {
  return (
    <Section id="deliverables" n="10" title="Deliverables" bg={C.charcoal}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, marginBottom: 48 }}>
        {deliverables.map(({ category, items }) => (
          <div key={category} style={{ background: 'rgba(255,255,255,.04)', padding: 32, border: `1px solid rgba(214,201,183,.1)` }}>
            <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>{category}</p>
            {items.map(item => (
              <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '7px 0', borderBottom: `1px solid rgba(214,201,183,.08)` }}>
                <div style={{ width: 5, height: 5, background: C.warmSand, borderRadius: '50%', minWidth: 5 }} />
                <p style={{ fontFamily: sans, fontSize: 13, color: C.ivory, margin: 0, fontWeight: 300 }}>{item}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <LogoFull light size={0.7} />
        <p style={{ fontFamily: serif, fontSize: 20, color: C.stoneGray, margin: '24px 0 8px', fontWeight: 300, fontStyle: 'italic' }}>Brand Platform & Visual Identity</p>
        <p style={{ fontFamily: sans, fontSize: 12, color: C.stoneGray, letterSpacing: 2 }}>VERSION 1.0 · 2025</p>
      </div>
    </Section>
  )
}

/* ── COVER ──────────────────────────────────────────────── */
function Cover() {
  return (
    <div id="cover" style={{
      background: C.charcoal,
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', padding: '64px 80px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 80% 20%, rgba(184,163,143,.06) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(200,169,141,.04) 0%, transparent 40%)`, pointerEvents: 'none' }} />
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <LogoFull light size={0.7} />
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: sans, fontSize: 11, color: C.stoneGray, margin: 0, letterSpacing: 2 }}>BRAND PLATFORM & VISUAL IDENTITY</p>
          <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, margin: '4px 0 0', letterSpacing: 2 }}>VERSION 1.0 · 2025</p>
        </div>
      </div>

      {/* Center */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 60 }}>
        <div style={{ maxWidth: 700 }}>
          <p style={{ fontFamily: sans, fontSize: 11, color: C.taupe, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 28 }}>Modern Interior Decor</p>
          <h1 style={{ fontFamily: serif, fontSize: 88, fontWeight: 300, color: C.ivory, margin: '0 0 8px', lineHeight: 1, letterSpacing: 4 }}>NISA</h1>
          <h1 style={{ fontFamily: serif, fontSize: 88, fontWeight: 300, color: C.ivory, margin: '0 0 40px', lineHeight: 1, letterSpacing: 4 }}>HOME</h1>
          <div style={{ width: 80, height: 1, background: C.warmSand, marginBottom: 32 }} />
          <p style={{ fontFamily: serif, fontSize: 22, color: C.stoneGray, fontWeight: 300, fontStyle: 'italic', margin: '0 0 16px', lineHeight: 1.6 }}>
            &ldquo;Мягкий свет. Чистая форма. Тихая эстетика.&rdquo;
          </p>
          <p style={{ fontFamily: sans, fontSize: 14, color: C.stoneGray, margin: 0, lineHeight: 1.7, maxWidth: 480 }}>
            Современный интерьерный декор. Светильники, вазы, кашпо, органайзеры — созданные с помощью 3D-печати и ручной сборки.
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 40, borderTop: `1px solid rgba(214,201,183,.15)` }}>
        <div style={{ display: 'flex', gap: 32 }}>
          {['Japandi', 'Scandinavian Minimalism', 'Soft Luxury', 'Natural Home'].map(tag => (
            <span key={tag} style={{ fontFamily: sans, fontSize: 10, color: C.stoneGray, letterSpacing: 2, textTransform: 'uppercase' }}>{tag}</span>
          ))}
        </div>
        <p style={{ fontFamily: sans, fontSize: 10, color: C.stoneGray, margin: 0, letterSpacing: 1 }}>Scroll to explore ↓</p>
      </div>
    </div>
  )
}

/* ── MAIN ───────────────────────────────────────────────── */
export default function NisaHomeBrandbook() {
  const [active, setActive] = useState('cover')

  useEffect(() => {
    const handler = () => {
      const sections = ['cover', ...NAV.map(n => n.id)]
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(id)
          break
        }
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div style={{ background: C.ivory, color: C.charcoal }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.ivory} !important; }
        #nisa-main { padding-left: 200px; }
        a { text-decoration: none; }
        @media (max-width: 1024px) {
          #nisa-sidenav { display: none; }
          #nisa-main { padding-left: 0 !important; }
          .nisa-grid-2 { grid-template-columns: 1fr !important; }
        }
        @media print {
          #nisa-sidenav { display: none; }
          #nisa-main { padding-left: 0 !important; }
          section { break-inside: avoid; }
        }
      `}</style>
      <div id="nisa-sidenav"><SideNav active={active} /></div>
      <div id="nisa-main">
        <Cover />
        <BrandEssenceSection />
        <LogoSystemSection />
        <ColorPaletteSection />
        <TypographySection />
        <VisualStyleSection />
        <InstagramSection />
        <TaplinkSection />
        <PackagingSection />
        <ToneOfVoiceSection />
        <DeliverablesSection />
      </div>
    </div>
  )
}
