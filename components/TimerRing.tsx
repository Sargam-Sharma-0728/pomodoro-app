'use client'

type TimerRingProps = {
  progress: number // 0 to 1
  size?: number
  mode: 'work' | 'short_break' | 'long_break'
}

const modeColors = {
  work: '#e63946',
  short_break: '#2a9d8f',
  long_break: '#457b9d',
}

export default function TimerRing({ progress, size = 280, mode }: TimerRingProps) {
  const strokeWidth = 4
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)
  const color = modeColors[mode]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1c1c1c"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="timer-ring transition-all duration-1000 ease-linear"
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />
      </svg>
    </div>
  )
}
