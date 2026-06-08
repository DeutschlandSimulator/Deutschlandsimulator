import { createRoot } from "react-dom/client";
import { Component, type ReactNode, type ErrorInfo } from "react";
import App from "./App";
import "./index.css";

class RootErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[DeutschlandSimulator] Uncaught render error:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh", background: "#0d1b2a", color: "#f0f4f8",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "2rem", fontFamily: "sans-serif",
        }}>
          <h1 style={{ color: "#e05c5c", marginBottom: "1rem" }}>Fehler beim Laden</h1>
          <p style={{ color: "#8faabb", maxWidth: 480, textAlign: "center" }}>
            Die Seite konnte nicht geladen werden. Bitte laden Sie die Seite neu.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1.5rem", padding: "0.5rem 1.5rem",
              background: "#00c8b4", color: "#0d1b2a",
              border: "none", borderRadius: "0.5rem",
              cursor: "pointer", fontWeight: 600,
            }}
          >
            Neu laden
          </button>
          {import.meta.env.DEV && (
            <pre style={{
              marginTop: "1rem", padding: "1rem",
              background: "#1a2b3c", borderRadius: "0.5rem",
              fontSize: "0.75rem", color: "#e05c5c",
              maxWidth: "90vw", overflow: "auto",
            }}>
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
