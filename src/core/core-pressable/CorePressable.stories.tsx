import type { Meta, StoryObj } from '@storybook/react-vite'

import { CorePressable } from './CorePressable'

const meta = {
  title: 'Core/CorePressable',
  component: CorePressable,
  tags: ['autodocs'],
  args: {
    children: 'Press me',
    onClick: () => {
      alert('pressed')
    },
  },
} satisfies Meta<typeof CorePressable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithPadding: Story = {
  args: { paddingHorizontal: 24, paddingVertical: 12 },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const WithAriaLabel: Story = {
  args: { 'aria-label': 'Close dialog', children: '✕' },
}
