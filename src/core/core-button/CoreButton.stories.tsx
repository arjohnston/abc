import type { Meta, StoryObj } from '@storybook/react-vite'

import { CoreButton } from './CoreButton'

const meta = {
  title: 'Core/CoreButton',
  component: CoreButton,
  tags: ['autodocs'],
  args: { children: 'Press me', onClick: () => {} },
} satisfies Meta<typeof CoreButton>

export default meta
type Story = StoryObj<typeof meta>

export const Base: Story = {}
export const Primary: Story = { args: { variant: 'primary', children: 'Play!' } }
export const Secondary: Story = { args: { variant: 'secondary', children: 'Cancel' } }
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    'aria-label': 'Back',
    children: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    ),
  },
}
export const Disabled: Story = { args: { variant: 'primary', disabled: true } }
export const WithPadding: Story = { args: { paddingHorizontal: 24, paddingVertical: 12 } }
