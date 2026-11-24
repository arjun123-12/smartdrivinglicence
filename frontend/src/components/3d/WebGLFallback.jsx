import React, { Component } from 'react';

/**
 * WebGLFallback & ErrorBoundary
 * Catches WebGL context losses or runtime shader/loader exceptions
 * and renders an accessible high-resolution fallback image without crashing the page.
 */
export class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('WebGL Rendering Notice:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              width: '100%',
              height: '100%',
              minHeight: '350px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0d2645 0%, #07172b 100%)',
              borderRadius: '20px',
              padding: '2rem',
              color: '#ffffff',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <img
              src="/images/hero-car.jpg"
              alt="A1 Smart Driving Vehicle"
              style={{
                maxWidth: '300px',
                width: '100%',
                borderRadius: '12px',
                marginBottom: '1rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              }}
            />
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>
              Interactive 3D preview mode active
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default WebGLErrorBoundary;
