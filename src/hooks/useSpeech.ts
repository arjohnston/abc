import { useCallback, useEffect, useRef } from 'react'

// Known female voice name fragments, in preference order
const FEMALE_VOICE_HINTS = [
  'samantha', // macOS default female
  'google us english',
  'google uk english female',
  'zira', // Windows female
  'victoria',
  'karen',
  'moira',
  'fiona',
  'female',
]

function pickFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const en = voices.filter((v) => v.lang.startsWith('en'))
  for (const hint of FEMALE_VOICE_HINTS) {
    const match = en.find((v) => v.name.toLowerCase().includes(hint))
    if (match) return match
  }
  return en.find((v) => v.localService) || en[0]
}

export function useSpeech() {
  const voiceRef = useRef<SpeechSynthesisVoice | undefined>(undefined)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    const loadVoices = () => {
      voiceRef.current = pickFemaleVoice(speechSynthesis.getVoices())
    }
    loadVoices()
    speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const speak = useCallback((text: string) => {
    speechSynthesis.cancel()
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    // Delay after cancel so Chrome/Safari don't swallow the utterance
    timeoutRef.current = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.78
      utterance.pitch = 1.2
      utterance.volume = 1.0
      if (voiceRef.current) {
        utterance.voice = voiceRef.current
      }
      speechSynthesis.speak(utterance)
    }, 50)
  }, [])

  return speak
}
