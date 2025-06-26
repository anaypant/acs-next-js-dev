/**
 * File: app/(marketing)/landing/page.tsx
 * Purpose: Landing page using modular components and centralized functionality
 * Author: AI Agent
 * Date: 2024
 * Version: 2.0.0
 * 
 * This page has been restructured to follow the AI Agent Editing Guide:
 * - Modular component architecture
 * - Centralized data management
 * - Type-safe implementations
 * - Proper error handling
 * - Accessibility compliance
 * - Performance optimizations
 */

"use client"

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/common/Feedback/ErrorBoundary';
import { LoadingSpinner } from '@/components/common/Feedback/LoadingSpinner';
import { LandingPage } from '@/components/features/landing';

/**
 * LandingPageContainer Component
 * 
 * Wraps the landing page with error boundaries and loading states.
 * Follows the established patterns from the AI Agent Editing Guide.
 */
function LandingPageContainer() {
  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            We're having trouble loading the landing page. Please try refreshing.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#0e6537] text-white rounded-xl hover:bg-[#0a5a2f] transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    }>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <LoadingSpinner size="lg" text="Loading landing page..." />
        </div>
      }>
        <LandingPage />
      </Suspense>
    </ErrorBoundary>
  );
}

export default LandingPageContainer;

/**
 * Change Log:
 * 06/17/25 - Version 1.0.6
 * - Replaced broken @splinetool/react-spline library with spline-viewer web component
 * - Implemented dynamic script loading for spline-viewer.js
 * - Added proper loading state and error handling for 3D scene
 * - Fixed TypeScript compatibility issues with custom web components
 * - Improved performance by loading script only when needed
 * 
 * 06/17/25 - Version 1.0.5
 * - Fixed syntax errors and formatting issues
 * - Corrected escaped characters in JSX
 * - Fixed import statements
 * - Improved code organization
 * 
 * 06/17/25 - Version 1.0.4
 * - Enhanced visual appeal with refined shadows, borders, and hover effects
 * - Improved search bar styling in the Hero section
 * - Updated feature cards with more dynamic hover states
 * - Applied subtle hover effects to benefit cards
 * - Enhanced the CTA section's placeholder with an abstract background image
 * 
 * 06/15/25 - Version 1.0.3
 * - Updated features section with new solutions content
 * - Added platform features section with benefits
 * - Enhanced feature cards with new icons and descriptions
 * - Improved responsive layout for benefits grid
 * - Updated section headings and descriptions
 * 
 * 06/15/25 - Version 1.0.2
 * - Removed: -- a/app/landing/page.tsx
 * - Added: ++ b/app/landing/page.tsx
 * - Removed:               <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 sm:mb-6">
 * - Added:               <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold !text-white mb-4 sm:mb-6">
 * - Removed:               <p className="text-base sm:text-xl text-green-50 mb-6 sm:mb-8 font-semibold">
 * 
 * 06/11/25 - Version 1.0.1
 * - Enhanced mobile responsiveness
 * - Improved animation performance
 * - Optimized image loading
 * - Added comprehensive documentation
 * - Enhanced accessibility features
 * 
 * 5/25/25 - Version 1.0.0
 * - Created landing page with hero section
 * - Implemented features and benefits sections
 * - Added testimonials and CTA sections
 * - Integrated animations and responsive design
 * - Enhanced accessibility features
 * - Added performance optimizations
 * - Implemented SEO best practices
 * - Enhanced security features
 * - Added comprehensive testing strategy\
 */
