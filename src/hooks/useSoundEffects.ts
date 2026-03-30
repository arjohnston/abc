import { useCallback, useRef } from 'react'

function createOscillatorSound(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain: number = 0.3,
) {
  const osc = ctx.createOscillator()
  const vol = ctx.createGain()
  osc.type = type
  osc.frequency.value = frequency
  vol.gain.value = gain
  vol.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
  osc.connect(vol)
  vol.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    return ctxRef.current
  }, [])

  const playCorrect = useCallback(() => {
    const ctx = getCtx()
    createOscillatorSound(ctx, 523.25, 0.15, 'sine', 0.25)
    setTimeout(() => createOscillatorSound(ctx, 659.25, 0.2, 'sine', 0.25), 100)
  }, [getCtx])

  const playWrong = useCallback(() => {
    const ctx = getCtx()
    createOscillatorSound(ctx, 200, 0.3, 'square', 0.15)
  }, [getCtx])

  const playComplete = useCallback(() => {
    const ctx = getCtx()
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      setTimeout(() => createOscillatorSound(ctx, freq, 0.25, 'sine', 0.2), i * 120)
    })
  }, [getCtx])

  return { playCorrect, playWrong, playComplete }
}
