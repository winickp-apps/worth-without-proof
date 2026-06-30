import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Worth Without Proof',
  description: 'Log triggers. Build evidence. Know your worth.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 min-h-screen">
        <div className="max-w-lg mx-auto min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
