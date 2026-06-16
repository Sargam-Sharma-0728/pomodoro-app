'use client'

import { useState } from 'react'
import { Session } from '@/lib/supabase'

type AISummaryProps = {
  sessions: Session[]
}

export default function AISummary({ sessions }: AISummaryProps) {
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  async function generateSummary() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessions }),
      })
      const data = await res.json()
      if (data.success) {
        setSummary(data.summary)
        setHasGenerated(true)
      }
    } catch (err) {
      setSummary('Could not generate summary. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass rounded-xl p-5 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">✦</span>
          <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest">AI Insights</p>
        </div>
        <button
          onClick={generateSummary}
          disabled={isLoading || sessions.length === 0}
          className="font-mono text-xs text-tomato-400 hover:text-tomato-300 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : hasGenerated ? 'Refresh' : 'Analyze day →'}
        </button>
      </div>

      {isLoading && (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-surface-600 rounded w-full" />
          <div className="h-3 bg-surface-600 rounded w-5/6" />
          <div className="h-3 bg-surface-600 rounded w-4/6" />
        </div>
      )}

      {!isLoading && summary && (
        <p className="text-zinc-300 text-sm leading-relaxed font-sans animate-fade-in">
          {summary}
        </p>
      )}

      {!isLoading && !summary && (
        <p className="text-zinc-600 text-xs font-mono">
          {sessions.length === 0
            ? 'Complete sessions first to unlock AI insights.'
            : 'Click "Analyze day" to get personalized productivity insights.'}
        </p>
      )}
    </div>
  )
}
