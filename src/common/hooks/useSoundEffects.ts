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

  const playChomp = useCallback(() => {
    const ctx = getCtx()
    const t = ctx.currentTime
    // Body sweep: sawtooth crunch down
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(520, t)
    osc.frequency.exponentialRampToValueAtTime(130, t + 0.11)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.55, t)
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.13)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.13)
    // Click bite accent
    const osc2 = ctx.createOscillator()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(900, t)
    osc2.frequency.exponentialRampToValueAtTime(220, t + 0.05)
    const gain2 = ctx.createGain()
    gain2.gain.setValueAtTime(0.35, t)
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.05)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(t)
    osc2.stop(t + 0.05)
  }, [getCtx])

  const playOops = useCallback(() => {
    const ctx = getCtx()
    const t = ctx.currentTime
    // Boing: pitch swoops up then falls
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(190, t)
    osc.frequency.exponentialRampToValueAtTime(520, t + 0.09)
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.38)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.3, t)
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.42)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.42)
  }, [getCtx])

  return { playCorrect, playWrong, playComplete, playChomp, playOops }
}
