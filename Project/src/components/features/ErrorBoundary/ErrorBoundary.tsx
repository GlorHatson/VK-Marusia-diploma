import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import ErrorMessage from '../../UI/ErrorMessage/ErrorMessage';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global error caught:', error, errorInfo);
    // Здесь можно отправить ошибку на сервер для логирования
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorMessage
          title="Что-то пошло не так"
          message={this.state.error?.message || 'Попробуйте перезагрузить страницу.'}
          onRetry={() => window.location.reload()}
          retryText="Перезагрузить"
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;