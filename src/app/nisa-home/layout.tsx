import type { Metadata } from 'next'
import { Cormorant_Garamond, Manrope, Playfair_Display } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NISA HOME — Brand Book v1.0',
  description: 'Brand platform and visual identity guidelines for NISA HOME — modern interior decor',
}

export default function NisaHomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorant.variable} ${manrope.variable} ${playfair.variable}`}>
      {children}
    </div>
  )
}
