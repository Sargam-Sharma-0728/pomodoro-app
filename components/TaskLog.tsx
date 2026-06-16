'use client'

import { Session } from '@/lib/supabase'

type TaskLogProps = {
  sessions: Session[]
  isLoading: boolean
}

const typeLabel = {
  work: '🍅 Focus',
  short_break: '☕ Break',
  long_break: '🌿 Long Break',
}

const typeColor = {
  work: 'text-tomato-400',
  short_break: 'text-teal-400',
  long_break: 'text-blue-400',
}

function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function TaskLog({ sessions, isLoading }: TaskLogProps) {
  const workSessions = sessions.filter(s => s.type === 'work')
  const totalMinutes = workSessions.reduce((acc, s) => acc + s.duration_minutes, 0)
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass rounded-lg p-4 animate-pulse">
            <div className="h-3 bg-surface-600 rounded w-3/4 mb-2" />
            <div className="h-3 bg-surface-600 rounded w-1/4" />
          </div>
        ))}
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-4xl mb-3">🍅</p>
        <p className="text-zinc-400 font-mono text-sm">No sessions yet today.</p>
        <p className="text-zinc-600 font-mono text-xs mt-1">Complete a session to see your log.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Daily stats */}
      {workSessions.length > 0 && (
        <div className="glass rounded-xl p-4 flex items-center justify-between mb-4">
          <div>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Today</p>
            <p className="text-zinc-100 font-mono text-lg font-semibold mt-0.5">
              {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`} focused
            </p>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Sessions</p>
            <p className="text-tomato-400 font-mono text-lg font-semibold mt-0.5">
              {workSessions.length} 🍅
            </p>
          </div>
        </div>
      )}

      {/* Session list */}
      {sessions.map((session) => (
        <div
          key={session.id}
          className="glass rounded-lg p-4 hover:border-surface-400 transition-colors duration-200 animate-slide-up"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-zinc-200 text-sm font-sans truncate">{session.task}</p>
              <p className={`font-mono text-xs mt-1 ${typeColor[session.type]}`}>
                {typeLabel[session.type]} · {session.duration_minutes} min
              </p>
            </div>
            <p className="text-zinc-600 font-mono text-xs shrink-0 mt-0.5">
              {formatTime(session.completed_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
