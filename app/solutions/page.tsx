"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useInView, useAnimation } from "framer-motion"
import {
  BarChart3,
  MessageSquare,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Linkedin,
  Twitter,
  Home,
  Target,
  Clock,
  PieChart,
  LineChart,
  BarChart,
  Percent,
} from "lucide-react"
import Footer from "../Footer"
import Navbar from "../Navbar"

export default function Solutions() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [currentConversation, setCurrentConversation] = useState(0)

  // Refs for scroll animations
  const featuresSectionRef = useRef(null)
  const pricingRef = useRef(null)
  const conversationRef = useRef(null)
  const marketingRef = useRef(null)
  const leadScoringRef = useRef(null)

  const featuresInView = useInView(featuresSectionRef, { once: true, amount: 0.2 })
  const pricingInView = useInView(pricingRef, { once: true, amount: 0.3 })
  const conversationInView = useInView(conversationRef, { once: true, amount: 0.3 })
  const marketingInView = useInView(marketingRef, { once: true, amount: 0.3 })
  const leadScoringInView = useInView(leadScoringRef, { once: true, amount: 0.3 })

  const featuresAnimation = useAnimation()
  const pricingAnimation = useAnimation()
  const conversationAnimation = useAnimation()
  const marketingAnimation = useAnimation()
  const leadScoringAnimation = useAnimation()

  useEffect(() => {
    if (featuresInView) {
      featuresAnimation.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, staggerChildren: 0.1 },
      })
    }
  }, [featuresInView, featuresAnimation])

  useEffect(() => {
    if (pricingInView) {
      pricingAnimation.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      })
    }
  }, [pricingInView, pricingAnimation])

  useEffect(() => {
    if (conversationInView) {
      conversationAnimation.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      })
    }
  }, [conversationInView, conversationAnimation])

  useEffect(() => {
    if (marketingInView) {
      marketingAnimation.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      })
    }
  }, [marketingInView, marketingAnimation])

  useEffect(() => {
    if (leadScoringInView) {
      leadScoringAnimation.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      })
    }
  }, [leadScoringInView, leadScoringAnimation])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-rotate conversations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentConversation((prev) => (prev + 1) % conversations.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      id: 1,
      title: "Pricing Prediction",
      icon: <BarChart3 className="w-10 h-10 text-[#0e6537]" />,
      description:
        "Advanced AI algorithms analyze market trends, property features, and historical data to provide accurate price predictions for real estate properties.",
      stats: [
        { label: "Accuracy Rate", value: "94%" },
        { label: "Data Points", value: "500M+" },
        { label: "Markets Covered", value: "200+" },
      ],
      demo: "/rising-real-estate-values.png",
    },
    {
      id: 2,
      title: "Conversation Management",
      icon: <MessageSquare className="w-10 h-10 text-[#0e6537]" />,
      description:
        "Automatically engage leads, handle routine questions, and intelligently escalate to a realtor when the time is right— powered by AI-driven conversation flows.",
      stats: [
        { label: "Response Time", value: "<1min" },
        { label: "Satisfaction", value: "96%" },
        { label: "Lead Conversion", value: "+45%" },
      ],
      demo: "/conversation-management.png",
    },
    {
      id: 3,
      title: "Marketing Optimization",
      icon: <TrendingUp className="w-10 h-10 text-[#0e6537]" />,
      description:
        "Leverage AI to optimize your marketing campaigns, target the right audience, and maximize your property listings' visibility across multiple platforms.",
      stats: [
        { label: "Conversion Rate", value: "+68%" },
        { label: "Ad Spend ROI", value: "3.2x" },
        { label: "Reach", value: "10x" },
      ],
      demo: "/property-marketing-dashboard.png",
    },
    {
      id: 4,
      title: "Automated Lead Scoring",
      icon: <Users className="w-10 h-10 text-[#0e6537]" />,
      description:
        "Our AI system automatically evaluates and ranks leads based on their likelihood to convert, helping you focus on the most promising opportunities.",
      stats: [
        { label: "Close Rate", value: "+75%" },
        { label: "Lead Quality", value: "4.8/5" },
        { label: "Time to Close", value: "-35%" },
      ],
      demo: "/lead-scoring-dashboard.png",
    },
  ]

  const conversations = [
    {
      lead: "John Doe",
      date: "Mar 15, 2023",
      stage: "AI Engaged",
      stageColor: "bg-[#0e6537]",
      message: "Looking for a 3-bedroom house in the downtown area with a budget of $500,000.",
    },
    {
      lead: "Jane Smith",
      date: "Mar 14, 2023",
      stage: "Agent Hand-Off",
      stageColor: "bg-[#157a42]",
      message: "Need more details about the financing options for the property on 123 Main St.",
    },
    {
      lead: "Robert Brown",
      date: "Mar 13, 2023",
      stage: "AI Engaged",
      stageColor: "bg-[#0e6537]",
      message: "Interested in scheduling a viewing for the lakefront property this weekend.",
    },
    {
      lead: "Linda Davis",
      date: "Mar 12, 2023",
      stage: "Closed",
      stageColor: "bg-gray-400",
      message: "Thanks for your help! We've decided to move forward with the purchase.",
    },
    {
      lead: "Linda Davis",
      date: "Mar 11, 2023",
      stage: "Closed",
      stageColor: "bg-gray-400",
      message: "Thanks for your help! We've decided to move forward with the purchase.",
    },
  ]

  const conversationFeatures = [
    "AI-Powered Engagement",
    "Real-Time Handoffs",
    "Unified Conversation View",
    "Intelligent Insights",
  ]

  const pricingFeatures = [
    "Hyper-Local Market Analysis",
    "Property Feature Valuation",
    "Historical Trend Modeling",
    "Competitive Listing Intelligence",
  ]

  const marketingFeatures = [
    "Multi-Channel Campaign Management",
    "Audience Targeting & Segmentation",
    "Performance Analytics & Optimization",
    "Automated Content Generation",
  ]

  const leadScoringFeatures = [
    "Behavioral Analysis",
    "Engagement Tracking",
    "Conversion Probability Scoring",
    "Priority-Based Lead Routing",
  ]

  return (
    <div className="min-h-screen">
      <Navbar/>

      {/* Hero Section */}
      <section className="relative px-8 py-20 md:py-32 overflow-hidden bg-white">
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#e6f5ec] to-transparent opacity-70"
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
            <h1 className="text-4xl md:text-6xl font-bold text-[#002417] mb-4">
              AI-Powered <span className="gradient-text italic">Solutions</span> for Realtors
            </h1>
            <p className="text-xl text-[#0a5a2f] max-w-3xl mx-auto">
              Discover how our suite of AI tools can transform every aspect of your real estate business
            </p>
          </motion.div>

          <div ref={featuresSectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresAnimation}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                  activeFeature === feature.id ? "ring-2 ring-[#0e6537]" : ""
                }`}
                onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {feature.icon}
                      <h3 className="text-2xl font-semibold text-[#002417]">{feature.title}</h3>
                    </div>
                    <button className="text-[#0e6537]">
                      <ArrowRight
                        size={20}
                        className={`transition-transform duration-300 ${
                          activeFeature === feature.id ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-gray-700 mb-4">{feature.description}</p>

                  <div
                    className={`grid grid-cols-3 gap-2 mb-4 transition-all duration-300 ${
                      activeFeature === feature.id ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                    }`}
                  >
                    {feature.stats.map((stat, i) => (
                      <div key={i} className="bg-[#e6f5ec] p-3 rounded-lg text-center">
                        <div className="text-[#0e6537] font-bold text-xl">{stat.value}</div>
                        <div className="text-xs text-[#0a5a2f]">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`transition-all duration-500 ${
                    activeFeature === feature.id ? "max-h-80" : "max-h-0"
                  } overflow-hidden`}
                >
                  <img src={feature.demo || "/placeholder.svg"} alt={feature.title} className="w-full object-cover" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Prediction Section */}
      <section ref={pricingRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={pricingAnimation}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="inline-block px-3 py-1 bg-[#e6f5ec] text-[#0a5a2f] rounded-full text-sm font-medium mb-4">
                AI Pricing
              </div>
              <h2 className="text-4xl font-bold text-[#002417] mb-6">Pricing Prediction</h2>
              <p className="text-gray-700 mb-8">
                Advanced AI algorithms analyze market trends, property features, and historical data to provide accurate
                price predictions for real estate properties.
              </p>

              <div className="space-y-4 mb-8">
                {pricingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#0e6537] w-5 h-5" />
                    <span className="text-[#002417]">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#002417] text-white rounded-md hover:bg-[#157a42] transition-colors"
              >
                Learn More <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-[#0a5a2f] text-white p-4">
                <h3 className="text-xl font-semibold">Property Valuation Dashboard</h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-[#002417]">Estimated Market Value</h4>
                    <span className="text-[#0e6537] font-bold text-xl">$875,000</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0e6537] w-[85%]"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$750,000</span>
                    <span>$950,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#e6f5ec] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <LineChart size={16} className="text-[#0e6537]" />
                      <span className="text-sm font-medium text-[#002417]">Price Trend</span>
                    </div>
                    <div className="text-[#0e6537] font-bold">+5.2% YoY</div>
                    <div className="text-xs text-gray-600">Above market average</div>
                  </div>
                  <div className="bg-[#e6f5ec] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart size={16} className="text-[#0e6537]" />
                      <span className="text-sm font-medium text-[#002417]">Comparable Sales</span>
                    </div>
                    <div className="text-[#0e6537] font-bold">12 Properties</div>
                    <div className="text-xs text-gray-600">Within 0.5 miles</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Home size={16} className="text-[#0e6537]" />
                      <span className="text-sm text-[#002417]">Property Features</span>
                    </div>
                    <span className="text-[#0e6537] font-medium">+$45,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-[#0e6537]" />
                      <span className="text-sm text-[#002417]">Location Premium</span>
                    </div>
                    <span className="text-[#0e6537] font-medium">+$120,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[#0e6537]" />
                      <span className="text-sm text-[#002417]">Market Timing</span>
                    </div>
                    <span className="text-[#0e6537] font-medium">+$25,000</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conversation Management Section */}
      <section ref={conversationRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={conversationAnimation}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-[#0a5a2f] text-white p-4">
                  <h3 className="text-xl font-semibold">Recent Conversations</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-4 mb-4 text-sm font-medium text-[#002417]">
                    <div>Lead</div>
                    <div>Date</div>
                    <div>Stage</div>
                    <div>Last Message</div>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {conversations.map((convo, index) => (
                      <div
                        key={index}
                        className={`grid grid-cols-4 gap-4 p-3 rounded-lg text-sm ${
                          index === currentConversation ? "bg-[#e6f5ec]" : ""
                        }`}
                      >
                        <div className="font-medium text-[#002417]">{convo.lead}</div>
                        <div className="text-gray-600">{convo.date}</div>
                        <div>
                          <span className={`${convo.stageColor} text-white px-2 py-1 rounded-full text-xs`}>
                            {convo.stage}
                          </span>
                        </div>
                        <div className="text-gray-700 truncate">{convo.message}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        onClick={() =>
                          setCurrentConversation((prev) => (prev - 1 + conversations.length) % conversations.length)
                        }
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <div className="w-40 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#0e6537] h-full transition-all duration-300"
                          style={{ width: `${(currentConversation + 1) * (100 / conversations.length)}%` }}
                        ></div>
                      </div>
                      <button
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        onClick={() => setCurrentConversation((prev) => (prev + 1) % conversations.length)}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-block px-3 py-1 bg-[#e6f5ec] text-[#0a5a2f] rounded-full text-sm font-medium mb-4">
                AI Communication
              </div>
              <h2 className="text-4xl font-bold text-[#002417] mb-6">Conversation Management</h2>
              <p className="text-gray-700 mb-8">
                Automatically engage leads, handle routine questions, and intelligently escalate to a realtor when the
                time is right— powered by AI-driven conversation flows.
              </p>

              <div className="space-y-4 mb-8">
                {conversationFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#0e6537] w-5 h-5" />
                    <span className="text-[#002417]">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#002417] text-white rounded-md hover:bg-[#157a42] transition-colors"
              >
                Learn More <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marketing Optimization Section */}
      <section ref={marketingRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={marketingAnimation}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="inline-block px-3 py-1 bg-[#e6f5ec] text-[#0a5a2f] rounded-full text-sm font-medium mb-4">
                AI Marketing
              </div>
              <h2 className="text-4xl font-bold text-[#002417] mb-6">Automated Campaigns</h2>
              <p className="text-gray-700 mb-8">
                Provide minimal inputs—like location, budget, and property details— and let our AI create a full
                marketing campaign. We'll deploy it, monitor performance, and optimize continuously. All for pennies on
                the dollar.
              </p>

              <div className="space-y-4 mb-8">
                {marketingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#0e6537] w-5 h-5" />
                    <span className="text-[#002417]">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <h3 className="text-[#002417] font-medium mb-4">We integrate seamlessly with:</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                    <Facebook className="text-[#1877F2]" size={20} />
                    <span>Facebook Ads</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Google Ads</span>
                  </div>
                </div>
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#002417] text-white rounded-md hover:bg-[#157a42] transition-colors"
              >
                Get Started <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative">
              <div className="bg-white rounded-xl shadow-xl p-6 relative z-10">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-[#002417]">Lead Generation Workflow</h3>
                </div>

                <div className="relative">
                  {/* Central node */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-xl shadow-lg flex items-center justify-center z-20">
                    <div className="text-center">
                      <div className="text-[#002417] font-medium text-sm">Lead Generation</div>
                      <div className="text-[#002417] font-medium text-sm">Workflow</div>
                    </div>
                  </div>

                  {/* Social media nodes */}
                  <div className="relative h-[300px] w-[300px] mx-auto">
                    {/* Facebook */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="w-16 h-16 bg-[#1877F2] rounded-full flex items-center justify-center shadow-lg">
                        <Facebook className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    {/* Google */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      </div>
                    </motion.div>

                    {/* LinkedIn */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
                    >
                      <div className="w-16 h-16 bg-[#0077B5] rounded-full flex items-center justify-center shadow-lg">
                        <Linkedin className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    {/* Twitter */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="w-16 h-16 bg-[#1DA1F2] rounded-full flex items-center justify-center shadow-lg">
                        <Twitter className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
                      <line x1="150" y1="0" x2="150" y2="120" stroke="#ddd" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="300" y1="150" x2="180" y2="150" stroke="#ddd" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="150" y1="300" x2="150" y2="180" stroke="#ddd" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="0" y1="150" x2="120" y2="150" stroke="#ddd" strokeWidth="2" strokeDasharray="5,5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lead Scoring Section */}
      <section ref={leadScoringRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={leadScoringAnimation}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-[#0a5a2f] text-white p-4">
                  <h3 className="text-xl font-semibold">Lead Scoring Dashboard</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#e6f5ec] p-4 rounded-lg text-center">
                      <div className="text-[#0e6537] font-bold text-3xl mb-1">87</div>
                      <div className="text-sm text-[#002417] font-medium">High-Value Leads</div>
                    </div>
                    <div className="bg-[#e6f5ec] p-4 rounded-lg text-center">
                      <div className="text-[#0e6537] font-bold text-3xl mb-1">64%</div>
                      <div className="text-sm text-[#002417] font-medium">Conversion Rate</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-[#002417]">John Smith</span>
                        <span className="text-sm font-medium text-[#0e6537]">92/100</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0e6537] w-[92%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-[#002417]">Maria Garcia</span>
                        <span className="text-sm font-medium text-[#0e6537]">87/100</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0e6537] w-[87%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-[#002417]">David Lee</span>
                        <span className="text-sm font-medium text-[#0e6537]">78/100</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0e6537] w-[78%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-[#002417]">Sarah Johnson</span>
                        <span className="text-sm font-medium text-[#157a42]">65/100</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#157a42] w-[65%]"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <PieChart size={16} className="text-[#0e6537]" />
                      <span className="text-sm text-[#002417]">Lead Sources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Percent size={16} className="text-[#0e6537]" />
                      <span className="text-sm text-[#002417]">Conversion Probability</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-block px-3 py-1 bg-[#e6f5ec] text-[#0a5a2f] rounded-full text-sm font-medium mb-4">
                AI Lead Management
              </div>
              <h2 className="text-4xl font-bold text-[#002417] mb-6">Automated Lead Scoring</h2>
              <p className="text-gray-700 mb-8">
                Our AI system automatically evaluates and ranks leads based on their likelihood to convert, helping you
                focus on the most promising opportunities and maximize your closing rate.
              </p>

              <div className="space-y-4 mb-8">
                {leadScoringFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="text-[#0e6537] w-5 h-5" />
                    <span className="text-[#002417]">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#002417] text-white rounded-md hover:bg-[#157a42] transition-colors"
              >
                Learn More <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#0a5a2f] via-[#0e6537] to-[#157a42] [&_*]:text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold !text-white mb-6">
            Ready to Transform Your Real Estate Business?
          </h2>
          <p className="!text-white mb-8 text-lg">
            Join thousands of real estate professionals who are leveraging our AI tools to stay ahead of the competition
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-[#0e6537] !text-white rounded-md hover:from-[#0e6537] hover:to-[#157a42] transition-colors text-lg font-medium"
            >
              Get Started Free
            </Link>
            <Link
              href="#"
              className="px-8 py-3 bg-transparent border-2 border-white !text-white rounded-md hover:bg-white/10 transition-colors text-lg font-medium"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  )
}
