type ValueOf<T> = T[keyof T]

/**
 * Renames conflicting native HTML prop names on a component wrapper.
 * Example: RemapProps<ButtonHTMLAttributes, { htmlType: 'type' }>
 * removes 'type' from the base props and adds 'htmlType' as an optional alias.
 */
export type RemapProps<TProps, TMap extends Record<string, keyof TProps>> = Omit<
  TProps,
  ValueOf<TMap>
> & {
  [TKey in keyof TMap]?: TProps[TMap[TKey]]
}
