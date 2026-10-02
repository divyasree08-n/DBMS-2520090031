import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Caught error in React ErrorBoundary:", error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '2rem auto', background: '#fff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Application Error Encountered</h2>
          <pre style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', color: '#991b1b', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
          </pre>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '0.6rem 1.2rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              Reload Page
            </button>
            <button
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              style={{ padding: '0.6rem 1.2rem', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              Clear Storage &amp; Reset
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
