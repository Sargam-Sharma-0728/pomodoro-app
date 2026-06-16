import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pomodoro — Deep Work Timer',
  description: 'Stay focused. Track your work. Get AI insights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-surface-900 text-zinc-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
