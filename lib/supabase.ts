import { createClient } from '@supabase/supabase-js'

export const supabase = process.env.NEXT_PUBLIC_ENABLE_SUPABASE
  ? createClient(
      'https://vkkmuixykvprdmemevnn.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZra211aXh5a3ZwcmRtZW1ldm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNjYxNzMsImV4cCI6MjAzMzk0MjE3M30.W_obDMONlvR7ZXD9IvZZiDrEBCagZne0PVq0tJFER8k',
    )
  : undefined
