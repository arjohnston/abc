import { useCallback, useEffect, useRef } from 'react'

/**
 * Bouncing physics loop for a DOM element inside a container.
 * Moves the object at the given speed, bouncing off container walls.
 * Updates the element's position via inline style (bypasses React renders).
 *
 * @param containerRef  The bounding box reference (arena div)
 * @param objectRef     The moving element (ball/circle div)
 * @param radius        Half-size of the object in px
 * @param speed         Pixels per frame
 * @param onFrame       Optional callback called each frame with current (x, y) center
 * @param pausedRef     Optional ref — when true, position updates are skipped
 */
export function usePhysicsObject(
  containerRef: React.RefObject<HTMLElement | null>,
  objectRef: React.RefObject<HTMLElement | null>,
  radius: number,
  speed: number,
  onFrame?: (x: number, y: number) => void,
  pausedRef?: React.MutableRefObject<boolean>,
) {
  const posRef = useRef({ x: 0, y: 0 })
  const velRef = useRef({ vx: 0, vy: 0 })
  const rafRef = useRef<number>(0)

  const randomize = useCallback(() => {
    const el = containerRef.current
    if (!el) {
      return
    }
    const { width, height } = el.getBoundingClientRect()
    const angle = Math.random() * Math.PI * 2
    posRef.current = {
      x: radius + Math.random() * Math.max(0, width - radius * 2),
      y: radius + Math.random() * Math.max(0, height - radius * 2),
    }
    velRef.current = { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed }
  }, [containerRef, radius, speed])

  useEffect(() => {
    // Seed initial position
    const container = containerRef.current
    if (container) {
      const { width, height } = container.getBoundingClientRect()
      const angle = Math.random() * Math.PI * 2
      posRef.current = {
        x: radius + Math.random() * Math.max(0, width - radius * 2),
        y: radius + Math.random() * Math.max(0, height - radius * 2),
      }
      velRef.current = { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed }
    }

    function loop() {
      const container = containerRef.current
      const object = objectRef.current
      if (!container || !object) {
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      if (!pausedRef?.current) {
        const { width: w, height: h } = container.getBoundingClientRect()
        let { x, y } = posRef.current
        let { vx, vy } = velRef.current

        x += vx
        y += vy

        if (x - radius < 0) {
          x = radius
          vx = Math.abs(vx)
        }
        if (x + radius > w) {
          x = w - radius
          vx = -Math.abs(vx)
        }
        if (y - radius < 0) {
          y = radius
          vy = Math.abs(vy)
        }
        if (y + radius > h) {
          y = h - radius
          vy = -Math.abs(vy)
        }

        posRef.current = { x, y }
        velRef.current = { vx, vy }

        object.style.left = `${x - radius}px`
        object.style.top = `${y - radius}px`

        onFrame?.(x, y)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [containerRef, objectRef, radius, speed, onFrame, pausedRef])

  return { posRef, randomize }
}
