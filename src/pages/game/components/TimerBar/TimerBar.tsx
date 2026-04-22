import './TimerBar.css'

import { useEffect, useRef, useState } from 'react'

interface TimerBarProps {
  duration: number
  running: boolean
  onTimeUp: () => void
}

export function TimerBar({ duration, running, onTimeUp }: TimerBarProps) {
  const [remaining, setRemaining] = useState(duration)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    if (!running) {
      return
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 0.1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          onTimeUp()
          return 0
        }
        return prev - 0.1
      })
    }, 100)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [running, onTimeUp])

  const percent = (remaining / duration) * 100
  const isLow = remaining <= duration * 0.25

  return (
    <div className="timer-bar">
      <div
        className={`timer-bar__fill ${isLow ? 'timer-bar__fill--low' : ''}`}
        style={{ width: `${percent}%` }}
      />
      <span className="timer-bar__text">{Math.ceil(remaining)}s</span>
    </div>
  )
}
