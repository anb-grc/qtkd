import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — Bọc từng Block component.
 * Nếu 1 component gãy, chỉ component đó hiển thị lỗi,
 * phần còn lại của trang vẫn hoạt động bình thường.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 'var(--space-lg)',
          background: 'rgba(255, 107, 107, 0.1)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          borderRadius: 'var(--radius-md)',
          margin: 'var(--space-md) 0',
          color: 'var(--color-danger)',
          fontSize: 'var(--text-sm)',
        }}>
          <strong>[Lỗi] {this.props.fallbackTitle || 'Component lỗi'}</strong>
          <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
            {this.state.error?.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
