import { Component, type ErrorInfo, type ReactNode } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

/** תופס קריסות ב-render של ילדים — לא מחליף try/catch ל-API */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary:", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger">
          <Alert.Heading>משהו השתבש</Alert.Heading>
          <p>אירעה שגיאה בלתי צפויה. אפשר לנסות שוב או לרענן את הדף.</p>
          <div className="d-flex gap-2">
            <Button variant="outline-danger" onClick={this.handleRetry}>
              נסה שוב
            </Button>
            <Button variant="danger" onClick={() => window.location.reload()}>
              רענן דף
            </Button>
          </div>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
