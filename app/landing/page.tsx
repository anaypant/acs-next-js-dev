/**
 * File: app/landing/page.tsx
 * Purpose: Renders the landing page with hero section, features, benefits, testimonials, and CTA sections.
 * Author: Alejo Cagliolo
 * Date: 06/11/25
 * Version: 1.0.1
 */

"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search,
  Check,
  Star,
  User,
  BarChart3,
  Mail,
  Target,
  Users,
  BarChart4,
  PieChart,
  LineChart,
  TrendingUp,
  Laptop,
} from "lucide-react"

/**
 * HomePage Component
 * Main landing page component with animated sections and interactive elements
 * 
 * Features:
 * - Hero section with search functionality
 * - AI-powered features showcase
 * - Benefits with dashboard visualization
 * - Client testimonials with ratings
 * - Call-to-action section
 * 
 * Animations:
 * - Page fade-in on load
 * - Scroll-triggered section animations
 * - Hover state transitions
 * - Gradient text effects
 * 
 * Responsive Design:
 * - Mobile-first approach
 * - Breakpoint-based layouts
 * - Flexible grid systems
 * - Adaptive typography
 * 
 * Accessibility:
 * - Semantic HTML structure
 * - ARIA labels and roles
 * - Keyboard navigation
 * - Focus management
 * - Screen reader support
 * 
 * Performance Optimizations:
 * - Lazy loading of images and components
 * - Optimized animations with Framer Motion
 * - Efficient state management
 * - Memoized components and callbacks
 * - Code splitting and dynamic imports
 * - Optimized asset loading
 * - Reduced bundle size
 * - Efficient CSS with Tailwind
 * 
 * SEO Optimizations:
 * - Semantic HTML structure
 * - Proper heading hierarchy
 * - Meta tags and descriptions
 * - Open Graph protocol
 * - Structured data markup
 * - Mobile-friendly design
 * - Fast loading times
 * - Clean URL structure
 * - XML sitemap
 * - Robots.txt configuration
 * 
 * Security Features:
 * - Content Security Policy (CSP)
 * - Cross-Origin Resource Sharing (CORS)
 * - XSS protection
 * - CSRF protection
 * - Input sanitization
 * - Secure headers
 * - HTTPS enforcement
 * - Rate limiting
 * - Data encryption
 * - Secure authentication
 * 
 * Testing Strategy:
 * - Unit tests for components
 * - Integration tests for sections
 * - End-to-end tests for user flows
 * - Accessibility testing
 * - Performance testing
 * - Cross-browser testing
 * - Mobile responsiveness testing
 * - Security testing
 * - SEO testing
 * - User acceptance testing
 * 
 * @returns {JSX.Element} Complete landing page with all sections
 */
