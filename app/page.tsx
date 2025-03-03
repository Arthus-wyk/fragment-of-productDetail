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
  const goStart=()=>{
    if(session){
      window.location.href ="/web-generator";
    }
    else{
      setAuthDialog(true)
    }
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
      />
      <Hero goStart={goStart}/>



    </main>
  )
}