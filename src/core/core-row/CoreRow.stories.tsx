import type { Meta, StoryObj } from '@storybook/react-vite'

import { CoreText } from '../core-text/CoreText'
import { CoreRow } from './CoreRow'

const Box = ({ label }: { label: string }) => (
  <div
    style={{
      padding: '8px 16px',
      background: 'var(--bg-card)',
      border: '2px solid var(--blue)',
      borderRadius: 8,
    }}
  >
    <CoreText size="sm">{label}</CoreText>
  </div>
)

const meta = {
  title: 'Core/CoreRow',
  component: CoreRow,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <Box label="A" />
        <Box label="B" />
        <Box label="C" />
      </>
    ),
    gap: 8,
  },
} satisfies Meta<typeof CoreRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Centered: Story = { args: { justify: 'center' } }
export const SpaceBetween: Story = { args: { justify: 'space-between' } }
export const Wrapped: Story = {
  args: {
    wrap: true,
    children: Array.from({ length: 8 }, (_, i) => <Box key={i} label={`Item ${i + 1}`} />),
  },
}
