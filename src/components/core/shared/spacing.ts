import type React from 'react'

export interface SharedLayoutProps {
  padding?: number
  paddingHorizontal?: number
  paddingVertical?: number
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
  margin?: number
  marginHorizontal?: number
  marginVertical?: number
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  gap?: number
  width?: number | string
  height?: number | string
  flex?: number
  borderRadius?: number
  background?: string
  style?: React.CSSProperties
  className?: string
  children?: React.ReactNode
}

export function buildSpacingStyle(props: SharedLayoutProps): React.CSSProperties {
  const s: React.CSSProperties = {}
  if (props.padding !== undefined) s.padding = props.padding
  if (props.paddingHorizontal !== undefined) { s.paddingLeft = props.paddingHorizontal; s.paddingRight = props.paddingHorizontal }
  if (props.paddingVertical !== undefined) { s.paddingTop = props.paddingVertical; s.paddingBottom = props.paddingVertical }
  if (props.paddingTop !== undefined) s.paddingTop = props.paddingTop
  if (props.paddingBottom !== undefined) s.paddingBottom = props.paddingBottom
  if (props.paddingLeft !== undefined) s.paddingLeft = props.paddingLeft
  if (props.paddingRight !== undefined) s.paddingRight = props.paddingRight
  if (props.margin !== undefined) s.margin = props.margin
  if (props.marginHorizontal !== undefined) { s.marginLeft = props.marginHorizontal; s.marginRight = props.marginHorizontal }
  if (props.marginVertical !== undefined) { s.marginTop = props.marginVertical; s.marginBottom = props.marginVertical }
  if (props.marginTop !== undefined) s.marginTop = props.marginTop
  if (props.marginBottom !== undefined) s.marginBottom = props.marginBottom
  if (props.marginLeft !== undefined) s.marginLeft = props.marginLeft
  if (props.marginRight !== undefined) s.marginRight = props.marginRight
  if (props.gap !== undefined) s.gap = props.gap
  if (props.width !== undefined) s.width = props.width
  if (props.height !== undefined) s.height = props.height
  if (props.flex !== undefined) s.flex = props.flex
  if (props.borderRadius !== undefined) s.borderRadius = props.borderRadius
  if (props.background !== undefined) s.background = props.background
  return { ...s, ...props.style }
}
