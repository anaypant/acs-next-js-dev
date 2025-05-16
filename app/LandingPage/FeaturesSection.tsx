// Last Modified: 2025-04-14 by AI Assistant

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, Mail, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { Feature } from '../types/landing'

interface FeaturesSectionProps {
  features: Feature[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative px-8 py-20 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#ebfbf5] to-transparent opacity-70"
        style={{
          clipPath: `polygon(0 0, 100% 0, 100% ${100 - scrollY * 0.05}%, 0 100%)`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-[#003623] mb-4">
            Powerful Features for <span className="gradient-text italic">Real Estate</span> Professionals
          </h1>
          <p className="text-xl text-[#005f3d] max-w-3xl mx-auto">
            Discover how our AI-powered tools can transform your real estate business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                activeFeature === index ? "ring-2 ring-[#00ad6c]" : ""
              }`}
              onClick={() => setActiveFeature(activeFeature === index ? null : index)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {feature.icon && <div className="w-10 h-10 text-[#00ad6c]">{feature.icon}</div>}
                    <h3 className="text-2xl font-semibold text-[#003623]">{feature.title}</h3>
                  </div>
                  <button className="text-[#00ad6c]">
                    <ArrowRight
                      size={20}
                      className={`transition-transform duration-300 ${
                        activeFeature === index ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                </div>

                <p className="text-gray-700 mb-4">{feature.description}</p>
              </div>

              {feature.imageUrl && (
                <div
                  className={`transition-all duration-500 ${
                    activeFeature === index ? "max-h-80" : "max-h-0"
                  } overflow-hidden`}
                >
                  <img src={feature.imageUrl} alt={feature.title} className="w-full object-cover" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection