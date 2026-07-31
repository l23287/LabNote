import { Component } from "react";
import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("Unerwarteter Fehler:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="font-display text-xl font-bold">Etwas ist schiefgelaufen.</p>
          <p className="text-muted text-sm">
            Ein unerwarteter Fehler ist aufgetreten. Deine gespeicherten Protokolle sind davon
            nicht betroffen.
          </p>
          <button
            onClick={() => window.location.assign("/")}
            className="flex items-center gap-2 h-12 px-5 rounded-2xl bg-surface border border-border font-medium"
          >
            <RefreshCw size={16} /> Neu laden
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
