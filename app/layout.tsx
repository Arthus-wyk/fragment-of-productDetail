
import './globals.css'
import { QueryProvider,PostHogProvider, ThemeProvider } from './providers'
import { Toaster } from '@/components/Toasts/toaster'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { SpeedInsights } from "@vercel/speed-insights/next"
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Product Generate Fragments '
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <PostHogProvider>
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
      </PostHogProvider>
    </html>
  )
}
