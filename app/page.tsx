'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import TimerRing from '@/components/TimerRing'
import TaskLog from '@/components/TaskLog'
import AISummary from '@/components/AISummary'
import { Session } from '@/lib/supabase'

type Mode = 'work' | 'short_break' | 'long_break'

const DURATIONS: Record<Mode, number> = {
  work: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
}

const MODE_LABELS: Record<Mode, string> = {
  work: 'Focus',
  short_break: 'Short Break',
  long_break: 'Long Break',
}

const MODE_COLORS: Record<Mode, string> = {
  work: 'text-tomato-400',
  short_break: 'text-teal-400',
  long_break: 'text-blue-400',
}

export default function Home() {
  const [mode, setMode] = useState<Mode>('work')
  const [timeLeft, setTimeLeft] = useState(DURATIONS['work'])
  const [isRunning, setIsRunning] = useState(false)
  const [task, setTask] = useState('')
  const [taskInput, setTaskInput] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [notification, setNotification] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<AudioContext | null>(null)

  // Fetch today's sessions on load
  useEffect(() => {
    fetchSessions()
  }, [])

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, mode, task])

  // Update page title with timer
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
    const secs = (timeLeft % 60).toString().padStart(2, '0')
    document.title = isRunning ? `${mins}:${secs} — ${MODE_LABELS[mode]}` : 'Pomodoro — Deep Work Timer'
  }, [timeLeft, isRunning, mode])

  async function fetchSessions() {
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`/api/sessions?date=${today}`)
      const data = await res.json()
      if (data.success) setSessions(data.data || [])
    } catch (err) {
      console.error('Failed to fetch sessions')
    } finally {
      setIsLoadingSessions(false)
    }
  }

  function playDoneSound() {
    try {
      const ctx = new AudioContext()
      const notes = [523, 659, 784]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15)
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.15 + 0.05)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.15 + 0.4)
        osc.start(ctx.currentTime + i * 0.15)
        osc.stop(ctx.currentTime + i * 0.15 + 0.5)
      })
    } catch {}
  }

  async function handleSessionComplete() {
    playDoneSound()
    setIsRunning(false)

    if (mode === 'work') {
      setPomodoroCount(prev => prev + 1)
      // Save session
      try {
        const res = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task: task || 'Untitled session',
            duration_minutes: DURATIONS[mode] / 60,
            type: mode,
          }),
        })
        const data = await res.json()
        if (data.success) {
          setSessions(prev => [data.data[0], ...prev])
          showNotification('🍅 Session complete! Great work.')
        }
      } catch {}
    } else {
      showNotification('☕ Break over! Ready to focus?')
    }
  }

  function showNotification(msg: string) {
    setNotification(msg)
    setTimeout(() => setNotification(''), 4000)
  }

  function handleStart() {
    if (mode === 'work' && !task && taskInput.trim()) {
      setTask(taskInput.trim())
    }
    if (mode === 'work' && !task && !taskInput.trim()) {
      showNotification('What are you working on? Enter a task first.')
      return
    }
    setIsRunning(true)
  }

  function handlePause() {
    setIsRunning(false)
  }

  function handleReset() {
    setIsRunning(false)
    setTimeLeft(DURATIONS[mode])
  }

  function switchMode(newMode: Mode) {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(DURATIONS[newMode])
    if (newMode === 'work') setTask('')
  }

  function handleTaskSubmit(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && taskInput.trim()) {
      setTask(taskInput.trim())
      handleStart()
    }
  }

  const progress = timeLeft / DURATIONS[mode]
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-surface-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-tomato-400 text-lg">🍅</span>
          <span className="font-mono text-sm font-semibold text-zinc-200 tracking-tight">pomodoro</span>
        </div>
        {pomodoroCount > 0 && (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.min(pomodoroCount, 8) }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-tomato-500" />
            ))}
            {pomodoroCount > 8 && (
              <span className="text-zinc-500 font-mono text-xs">+{pomodoroCount - 8}</span>
            )}
          </div>
        )}
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass rounded-lg px-4 py-2.5 text-sm font-mono text-zinc-200 animate-slide-up border border-surface-500">
          {notification}
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0 max-w-5xl mx-auto w-full px-4 py-8 lg:py-12 lg:gap-12">

        {/* LEFT: Timer */}
        <div className="flex-1 flex flex-col items-center">
          {/* Mode switcher */}
          <div className="flex gap-1 glass rounded-lg p-1 mb-10">
            {(['work', 'short_break', 'long_break'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`font-mono text-xs px-3 py-1.5 rounded-md transition-all duration-200 ${
                  mode === m
                    ? 'bg-surface-600 text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>

          {/* Timer */}
          <div className="relative flex items-center justify-center mb-8">
            <TimerRing progress={progress} size={260} mode={mode} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-mono text-5xl font-light tracking-tighter ${MODE_COLORS[mode]}`}>
                {mins}:{secs}
              </span>
              <span className="font-mono text-xs text-zinc-600 mt-2 uppercase tracking-widest">
                {MODE_LABELS[mode]}
              </span>
            </div>
          </div>

          {/* Task input (only in work mode when not running) */}
          {mode === 'work' && !task && (
            <div className="w-full max-w-sm mb-6 animate-fade-in">
              <input
                type="text"
                placeholder="What are you working on?"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={handleTaskSubmit}
                className="w-full glass rounded-lg px-4 py-3 font-sans text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-tomato-500 border border-surface-500 transition-colors bg-transparent"
              />
            </div>
          )}

          {/* Active task label */}
          {task && mode === 'work' && (
            <div className="mb-6 glass rounded-lg px-4 py-2 animate-fade-in">
              <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-0.5">Now working on</p>
              <p className="text-zinc-200 text-sm">{task}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-3">
            {!isRunning ? (
              <button onClick={handleStart} className="btn-primary px-10">
                {timeLeft === DURATIONS[mode] ? 'Start' : 'Resume'}
              </button>
            ) : (
              <button onClick={handlePause} className="btn-primary px-10">
                Pause
              </button>
            )}
            <button onClick={handleReset} className="btn-ghost">
              Reset
            </button>
          </div>

          {/* Tip */}
          {!isRunning && timeLeft === DURATIONS[mode] && mode === 'work' && (
            <p className="text-zinc-700 font-mono text-xs mt-6 text-center">
              Enter a task → press Enter or Start
            </p>
          )}
        </div>

        {/* RIGHT: Log */}
        <div className="w-full lg:w-80 mt-10 lg:mt-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Today's Log</h2>
            <span className="font-mono text-xs text-zinc-700">
              {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <TaskLog sessions={sessions} isLoading={isLoadingSessions} />
          <AISummary sessions={sessions} />
        </div>
      </main>
    </div>
  )
}
