import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeroData } from '@/types/landing';
import { ThreeJSViewer } from './ThreeJSViewer';
import { shuffleArray } from '@/lib/utils/landing';

interface HeroSectionProps {
  data: HeroData;
  className?: string;
}

/**
 * HeroSection Component
 * 
 * The main hero section of the landing page featuring:
 * - Animated title with gradient text
 * - Rotating statements
 * - Call-to-action button
 * - 3D Spline scene
 * 
 * Features:
 * - Responsive design
 * - Smooth animations
 * - Accessibility support
 * - TypeScript safety
 * 
 * @param data - Hero section data including title, description, and statements
 * @param className - Additional CSS classes
 */
export function HeroSection({ data, className }: HeroSectionProps) {
  const [shuffledStatements, setShuffledStatements] = useState<string[]>([]);
  const [currentStatement, setCurrentStatement] = useState(0);
  const [fade, setFade] = useState(true);

  // Initialize shuffled statements on mount
  useEffect(() => {
    setShuffledStatements(shuffleArray(data.rotatingStatements));
  }, [data.rotatingStatements]);

  // Rotate statements every 5 seconds
  useEffect(() => {
    if (shuffledStatements.length === 0) return;
    
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentStatement((prev) => (prev + 1) % shuffledStatements.length);
        setFade(true);
      }, 400); // fade out before changing
    }, 5000);
    
    return () => clearInterval(interval);
  }, [shuffledStatements]);

  return (
    <section className={cn(
      "relative flex items-center justify-center overflow-hidden py-8 h-full",
      className
    )}>
      {/* Enhanced Animated Gradient Background - Only for Hero Section */}
      <div 
        className="absolute inset-0 h-full w-full animate-gradient-x"
        style={{ 
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 25%, #bbf7d0 50%, #dcfce7 75%, #f0fdf4 100%)",
          backgroundSize: "400% 400%"
        }}
      />
      
      {/* Enhanced floating gradient orbs with better visibility */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float-1 bg-gradient-to-r from-green-400/30 via-emerald-500/20 to-teal-600/10"
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-float-2 bg-gradient-to-r from-emerald-500/30 via-green-400/20 to-teal-600/10"
      />
      <div 
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-2xl animate-float-3 bg-gradient-to-r from-teal-600/25 via-emerald-500/15 to-green-400/10"
      />
      
      {/* Additional subtle gradient overlays for depth */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-30 bg-gradient-to-br from-transparent via-green-500/5 to-emerald-500/5"
      />
      
      {/* Subtle mesh gradient overlay */}
      <div 
        className="absolute inset-0 w-full h-full opacity-20"
        style={{
          background: "radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(5, 150, 105, 0.1) 0%, transparent 50%)"
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Heading, CTA, and Rotating Statements */}
          <div className="space-y-8 sm:space-y-10">
            <div className="space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tighter leading-tight">
                <span className="block text-[#0e6537] mb-2">
                  {data.mainTitle.line1}
                </span>
                <motion.span 
                  className="block bg-gradient-to-r from-[#0a5a2f] via-emerald-500 to-gray-600 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                >
                  {data.mainTitle.line2}
                </motion.span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#0e6537]/90 max-w-3xl leading-relaxed">
                {data.description}
              </p>
            </div>

            {/* Rotating Statements */}
            <div className="min-h-[32px] md:min-h-[36px] lg:min-h-[40px] flex items-center">
              {shuffledStatements.length > 0 && (
                <motion.div
                  key={shuffledStatements[currentStatement]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: fade ? 1 : 0, y: fade ? 0 : -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-[#0e6537] text-base md:text-lg lg:text-xl font-medium"
                  aria-live="polite"
                >
                  {shuffledStatements[currentStatement]}
                </motion.div>
              )}
            </div>

            {/* Call-to-Action Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={data.ctaLink}
                className="group inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 bg-[#0e6537] text-white hover:bg-[#0a5a2f] rounded-xl font-medium transition-all duration-300 text-sm sm:text-base shadow-lg shadow-black/20 hover:shadow-xl transform hover:-translate-y-1 min-h-[44px] sm:min-h-[48px]"
              >
                {data.ctaText}
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Right Column: Three.js 3D Scene */}
          <div className="relative mt-8 md:mt-0">
            <div className="flex items-start gap-3">
              {/* Information Tooltip */}
              <div className="relative group flex-shrink-0 mt-3">
                <div className="relative">
                  <Info className="w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors cursor-help" />
                  
                  {/* Tooltip */}
                  <div className="absolute left-0 top-6 w-64 p-3 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    <div className="text-xs text-gray-700 space-y-2">
                      <p className="font-medium text-gray-800">3D Scene Controls:</p>
                      <ul className="space-y-1">
                        <li>• <span className="font-medium">Mouse:</span> Move to rotate particles</li>
                        <li>• <span className="font-medium">Drag:</span> ACS sign to orbit around</li>
                      </ul>
                    </div>
                    
                    {/* Tooltip arrow */}
                    <div className="absolute -top-1 left-3 w-2 h-2 bg-white/95 border-l border-t border-gray-200 transform rotate-45"></div>
                  </div>
                </div>
              </div>

              {/* Spline Container */}
              <div className="flex-1 w-full h-72 sm:h-96 md:h-[500px] lg:h-[600px] rounded-2xl shadow-2xl bg-white/10 border border-white/20 overflow-hidden">
                <ThreeJSViewer 
                  splineUrl={data.splineUrl}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 