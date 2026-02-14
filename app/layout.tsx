import type { Metadata, Viewport } from 'next'
import { M_PLUS_1_Code } from 'next/font/google'

import './globals.css'

const mPlus1Code = M_PLUS_1_Code({
  subsets: ['latin', 'latin-ext', 'japanese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'The World Happy News - 心があたたまるニュースだけ集めた通信',
  description: '心があたたまるニュースだけを集めた通信。世界中の温かいニュースをお届けします。',
}

export const viewport: Viewport = {
  themeColor: '#f0e8d8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body
        className={`${mPlus1Code.variable} font-mono antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
