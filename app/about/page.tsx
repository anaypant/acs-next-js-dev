/**
 * File: app/about/page.tsx
 * Purpose: About page with responsive design and MUI-style animations
 * - Fully responsive layout optimized for all screen sizes
 * - Mobile-first design approach with enhanced touch interactions
 * - Properly centered content on all screen sizes
 * - Enhanced animations and interactions
 * Author: acagliol
 * Date: 06/15/25
 * Version: 1.3.0
 */

/**
 * Page Component
 * 
 * Features:
 * - Full-screen responsive layout with mobile optimization
 * - Centered content alignment on all screen sizes
 * - Mobile-first responsive design with enhanced touch targets
 * - Optimized for large screens with proper content scaling
 * - MUI-style animations and shadows
 * - Enhanced interactivity with touch-friendly elements
 * 
 * Sections:
 * - Hero section with gradient background
 * - Introduction section
 * - Features showcase
 * - Platform features
 * - Leadership team
 * - Call-to-action
 * 
 * @returns {JSX.Element} Rendered component with responsive design and animations
 */

"use client"

import { BarChart, MessageSquare, Target, Zap, Mail, Search, Lock, Code, Smartphone, ArrowRight, Star, TrendingUp, Users, Award } from "lucide-react"
import Link from "next/link"
import Navbar from "../Navbar"
import Footer from "../Footer"
import { useState, useEffect } from "react"

interface AvatarProps {
  src?: string;
  fallback: string;
  alt: string;
}

