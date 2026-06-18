import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "motion/react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-oxblood text-white p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white/5 border border-white/10 p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-400 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif mb-4">Something went wrong</h2>
            <p className="text-white/60 text-sm mb-8">
              We encountered an unexpected error while loading this page. Please try refreshing the page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 bg-gold text-oxblood px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors"
              >
                <RefreshCw size={14} />
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-white/10 transition-colors"
              >
                <Home size={14} />
                Return Home
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}

export default ErrorBoundary;
