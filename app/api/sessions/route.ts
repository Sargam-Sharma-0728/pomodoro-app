import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { task, duration_minutes, type } = body

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('sessions')
      .insert([{
        task,
        duration_minutes,
        type,
        completed_at: new Date().toISOString(),
        date: today,
      }])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error saving session:', error)
    return NextResponse.json({ success: false, error: 'Failed to save session' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('date', date)
      .order('completed_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch sessions' }, { status: 500 })
  }
}
