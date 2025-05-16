import Image from "next/image"
import { Star, TrendingUp, BarChart2, MessageSquare, Users, ArrowUpRight, CheckCircle } from "lucide-react"
import { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Case Studies | AI-Powered Success Stories",
  description: "Discover how real estate professionals are transforming their businesses with our AI-powered solutions.",
}

interface CardProps {
  className?: string
  children: ReactNode
  [key: string]: any
}

interface CardContentProps {
  className?: string
  children: ReactNode
  [key: string]: any
}

interface AvatarProps {
  className?: string
  children: ReactNode
  [key: string]: any
}

interface AvatarImageProps {
  src?: string
  alt?: string
  className?: string
  [key: string]: any
}

interface AvatarFallbackProps {
  className?: string
  children: ReactNode
  [key: string]: any
}

interface BadgeProps {
  className?: string
  children: ReactNode
  [key: string]: any
}

interface ButtonProps {
  className?: string
  children: ReactNode
  [key: string]: any
}

export default function CaseStudiesPage() {
  // Custom components
  const Card = ({ className, children, ...props }: CardProps) => {
    return (
      <div className={`bg-white rounded-lg border border-gray-100 ${className}`} {...props}>
        {children}
      </div>
    )
  }

  const CardContent = ({ className, children, ...props }: CardContentProps) => {
    return (
      <div className={`p-6 ${className}`} {...props}>
        {children}
      </div>
    )
  }

  const Avatar = ({ className, children, ...props }: AvatarProps) => {
    return (
      <div className={`relative inline-block rounded-full overflow-hidden ${className}`} {...props}>
        {children}
      </div>
    )
  }

  const AvatarImage = ({ src, alt, className, ...props }: AvatarImageProps) => {
    return (
      <Image
        src={src || "/placeholder.svg"}
        alt={alt || "Avatar"}
        width={40}
        height={40}
        className={`h-full w-full object-cover ${className}`}
        {...props}
      />
    )
  }

  const AvatarFallback = ({ className, children, ...props }: AvatarFallbackProps) => {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gray-100 text-gray-600 ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }

  const Badge = ({ className, children, ...props }: BadgeProps) => {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
        {...props}
      >
        {children}
      </span>
    )
  }

  const Button = ({ className, children, ...props }: ButtonProps) => {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-[#1e4d36] text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#1e4d36] opacity-90"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge className="bg-green-400/20 text-green-50 hover:bg-green-400/30 mb-4">Success Stories</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              AI-Powered <span className="text-green-400">Success</span> in Real Estate
            </h1>
            <p className="text-green-50 text-lg">
              Transforming property professionals into market leaders through intelligent technology
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27 width=%2732%27 height=%2732%27 fill=%27none%27 stroke=%27rgb(0 0 0 / 0.02)%27%3e%3cpath d=%27M0 .5H31.5V32%27/%3e%3c/svg%3e')] bg-[size:30px_30px]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#1e4d36] flex items-center justify-center text-green-50 group-hover:bg-[#2a5a42] transition-all duration-300">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-[#1e4d36] transition-all duration-300">
                    75%
                  </p>
                  <p className="text-gray-500 text-sm">More Listings</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#1e4d36] flex items-center justify-center text-green-50 group-hover:bg-[#2a5a42] transition-all duration-300">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-[#1e4d36] transition-all duration-300">
                    3.2x
                  </p>
                  <p className="text-gray-500 text-sm">ROI on AI</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#1e4d36] flex items-center justify-center text-green-50 group-hover:bg-[#2a5a42] transition-all duration-300">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-[#1e4d36] transition-all duration-300">
                    90%
                  </p>
                  <p className="text-gray-500 text-sm">Faster Response</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#1e4d36] flex items-center justify-center text-green-50 group-hover:bg-[#2a5a42] transition-all duration-300">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-[#1e4d36] transition-all duration-300">
                    $42M+
                  </p>
                  <p className="text-gray-500 text-sm">Property Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#1e4d36]/10 to-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 md:p-12">
                <Badge className="bg-[#1e4d36] text-white hover:bg-[#2a5a42] mb-4">Featured Success</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1e4d36] mb-4">Coastal Luxury Properties</h2>
                <p className="text-gray-600 mb-6">
                  From struggling boutique agency to market leader in ultra-luxury properties
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-2xl font-bold text-[#1e4d36]">75%</p>
                    <p className="text-gray-500 text-xs">Listing Growth</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-2xl font-bold text-[#1e4d36]">$4.2M</p>
                    <p className="text-gray-500 text-xs">Avg. Sale Price</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-2xl font-bold text-[#1e4d36]">3.2x</p>
                    <p className="text-gray-500 text-xs">ROI</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="h-12 w-12 border-2 border-[#1e4d36]/20">
                    <AvatarFallback className="bg-[#1e4d36]/10 text-[#1e4d36]">JM</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-[#1e4d36] text-[#1e4d36]" />
                      ))}
                    </div>
                    <p className="text-gray-900 font-medium">Jennifer Martinez</p>
                    <p className="text-gray-500 text-sm">CEO, Coastal Luxury Properties</p>
                  </div>
                </div>

                <Button className="bg-[#1e4d36] text-white hover:bg-[#2a5a42]">View Full Case Study</Button>
              </div>

              <div className="relative h-[300px] md:h-auto bg-[#1e4d36]/5 flex items-center justify-center">
                <div className="w-16 h-16 text-[#1e4d36]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16 bg-[#1e4d36]/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-bold text-[#1e4d36]">Success Stories</h2>
            <div className="flex gap-2">
              <Badge className="bg-[#1e4d36] hover:bg-[#2a5a42] text-white cursor-pointer">All</Badge>
              <Badge className="bg-white hover:bg-gray-100 text-[#1e4d36] cursor-pointer border border-[#1e4d36]/20">
                Pricing AI
              </Badge>
              <Badge className="bg-white hover:bg-gray-100 text-[#1e4d36] cursor-pointer border border-[#1e4d36]/20">
                Conversation AI
              </Badge>
              <Badge className="bg-white hover:bg-gray-100 text-[#1e4d36] cursor-pointer border border-[#1e4d36]/20">
                Marketing AI
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Case Study 1 */}
            <Card className="overflow-hidden hover:shadow-lg hover:border-[#1e4d36]/30 transition-all duration-300 group">
              <div className="relative h-48 bg-[#1e4d36]/5 flex items-center justify-center">
                <div className="w-12 h-12 text-[#1e4d36]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-[#1e4d36] text-lg group-hover:text-[#2a5a42] transition-all duration-300">
                    Summit Properties
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-[#1e4d36] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>

                <div className="grid grid-cols-3 gap-2 my-4">
                  <div className="bg-[#1e4d36]/5 p-3 rounded-lg">
                    <p className="text-lg font-bold text-[#1e4d36]">90%</p>
                    <p className="text-gray-500 text-xs">Response Time</p>
                  </div>
                  <div className="bg-[#1e4d36]/5 p-3 rounded-lg">
                    <p className="text-lg font-bold text-[#1e4d36]">24/7</p>
                    <p className="text-gray-500 text-xs">Availability</p>
                  </div>
                  <div className="bg-[#1e4d36]/5 p-3 rounded-lg">
                    <p className="text-lg font-bold text-[#1e4d36]">42%</p>
                    <p className="text-gray-500 text-xs">More Leads</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#1e4d36]/10 text-[#1e4d36]">MC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Michael Chen</p>
                    <p className="text-xs text-gray-500">Managing Broker</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Case Study 2 */}
            <Card className="overflow-hidden hover:shadow-lg hover:border-[#1e4d36]/30 transition-all duration-300 group">
              <div className="relative h-48 bg-[#1e4d36]/5 flex items-center justify-center">
                <div className="w-12 h-12 text-[#1e4d36]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-[#1e4d36] text-lg group-hover:text-[#2a5a42] transition-all duration-300">
                    Urban Homes
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-[#1e4d36] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>

                <div className="grid grid-cols-3 gap-2 my-4">
                  <div className="bg-[#1e4d36]/5 p-3 rounded-lg">
                    <p className="text-lg font-bold text-[#1e4d36]">15%</p>
                    <p className="text-gray-500 text-xs">Higher Prices</p>
                  </div>
                  <div className="bg-[#1e4d36]/5 p-3 rounded-lg">
                    <p className="text-lg font-bold text-[#1e4d36]">22%</p>
                    <p className="text-gray-500 text-xs">Faster Sales</p>
                  </div>
                  <div className="bg-[#1e4d36]/5 p-3 rounded-lg">
                    <p className="text-lg font-bold text-[#1e4d36]">98%</p>
                    <p className="text-gray-500 text-xs">Accuracy</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#1e4d36]/10 text-[#1e4d36]">SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                    <p className="text-xs text-gray-500">Director of Operations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Case Study 3 */}
            <Card className="overflow-hidden hover:shadow-lg hover:border-[#1e4d36]/30 transition-all duration-300 group">
              <div className="relative h-48 bg-[#1e4d36]/5 flex items-center justify-center">
                <div className="w-12 h-12 text-[#1e4d36]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-[#1e4d36] text-lg group-hover:text-[#2a5a42] transition-all duration-300">
                    Luxury Estates
                  </h3>
                  <ArrowUpRight className="h-4 w-4 text-[#1e4d36] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>

                <div className="grid grid-cols-3 gap-2 my-4">
                  <div className="bg-[#1e4d36]/5 p-3 rounded-lg">
                    <p className="text-lg font-bold text-[#1e4d36]">3x</p>
                    <p className="text-gray-500 text-xs">Marketing ROI</p>
                  </div>
                  <div className="bg-[#1e4d36]/5 p-3 rounded-lg">
                    <p className="text-lg font-bold text-[#1e4d36]">60%</p>
                    <p className="text-gray-500 text-xs">More Leads</p>
                  </div>
                  <div className="bg-[#1e4d36]/5 p-3 rounded-lg">
                    <p className="text-lg font-bold text-[#1e4d36]">45%</p>
                    <p className="text-gray-500 text-xs">Cost Reduction</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#1e4d36]/10 text-[#1e4d36]">RP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Robert Patel</p>
                    <p className="text-xs text-gray-500">Marketing Director</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Tools */}
      <section className="py-16 bg-[#1e4d36]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-12 text-center">Our AI-Powered Solutions</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#1e4d36]/20 shadow-md hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#1e4d36]/10 flex items-center justify-center mb-4 text-[#1e4d36] group-hover:bg-[#1e4d36]/20 transition-all duration-300">
                <BarChart2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1e4d36] mb-2 group-hover:text-[#2a5a42] transition-all duration-300">
                Pricing Prediction
              </h3>
              <p className="text-gray-600 text-sm">AI-powered market analysis for optimal pricing strategies</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-[#1e4d36] text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>98% accuracy rate</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#1e4d36]/20 shadow-md hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#1e4d36]/10 flex items-center justify-center mb-4 text-[#1e4d36] group-hover:bg-[#1e4d36]/20 transition-all duration-300">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1e4d36] mb-2 group-hover:text-[#2a5a42] transition-all duration-300">
                Conversation Management
              </h3>
              <p className="text-gray-600 text-sm">Intelligent chatbots and automated client engagement</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-[#1e4d36] text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>24/7 client support</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#1e4d36]/20 shadow-md hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#1e4d36]/10 flex items-center justify-center mb-4 text-[#1e4d36] group-hover:bg-[#1e4d36]/20 transition-all duration-300">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1e4d36] mb-2 group-hover:text-[#2a5a42] transition-all duration-300">
                Marketing Optimization
              </h3>
              <p className="text-gray-600 text-sm">Data-driven campaigns that target the right audience</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-[#1e4d36] text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>3x average ROI</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#1e4d36]/20 shadow-md hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#1e4d36]/10 flex items-center justify-center mb-4 text-[#1e4d36] group-hover:bg-[#1e4d36]/20 transition-all duration-300">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1e4d36] mb-2 group-hover:text-[#2a5a42] transition-all duration-300">
                Lead Scoring
              </h3>
              <p className="text-gray-600 text-sm">Intelligent prioritization of your most valuable prospects</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-[#1e4d36] text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>85% conversion increase</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
