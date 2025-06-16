/**
 * File: app/about/page.tsx
 * Purpose: Error page with auth feedback
 * - Centered content alignment

 * - Error description text
 * Author: acagliol
 * Date: 06/15/25
 * Version: 1.0.0
 */

/**
 * Page Component
 * 
 * Features:
 * - Full-screen responsive layout
 * - Centered content alignment
 * - Error message header
 * - Error description text * 
 * Sections:

 * - Centered content alignment

 * - Error description text * 
 * @returns {JSX.Element} Rendered component with error handling and user feedback
 */

"use client"

import { BarChart, MessageSquare, Target, Zap, Mail, Search, Lock, Code, Smartphone } from "lucide-react"
import Link from "next/link"
import Navbar from "../Navbar"
import Footer from "../Footer"

interface AvatarProps {
  src?: string;
  fallback: string;
  alt: string;
}

function Avatar({ src, fallback, alt }: AvatarProps) {
  return (
    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#0e6537]/10 text-[#0e6537] text-xl font-medium">
          {fallback}
        </div>
      )}
    </div>
  )
}

export default function AboutPage() {
  const leadershipTeam = [
    {
      name: "Anay Pant",
      role: "Chief Executive Officer",
      image: "",
    },
    {
      name: "Siddarth Nuthi",
      role: "Chief Technology Officer",
      image: "",
    },
    {
      name: "Alejo Cagliolo",
      role: "Chief Operating Officer",
      image: "",
    },
    {
      name: "Utsav Arora",
      role: "Chief Software Officer",
      image: "",
    },
    {
      name: "Parshawn Haynes",
      role: "Chief Marketing Officer",
      image: "",
    },
  ]

  const features = [
    {
      title: "Pricing Prediction",
      description: "Our advanced algorithms analyze millions of data points to provide highly accurate property valuations based on market trends and historical data.",
      icon: <BarChart className="h-6 w-6" />,
    },
    {
      title: "AI Conversation Management",
      description: "Automatically engage leads, manage follow-ups, and escalate conversations at the right time—all powered by responsive AI.",
      icon: <MessageSquare className="h-6 w-6" />,
    },
    {
      title: "Marketing Optimization",
      description: "Create and launch high-impact campaigns across platforms like Google, Facebook, and LinkedIn with automated performance tracking.",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      title: "Lead Scoring",
      description: "Rank and prioritize leads based on behavior, intent, and conversion likelihood using real-time scoring algorithms.",
      icon: <Target className="h-6 w-6" />,
    },
    {
      title: "Email Communications",
      description: "Use AI to streamline outreach and follow-ups while keeping interactions personalized.",
      icon: <Mail className="h-6 w-6" />,
    },
  ]

  const platformFeatures = [
    {
      title: "SEO-optimized",
      description: "Built for maximum visibility and reach",
      icon: <Search className="h-6 w-6" />,
    },
    {
      title: "Accessibility-first",
      description: "ARIA support and keyboard navigation",
      icon: <Smartphone className="h-6 w-6" />,
    },
    {
      title: "Secure",
      description: "HTTPS enforcement, CSP, CORS, and input sanitization",
      icon: <Lock className="h-6 w-6" />,
    },
    {
      title: "Performance-focused",
      description: "Lazy loading and code-splitting for optimal speed",
      icon: <Code className="h-6 w-6" />,
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#0a5a2f] via-[#0e6537] to-[#157a42] py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="container px-4 md:px-6 text-center space-y-8 max-w-4xl mx-auto relative">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
              About Us – ACS
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter !text-white leading-tight [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
              Revolutionizing Real Estate with AI
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              At ACS, we believe in a smarter future for real estate—one powered by artificial intelligence and built by passionate people.
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-20 bg-white">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              We are a technology-driven company dedicated to helping real estate professionals thrive in a rapidly evolving market. Our AI-powered platform equips agents, brokers, developers, and teams with the tools they need to work faster, close smarter, and connect meaningfully with clients.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">What We Do</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We deliver a comprehensive suite of intelligent tools designed to simplify and enhance the entire real estate process:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-[#0e6537] mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-8">
              Each feature is built with a mobile-first, responsive design philosophy, ensuring accessibility across devices and platforms.
            </p>
          </div>
        </section>

        {/* Why We're Different */}
        <section className="py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Why We&apos;re Different</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We go beyond just building software—we empower professionals to make informed decisions with confidence. Our dashboards transform complex data into clear, actionable insights. Everything is optimized for speed, security, and usability.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {platformFeatures.map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="text-[#0e6537] mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-8">
              We also support seamless integration with your existing workflow tools, providing scalable solutions for teams of all sizes.
            </p>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Behind ACS is a group of dedicated leaders who bring together engineering talent and business acumen:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leadershipTeam.map((member, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm text-center">
                  <div className="flex justify-center">
                    <Avatar src={member.image} fallback={member.name[0]} alt={member.name} />
                  </div>
                  <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
                  <p className="text-[#0e6537] font-medium">{member.role}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-8">
              Together, they&apos;ve created a platform that blends precision, empathy, and innovation.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#0e6537]">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter !text-white mb-4 [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">Let&apos;s Work Together</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Whether you&apos;re a solo agent, a brokerage, or a growing enterprise, ACS is here to scale with you.
            </p>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Explore the future of real estate—guided by intelligence, shaped by people.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 bg-[#0e6537] text-white hover:bg-[#157a42] rounded-md font-medium transition-all duration-300 text-base shadow-lg shadow-black/10"
              >
                Contact Us
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white hover:bg-white/10 rounded-md font-medium transition-all duration-300 text-base"
              >
                Get Started Free
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
 */

