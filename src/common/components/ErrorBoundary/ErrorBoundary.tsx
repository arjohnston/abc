import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100dvh',
            gap: 16,
            padding: 24,
            textAlign: 'center',
            fontFamily: 'var(--font-family)',
            color: 'var(--text)',
            background: 'var(--bg)',
          }}
        >
          <span style={{ fontSize: 48 }}>😵</span>
          <p style={{ fontSize: 18, fontWeight: 700 }}>Something went wrong</p>
          <p style={{ fontSize: 14, opacity: 0.6 }}>
            {this.state.error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8,
              padding: '10px 24px',
              borderRadius: 12,
              border: 'none',
              background: 'var(--blue)',
              color: '#fff',
              fontFamily: 'var(--font-family)',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
