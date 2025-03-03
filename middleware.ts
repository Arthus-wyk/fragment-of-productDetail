import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient(
    { req, res },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log(user)
  // 如果用户未登录，重定向到根路由
  if (!user) {
    const loginUrl = new URL('/', req.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: '/web-generator/:path*',
}