function Avatar({ src, fallback, alt }: AvatarProps) {
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 sm:border-4 border-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-110">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0e6537]/20 to-[#157a42]/20 text-[#0e6537] text-base sm:text-lg md:text-xl font-medium">
          {fallback}
        </div>
      )}
    </div>
  )
}

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const leadershipTeam = [
    {
      name: "Anay Pant",
    },
    {
      name: "Sidarth Nuthi",
    },
    {
      name: "Alejo Cagliolo",
    },
    {
      name: "Utsav Arora",
    },
    {
      name: "Parshawn Haynes",
    },
  ]

  const features = [
    {
      title: "Lead Conversion Pipeline (LCP)",
      description: "Automate contacting and converting leads with intelligent email routing, conversation management, and conversion tracking through our comprehensive dashboard.",
      icon: <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />,
      stats: "24/7 Lead Management",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Lead Generation Workflow (LGW)",
      description: "Strategic advertising and channel management to generate new leads through Facebook Marketplace, Google PPC, and other major ad platforms.",
      icon: <Target className="h-5 w-5 sm:h-6 sm:w-6" />,
      stats: "Expanded Funnel",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "AI-Powered Automation",
      description: "Leverage artificial intelligence to automate complex business processes, identify inefficiencies, and streamline operations for small businesses.",
      icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6" />,
      stats: "Process Optimization",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Real Estate Specialization",
      description: "Industry-specific solutions designed for real estate professionals",
      icon: <BarChart className="h-5 w-5 sm:h-6 sm:w-6" />,
      stats: "Industry Focus",
      color: "from-orange-500 to-orange-600",
    },
  ]

  const platformFeatures = [
    {
      title: "AI-Powered Automation",
      description: "Automate complex business processes and identify inefficiencies using advanced artificial intelligence.",
      icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6" />,
      metric: "Streamlined Operations",
    },
    {
      title: "Cost Optimization",
      description: "Reduce operational expenses and enable strategic growth for small businesses.",
      icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />,
      metric: "Lower Costs",
    },
    {
      title: "Personalized Service",
      description: "Hands-on, long-term support tailored to each client's unique needs.",
      icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
      metric: "Client-Focused",
    },
    {
      title: "AWS Cloud Infrastructure",
      description: "Built on AWS with DynamoDB, API Gateway, Lambda, and Cognito for secure, scalable solutions.",
      icon: <Lock className="h-5 w-5 sm:h-6 sm:w-6" />,
      metric: "Enterprise-Grade",
    },
    {
      title: "Lead Conversion Pipeline (LCP)",
      description: "Automate contacting and converting leads, with dashboards, metrics, and manual controls.",
      icon: <BarChart className="h-5 w-5 sm:h-6 sm:w-6" />,
      metric: "Higher Conversions",
    },
    {
      title: "Lead Generation Workflow (LGW)",
      description: "Advertising and channel strategy to generate new leads for clients, integrated with major ad platforms.",
      icon: <Target className="h-5 w-5 sm:h-6 sm:w-6" />,
      metric: "More Leads",
    },
  ]

  const stats = [
    // { label: "Active Users", value: "50K+", icon: <Users className="h-5 w-5" /> },
    // { label: "Properties Analyzed", value: "2M+", icon: <TrendingUp className="h-5 w-5" /> },
    // { label: "Success Rate", value: "98%", icon: <Star className="h-5 w-5" /> },
    // { label: "Industry Awards", value: "15+", icon: <Award className="h-5 w-5" /> },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#0a5a2f] via-[#0e6537] to-[#157a42] py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6 md:space-y-8">
            <h1 
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tighter !text-white leading-tight [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)] transition-all duration-1000 delay-200 px-2 sm:px-4 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Revolutionizing Real Estate with AI
            </h1>
            <p 
              className={`text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4 sm:px-6 transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              At ACS, we believe in a smarter future for real estate—one powered by artificial intelligence and built by passionate people.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        {/* <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-[#0e6537] mb-3 flex justify-center">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Introduction */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className={`bg-gradient-to-r from-gray-50 to-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-xl hover:shadow-2xl border border-[#b7e2c7] hover:border-[#0e6537]/40 transition-all duration-500 transform hover:-translate-y-1 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-center">
                We are a technology-driven company dedicated to helping real estate professionals thrive in a rapidly evolving market. Our AI-powered platform equips agents, brokers, developers, and teams with the tools they need to work faster, close smarter, and connect meaningfully with clients.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 
                className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter mb-3 sm:mb-4 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                What We Do
              </h2>
              <p 
                className={`text-gray-600 max-w-3xl mx-auto text-sm sm:text-base md:text-lg transition-all duration-700 delay-200 px-4 sm:px-6 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                We deliver a comprehensive suite of intelligent tools designed to simplify and enhance the entire real estate process:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl border border-[#b7e2c7] hover:border-[#0e6537]/40 transition-all duration-500 transform hover:-translate-y-2 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 sm:mb-6 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-[#0e6537] bg-[#0e6537]/10 px-2 sm:px-3 py-1 rounded-full">
                      {feature.stats}
                    </span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-[#0e6537] transition-colors duration-300" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-6 sm:mt-8 md:mt-12 text-xs sm:text-sm md:text-base px-4 sm:px-6">
              Each feature is built with a mobile-first, responsive design philosophy, ensuring accessibility across devices and platforms.
            </p>
          </div>
        </section>

        {/* Why We're Different */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 
                className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter mb-3 sm:mb-4 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Why We&apos;re Different
              </h2>
              <p 
                className={`text-gray-600 max-w-3xl mx-auto text-sm sm:text-base md:text-lg transition-all duration-700 delay-200 px-4 sm:px-6 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                We go beyond just building software—we empower professionals to make informed decisions with confidence. Our dashboards transform complex data into clear, actionable insights. Everything is optimized for speed, security, and usability.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {platformFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className={`bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-[#0e6537] mb-3 sm:mb-4 bg-white p-2 sm:p-3 rounded-xl shadow-sm inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">{feature.description}</p>
                  <div className="text-xs font-medium text-[#0e6537] bg-[#0e6537]/10 px-2 py-1 rounded-full inline-block">
                    {feature.metric}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-6 sm:mt-8 md:mt-12 text-xs sm:text-sm md:text-base px-4 sm:px-6">
              We also support seamless integration with your existing workflow tools, providing scalable solutions for teams of all sizes.
            </p>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 
                className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter mb-3 sm:mb-4 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Our Team
              </h2>
              <p 
                className={`text-gray-600 max-w-3xl mx-auto text-sm sm:text-base md:text-lg transition-all duration-700 delay-200 px-4 sm:px-6 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Behind ACS is a group of dedicated leaders who bring together engineering talent and business acumen:
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {leadershipTeam.map((member, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl border border-[#b7e2c7] hover:border-[#0e6537]/40 transition-all duration-500 transform hover:-translate-y-2 text-center ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <Avatar src={undefined} fallback={member.name[0]} alt={member.name} />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-2 text-gray-900">{member.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#0e6537] to-[#157a42] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter !text-white mb-4 sm:mb-6 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)] transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Let&apos;s Work Together
            </h2>
            <p 
              className={`text-white/90 max-w-2xl mx-auto mb-4 sm:mb-6 text-sm sm:text-base md:text-lg transition-all duration-700 delay-200 px-4 sm:px-6 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Whether you&apos;re a solo agent, a brokerage, or a growing enterprise, ACS is here to scale with you.
            </p>
            <p 
              className={`text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base md:text-lg transition-all duration-700 delay-300 px-4 sm:px-6 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Explore the future of real estate—guided by intelligence, shaped by people.
            </p>
            <div 
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 bg-white !text-[#0e6537] hover:bg-gray-100 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base shadow-lg shadow-black/20 hover:shadow-xl transform hover:-translate-y-1 min-h-[44px] sm:min-h-[48px]"
              >
                Contact Us
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 border-2 border-white text-white hover:bg-white/10 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base backdrop-blur-sm hover:backdrop-blur-md transform hover:-translate-y-1 min-h-[44px] sm:min-h-[48px]"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

/**
 * Change Log:
 * 06/15/25 - Version 1.0.0
 * - Initial version
 * 06/15/25 - Version 1.1.0
 * - Fixed responsive design issues
 * - Added proper max-width constraints for larger screens
 * - Improved mobile-first responsive breakpoints
 * - Enhanced spacing and typography scaling
 * - Added hover effects for better interactivity
 * 06/15/25 - Version 1.2.0
 * - Added MUI-style animations and transitions
 * - Enhanced shadows and hover effects
 * - Added stats section with animated cards
 * - Improved button interactions with arrow animations
 * - Added gradient backgrounds and enhanced visual hierarchy
 * - Implemented staggered animations for better UX
 * - Added expertise tags for team members
 * - Enhanced feature cards with stats and color coding
 * 06/15/25 - Version 1.3.0
 * - Enhanced mobile responsiveness with improved spacing and typography
 * - Added touch-friendly button sizes (min-height: 44px for mobile)
 * - Optimized grid layouts for better mobile experience
 * - Improved avatar sizing across all screen sizes
 * - Enhanced icon sizing for better mobile visibility
 * - Added proper padding and margins for mobile devices
 * - Improved text scaling and readability on small screens
 * - Enhanced team grid layout for mobile (2 columns) and desktop (5 columns)
 * - Added responsive spacing throughout all sections
 */

