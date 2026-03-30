import { useCallback, useEffect, useRef } from 'react'

export function useSpeech() {
  const voiceRef = useRef<SpeechSynthesisVoice | undefined>(undefined)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      voiceRef.current =
        voices.find((v) => v.lang.startsWith('en') && v.localService) ||
        voices.find((v) => v.lang.startsWith('en'))
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
    // Small delay after cancel to avoid Chrome swallowing the utterance
    timeoutRef.current = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.85
      utterance.pitch = 1.1
      utterance.volume = 1.0
      if (voiceRef.current) {
        utterance.voice = voiceRef.current
      }
      speechSynthesis.speak(utterance)
    }, 50)
  }, [])

  return speak
}
