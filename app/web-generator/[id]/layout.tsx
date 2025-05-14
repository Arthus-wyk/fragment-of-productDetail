'use client'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthViewType, useAuth } from '@/lib/auth'
import { useState } from 'react'
import { NavBar } from '@/components/navbar'
import { supabase } from '@/lib/utils/supabase/client'
import { AuthDialog } from '@/components/auth-dialog'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
                                     children
                                   }: Readonly<{
  children: React.ReactNode
}>) {

  const [authView, setAuthView] = useState<AuthViewType>('sign_in')
  const [isAuthDialogOpen, setAuthDialog] = useState(false)
  const { session, apiKey } = useAuth(setAuthDialog, setAuthView)

  return (
    <>


      {supabase && (
        <AuthDialog
          open={isAuthDialogOpen}
          setOpen={setAuthDialog}
          view={authView}
          supabase={supabase}
        />
      )}
      <NavBar session={session} showLogin={() => setAuthDialog(true)} />
      {children}

    </>
  )
}
