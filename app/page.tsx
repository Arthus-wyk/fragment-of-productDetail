'use client'

import { AuthDialog } from '@/components/auth-dialog'
import Hero from '@/components/hero'
import { NavBar } from '@/components/navbar'
import { AuthViewType, useAuth } from '@/lib/auth'
import { supabase } from '@/lib/utils/supabase/client'
import { usePostHog } from 'posthog-js/react'
import { useState } from 'react'

export default function Home() {
  const posthog = usePostHog()

  const [isAuthDialogOpen, setAuthDialog] = useState(false)
  const [authView, setAuthView] = useState<AuthViewType>('sign_in')
  const { session } = useAuth(setAuthDialog, setAuthView)

  function logout() {
    supabase
      ? supabase.auth.signOut()
      : console.warn('Supabase is not initialized')
  }



  function handleSocialClick(target: 'github' | 'x' | 'discord') {
    if (target === 'github') {
      window.open('https://github.com/Arthus-wyk/fragment-of-productDetail', '_blank')
    }

    posthog.capture(`${target}_click`)
  }



  function GoToAccount() {
    console.log('1')
    window.open('/account', '_self')
  }
  return (
    <main className=" min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600">
      {supabase && (
        <AuthDialog
          open={isAuthDialogOpen}
          setOpen={setAuthDialog}
          view={authView}
          supabase={supabase}
        />
      )}


      <NavBar
        session={session}
        showLogin={() => setAuthDialog(true)}
        signOut={logout}
        onSocialClick={handleSocialClick}
        onGoToAccount={GoToAccount}
      />
      <Hero />



    </main>
  )
}