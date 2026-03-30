import { useCallback, useEffect, useRef } from 'react'

export function useSpeech() {
  const voiceRef = useRef<SpeechSynthesisVoice | undefined>(undefined)

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      voiceRef.current =
        voices.find((v) => v.lang.startsWith('en') && v.localService) ||
        voices.find((v) => v.lang.startsWith('en'))
    }
    loadVoices()
    speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [])

  const speak = useCallback((text: string) => {
    // Only cancel if something is currently speaking to avoid Chrome bug
    // where cancel() + speak() in quick succession silently drops the utterance
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel()
    }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.85
    utterance.pitch = 1.1
    utterance.volume = 1.0
    if (voiceRef.current) {
      utterance.voice = voiceRef.current
    }
    speechSynthesis.speak(utterance)
  }, [])

  return speak
}
