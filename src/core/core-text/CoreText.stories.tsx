import type { Meta, StoryObj } from '@storybook/react-vite'

import { CoreText } from './CoreText'

const meta = {
  title: 'Core/CoreText',
  component: CoreText,
  tags: ['autodocs'],
  args: { children: 'The quick brown fox' },
} satisfies Meta<typeof CoreText>

export default meta
type Story = StoryObj<typeof meta>

export const H1: Story = { args: { size: 'h1' } }
export const H2: Story = { args: { size: 'h2' } }
export const H3: Story = { args: { size: 'h3' } }
export const Body: Story = { args: { size: 'body' } }
export const Small: Story = { args: { size: 'sm' } }

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(['default', 'muted', 'green', 'blue', 'purple', 'orange', 'red', 'yellow'] as const).map(
        (c) => (
          <CoreText key={c} color={c}>
            {c}
          </CoreText>
        ),
      )}
    </div>
  ),
}

export const Centered: Story = { args: { align: 'center', children: 'Centered text' } }
