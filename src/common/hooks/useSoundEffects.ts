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

  // iOS creates AudioContext in suspended state; must await resume() from a gesture
  // before scheduling any nodes. Calling this as the first thing in a tap handler
  // satisfies the gesture requirement.
  const getCtx = useCallback(async () => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    const ctx = ctxRef.current
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }
    return ctx
  }, [])

  const playCorrect = useCallback(async () => {
    const ctx = await getCtx()
    createOscillatorSound(ctx, 523.25, 0.15, 'sine', 0.25)
    setTimeout(() => createOscillatorSound(ctx, 659.25, 0.2, 'sine', 0.25), 100)
  }, [getCtx])

  const playWrong = useCallback(async () => {
    const ctx = await getCtx()
    createOscillatorSound(ctx, 200, 0.3, 'square', 0.15)
  }, [getCtx])

  const playComplete = useCallback(async () => {
    const ctx = await getCtx()
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      setTimeout(() => createOscillatorSound(ctx, freq, 0.25, 'sine', 0.2), i * 120)
    })
  }, [getCtx])

  const playChomp = useCallback(async () => {
    const ctx = await getCtx()
    const t = ctx.currentTime
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

  const playOops = useCallback(async () => {
    const ctx = await getCtx()
    const t = ctx.currentTime
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
