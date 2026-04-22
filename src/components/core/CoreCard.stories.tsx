import type { Meta, StoryObj } from '@storybook/react-vite'

import { CoreCard } from './core-card/CoreCard'
import { CoreText } from './core-text/CoreText'

const meta = {
  title: 'Core/CoreCard',
  component: CoreCard,
  tags: ['autodocs'],
} satisfies Meta<typeof CoreCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { padding: 16, children: <CoreText>Card content</CoreText> },
}

export const WithSections: Story = {
  render: () => (
    <CoreCard>
      <CoreCard.Header padding={12}>
        <CoreText size="h3">Header</CoreText>
      </CoreCard.Header>
      <CoreCard.Body padding={16}>
        <CoreText>Body content goes here.</CoreText>
      </CoreCard.Body>
      <CoreCard.Footer padding={12}>
        <CoreText size="sm" color="muted">
          Footer
        </CoreText>
      </CoreCard.Footer>
    </CoreCard>
  ),
}
