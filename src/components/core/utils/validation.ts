/**
 * Warns in development when mutually exclusive props are used together,
 * or when a dependent prop is missing its required companion.
 * Each group is a set of prop names that should not all be defined simultaneously.
 * Strips to a no-op in production.
 */
export function warnMutuallyExclusive(
  componentName: string,
  props: Record<string, unknown>,
  ...groups: string[][]
): void {
  if (!import.meta.env.DEV) {
    return
  }
  for (const group of groups) {
    const defined = group.filter((k) => props[k] !== undefined)
    if (defined.length > 1) {
      console.warn(
        `[${componentName}] Props "${defined.join('" and "')}" are mutually exclusive. Only one should be set at a time.`,
      )
    }
  }
}