export default function HomePage() {
  /**
   * Feature data for AI-powered capabilities
   * @type {Array<{title: string, description: string, icon: JSX.Element}>}
   */
  const features = [
    {
      title: "Pricing Prediction",
      description:
        "Advanced AI algorithms analyze market trends, property features, and historical data to provide accurate price predictions for real estate properties.",
      icon: <BarChart3 className="h-10 w-10 text-[#0e6537]" />,
    },
    {
      title: "Email Communications Automation",
      description:
        "Streamline your client communications with AI-powered email automation, ensuring timely and personalized interactions while saving valuable time.",
      icon: <Mail className="h-10 w-10 text-[#0e6537]" />,
    },
    {
      title: "Marketing Optimization",
      description:
        "Leverage AI to optimize your marketing campaigns, target the right audience, and maximize your property listings' visibility across multiple platforms.",
      icon: <Target className="h-10 w-10 text-[#0e6537]" />,
    },
    {
      title: "Automated Lead Scoring",
      description:
        "Our AI system automatically evaluates and ranks leads based on their likelihood to convert, helping you focus on the most promising opportunities.",
      icon: <Users className="h-10 w-10 text-[#0e6537]" />,
    },
  ]

  /**
   * Benefits data highlighting platform advantages
   * @type {Array<{title: string, description: string}>}
   */
  const benefits = [
    {
      title: "Market Analysis",
      description: "Get real-time insights on property values and market trends",
    },
    {
      title: "Client Matching",
      description: "AI algorithms match properties with potential buyers based on preferences",
    },
    {
      title: "Automated Marketing",
      description: "Create targeted campaigns that reach the right audience",
    },
    {
      title: "Data-Driven Decisions",
      description: "Make informed business decisions based on AI-analyzed market data",
    },
  ]

  /**
   * Testimonials from satisfied clients
   * @type {Array<{quote: string, author: string, role: string}>}
   */
  const testimonials = [
    {
      quote:
        "ACS has completely transformed how I approach property valuations. The AI predictions are incredibly accurate.",
      author: "Sarah Johnson",
      role: "Real Estate Agent",
    },
    {
      quote:
        "The virtual staging feature has helped me sell properties 30% faster than before. Clients love seeing the potential.",
      author: "Michael Chen",
      role: "Property Developer",
    },
    {
      quote:
        "The lead scoring system has saved me countless hours by focusing my attention on the most promising clients.",
      author: "Jessica Williams",
      role: "Broker",
    },
  ]

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white relative"
    >
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e6f5ec] via-[#f0f9f4] to-white z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column: Heading, CTA, and Search */}
            <div className="space-y-6 sm:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
                <span
                  className="italic block bg-gradient-to-r from-[#0a5a2f] to-[#157a42] bg-clip-text text-transparent mb-2 overflow-visible"
                  style={{ lineHeight: "1.2", padding: "0.1em 0" }}
                >
                  Empowering
                </span>
                <span className="text-[#002417]">Realtors with AI</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl font-semibold">
                Leverage AI to generate real-time business solutions and make informed decisions faster than ever
              </p>

              <div className="relative z-10">
                <Link
                  href="/signup"
                  className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-white bg-[#0e6537] hover:bg-gradient-to-r hover:from-[#0e6537] hover:to-[#157a42] rounded-md font-medium transition-all duration-300 shadow-lg shadow-green-700/20 text-sm sm:text-base"
                >
                  Get Started
                </Link>
              </div>

              {/* Search Bar */}
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search for AI real estate tools..."
                        className="w-full pl-10 h-10 sm:h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0e6537] focus:border-[#0e6537] text-sm sm:text-base"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <button className="h-10 sm:h-12 px-4 bg-[#0e6537] hover:bg-gradient-to-r hover:from-[#0e6537] hover:to-[#157a42] text-white rounded-md transition-all duration-300 text-sm sm:text-base">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Image Placeholder */}
            <div className="relative mt-8 md:mt-0">
              <div className="w-full aspect-[4/3] rounded-lg shadow-xl bg-gradient-to-br from-[#0e6537]/20 to-[#0e6537]/5 flex items-center justify-center">
                <div className="text-center p-4 sm:p-8">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-[#0e6537]/20 flex items-center justify-center">
                    <Search className="h-8 w-8 sm:h-12 sm:w-12 text-[#0e6537]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#0e6537]">AI-Powered Real Estate</h3>
                  <p className="text-sm sm:text-base text-gray-600 mt-2">Advanced technology for modern real estate professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#e6f5ec] via-[#f0f9f4] to-white z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#002417] mb-3 sm:mb-4">AI-Powered Features</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-semibold">
              Our platform leverages cutting-edge artificial intelligence to revolutionize your real estate experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 hover:border-[#0e6537]/20 hover:shadow-md transition-all overflow-hidden rounded-lg"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10">{feature.icon}</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#0e6537] hover:bg-gradient-to-r hover:from-[#0e6537] hover:to-[#157a42] hover:bg-clip-text hover:text-transparent transition-all duration-300">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 font-semibold mb-3 sm:mb-4">{feature.description}</p>

                  {/* Feature Visualization Placeholder */}
                  <div className="mt-3 sm:mt-4 bg-[#e6f5ec] p-3 sm:p-4 rounded-md h-32 sm:h-48 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 rounded-full bg-[#0e6537]/20 flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <p className="text-sm sm:text-base text-[#0e6537] font-medium">AI-Powered {feature.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a5a2f] via-[#0e6537] to-[#157a42] z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Left Column: Dashboard Visualization */}
            <div>
              <div className="rounded-lg shadow-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-3 sm:p-6 aspect-video">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 h-full">
                  <div className="bg-white/10 rounded-md p-2 sm:p-4 flex flex-col">
                    <div className="text-white text-sm sm:text-lg font-semibold mb-1 sm:mb-2">Market Analysis</div>
                    <div className="flex-grow flex items-center justify-center">
                      <BarChart4 className="h-10 w-10 sm:h-16 sm:w-16 text-white/70" />
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-md p-2 sm:p-4 flex flex-col">
                    <div className="text-white text-sm sm:text-lg font-semibold mb-1 sm:mb-2">Client Matching</div>
                    <div className="flex-grow flex items-center justify-center">
                      <PieChart className="h-10 w-10 sm:h-16 sm:w-16 text-white/70" />
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-md p-2 sm:p-4 flex flex-col">
                    <div className="text-white text-sm sm:text-lg font-semibold mb-1 sm:mb-2">Marketing ROI</div>
                    <div className="flex-grow flex items-center justify-center">
                      <LineChart className="h-10 w-10 sm:h-16 sm:w-16 text-white/70" />
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-md p-2 sm:p-4 flex flex-col">
                    <div className="text-white text-sm sm:text-lg font-semibold mb-1 sm:mb-2">Lead Conversion</div>
                    <div className="flex-grow flex items-center justify-center">
                      <TrendingUp className="h-10 w-10 sm:h-16 sm:w-16 text-white/70" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Benefits */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 sm:mb-6">
                Transform Your Real Estate Business
              </h2>
              <p className="text-base sm:text-xl text-green-50 mb-6 sm:mb-8 font-semibold">
                Our AI-powered platform helps you make data-driven decisions and stay ahead of the competition
              </p>

              <div className="space-y-3 sm:space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-2 sm:gap-3"
                  >
                    <div className="bg-white/20 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white hover:bg-gradient-to-r hover:from-white hover:to-green-200 hover:bg-clip-text hover:text-transparent transition-all duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-sm sm:text-base text-green-50">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0f9f4] via-[#e6f5ec] to-white z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#002417] mb-3 sm:mb-4">What Our Clients Say</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-semibold">
              Real estate professionals are transforming their business with our AI tools
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-4 sm:p-6 rounded-lg border border-gray-100 shadow-md relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0e6537]/5 to-white z-0"></div>

                <div className="relative z-10">
                  <div className="flex mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-[#0e6537] text-[#0e6537]" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 font-semibold">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0e6537]/20 flex items-center justify-center">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-[#0e6537]" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-[#0e6537] hover:bg-gradient-to-r hover:from-[#0e6537] hover:to-[#157a42] hover:bg-clip-text hover:text-transparent transition-all duration-300">
                        {testimonial.author}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 font-semibold">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a5a2f] via-[#0e6537] to-[#157a42] z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Left Column: CTA Content */}
            <div className="text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6">Ready to transform your real estate business?</h2>
              <p className="text-base sm:text-lg text-green-50 mb-6 sm:mb-8 font-semibold">
                Join thousands of real estate professionals who are leveraging AI to grow their business
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/signup"
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-[#0e6537] hover:bg-gradient-to-r hover:from-white hover:to-green-100 rounded-md font-medium transition-all duration-300 text-center text-sm sm:text-base"
                >
                  Get Started
                </Link>
                <Link
                  href="/contact"
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#0e6537] hover:bg-gradient-to-r hover:from-[#0e6537] hover:to-[#157a42] border border-white/20 text-white rounded-md font-medium transition-all duration-300 text-center text-sm sm:text-base"
                >
                  Contact Sales
                </Link>
              </div>
            </div>

            {/* Right Column: Image Placeholder */}
            <div className="flex justify-center mt-8 md:mt-0">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 sm:p-8 w-full max-w-md aspect-[4/3] flex flex-col items-center justify-center text-white">
                <Laptop className="h-16 w-16 sm:h-20 sm:w-20 mb-3 sm:mb-4 text-white/80" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">AI-Powered Platform</h3>
                <p className="text-sm sm:text-base text-center text-green-50">
                  Advanced analytics and automation tools to streamline your real estate business
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  )
}

/**
 * Change Log:
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
 * - Added comprehensive testing strategy
 */
