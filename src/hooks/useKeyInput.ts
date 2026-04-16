import { useEffect, useRef } from 'react'

/**
 * Attaches a stable keydown listener. Ignores key-repeat events.
 * The handler is always current — no need to add it to a dependency array.
 */
export function useKeyInput(handler: (key: string) => void) {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.repeat) return
      handlerRef.current(e.key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
