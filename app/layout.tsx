import '@/app/globals.css'

import { Metadata } from 'next'

import { Header } from '@/components/header'
import { Providers } from '@/components/providers'
import Toaster from '@/components/toaster'
import { fontMono, fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

export const metadata: Metadata = {
  title: {
    default: 'ChatGitHub',
    template: `%s - ChatGitHub`
  },
  description:
    'Chat with GitHub using natural language built with OpenAI Functions and Vercel AI SDK.',
  metadataBase: new URL('https://chatgithub.vercel.app'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <Toaster />
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex flex-1 flex-col bg-muted/50">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
