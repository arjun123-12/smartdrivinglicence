import { useState, useEffect } from 'react';

/**
 * Hook to evaluate device performance capabilities for WebGL rendering:
 * - Detects WebGL support
 * - Adapts Device Pixel Ratio (DPR)
 * - Detects mobile/low-power profile to avoid overheating mobile GPUs
 */
export function use3DPerformance() {
  const [performanceState, setPerformanceState] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        isSupported: true,
        isMobile: false,
        dpr: 1,
        tier: 'high',
      };
    }

    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) || window.innerWidth < 768;
    const rawDpr = window.devicePixelRatio || 1;
    // Clamp DPR: Mobile max 1.25, Desktop max 1.75 to save shader bandwidth
    const clampedDpr = isMobile ? Math.min(rawDpr, 1.25) : Math.min(rawDpr, 1.75);

    // Basic WebGL verification
    let webglSupported = false;
    try {
      const canvas = document.createElement('canvas');
      webglSupported = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      webglSupported = false;
    }

    return {
      isSupported: webglSupported,
      isMobile,
      dpr: clampedDpr,
      tier: isMobile ? 'mobile' : 'high',
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const rawDpr = window.devicePixelRatio || 1;
      const clampedDpr = isMobile ? Math.min(rawDpr, 1.25) : Math.min(rawDpr, 1.75);

      setPerformanceState((prev) => ({
        ...prev,
        isMobile,
        dpr: clampedDpr,
        tier: isMobile ? 'mobile' : 'high',
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return performanceState;
}

export default use3DPerformance;
