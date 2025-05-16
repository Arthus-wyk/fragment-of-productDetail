import './globals.css'
import { QueryProvider, PostHogProvider, ThemeProvider } from './providers'
import { Toaster } from '@/components/Toasts/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import NotificationProvider from '@/lib/utils/notificationProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fragments by AI',
  description: 'Open-source version of Anthropic\'s Artifacts'
}
export default function RootLayout({
                                     children
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <PostHogProvider>
      <NotificationProvider>
        <body className={inter.className}>
        <SpeedInsights />
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
        <Suspense>
          <Toaster />
        </Suspense>
        </body>
      </NotificationProvider>
    </PostHogProvider>
    </html>
  )
}
