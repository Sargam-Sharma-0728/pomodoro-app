import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { sessions } = await req.json()

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({
        success: true,
        summary: "No sessions yet today. Start your first Pomodoro to get AI insights! 🍅"
      })
    }

    const sessionText = sessions
      .map((s: any, i: number) =>
        `Session ${i + 1}: "${s.task}" — ${s.duration_minutes} min (${s.type}) at ${new Date(s.completed_at).toLocaleTimeString()}`
      )
      .join('\n')

    const totalWork = sessions
      .filter((s: any) => s.type === 'work')
      .reduce((acc: number, s: any) => acc + s.duration_minutes, 0)

    const workCount = sessions.filter((s: any) => s.type === 'work').length

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `You are a productivity coach analyzing someone's Pomodoro timer sessions for today. Be concise, insightful, warm and a little bit motivating. Keep it under 4 sentences.

Today's sessions:
${sessionText}

Total focus time: ${totalWork} minutes across ${workCount} work sessions.

Give a brief smart productivity insight: what patterns you notice, when they were most productive, and one actionable suggestion for tomorrow. Don't use bullet points, just natural flowing text.`
      }]
    })

    const summary = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ success: true, summary })
  } catch (error) {
    console.error('AI summary error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate summary'
    }, { status: 500 })
  }
}
