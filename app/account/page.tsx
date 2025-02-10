'use client'
import EmailForm from '@/components/account/AccountForms/EmailForm';
import NameForm from '@/components/account/AccountForms/NameForm';
import { redirect } from 'next/navigation';
import {
  getUser,
  getSession
} from '@/lib/utils/supabase/queries';
import SignOutFrom from '@/components/account/AccountForms/LogoutBtn';
import AccountTitle from '@/components/account/AccountForms/AccoutTitle';
import { supabase } from '@/lib/utils/supabase/client';
import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';


export default function Account() {
  const [userSession, setUserSession] = useState<Session | null>(null)
  const [userDetails, setUserDetails] = useState<User | null>(null)

  useEffect(() => {
    getSession(supabase)
      .then((data) => {
        setUserSession(data)
      })
    getUser(supabase)
      .then((data) => {
        setUserDetails(data)
      })
  }, [])

  if (!userSession || !userDetails)
    return null
  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white p-8">
      <AccountTitle />
      <div className="p-4">
        <NameForm userName={userDetails?.user_metadata?.full_name ?? ''} />
        <EmailForm userEmail={userSession?.user?.email ?? ''} />
        <SignOutFrom />
      </div>

    </section>
  );
}
