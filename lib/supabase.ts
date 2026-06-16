import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Session = {
  id: string
  task: string
  duration_minutes: number
  type: 'work' | 'short_break' | 'long_break'
  completed_at: string
  date: string
}
