import { Toaster } from '@/components/Toasts/toaster'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fragments by E2B',
  description: "Open-source version of Anthropic's Artifacts",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <main className="flex min-h-screen max-h-screen">
          <div className="grid w-full md:grid-cols-2"> */}
            {children}
            {/* </div>
        </main> */}
      </body>
    </html>
  )
}
