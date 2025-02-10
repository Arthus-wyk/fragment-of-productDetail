"use client";

import { createBrowserClient } from "@supabase/ssr";
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 从环境变量中获取 Supabase 的 URL 和 Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY 
// console.log('Supabase URL:', supabaseUrl);
// console.log('Supabase Key:', supabaseKey);
// 创建 Supabase 客户端实例

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_KEY ) {

    throw new Error('Missing Supabase URL or Key in environment variables');
    
}

export const supabase: SupabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY );

export function createBClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
  );
}
