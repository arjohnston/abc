import { useCallback } from 'react'

export function useSpeech() {
  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.85
    utterance.pitch = 1.1
    utterance.volume = 1.0
    window.speechSynthesis.speak(utterance)
  }, [])

  return speak
}
