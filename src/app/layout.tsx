import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SADYKHAN — Управление репутацией 2GIS',
  description: 'AI-оператор репутации аптечной сети SADYKHAN',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
