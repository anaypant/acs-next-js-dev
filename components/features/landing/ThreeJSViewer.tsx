import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// Type declaration for Spline
declare global {
  interface Window {
    SPLINE?: any;
  }
}

interface ThreeJSViewerProps {
  splineUrl?: string;
  className?: string;
}

/**
 * Simple ThreeJSViewer Component
 * 
 * A simplified component for displaying Spline 3D scenes.
 * 
 * @param splineUrl - The URL of the Spline scene to display
 * @param className - Additional CSS classes for the container
 */
export function ThreeJSViewer({ splineUrl, className }: ThreeJSViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!splineUrl || !containerRef.current) return;

    const loadSplineScene = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Spline script if not already loaded
        if (!window.SPLINE) {
          const script = document.createElement('script');
          // Use the latest version to avoid compatibility warnings
          script.src = 'https://unpkg.com/@splinetool/viewer@latest/build/spline-viewer.js';
          script.type = 'module';
          script.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Spline script'));
            document.head.appendChild(script);
          });
        }

        // Wait for custom element to be registered
        let attempts = 0;
        while (!customElements.get('spline-viewer') && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!customElements.get('spline-viewer')) {
          throw new Error('Spline viewer not available');
        }

        // Create and configure the spline-viewer element
        const splineViewer = document.createElement('spline-viewer');
        splineViewer.setAttribute('url', splineUrl);
        splineViewer.style.width = '100%';
        splineViewer.style.height = '100%';
        splineViewer.style.borderRadius = '16px';

        // Add event listeners
        splineViewer.addEventListener('load', () => {
          setIsLoading(false);
          setError(null);
        });

        splineViewer.addEventListener('error', () => {
          setError('Failed to load 3D scene');
          setIsLoading(false);
        });

        // Clear container and append the viewer
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(splineViewer);
        }

      } catch (err) {
        console.error('Error loading Spline scene:', err);
        setError('Failed to load 3D scene');
        setIsLoading(false);
      }
    };

    loadSplineScene();
  }, [splineUrl]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full min-h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl",
        className
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-[#0e6537] rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Loading 3D Scene...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-red-600 text-sm mb-2">3D Scene Unavailable</p>
            <p className="text-gray-500 text-xs">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}