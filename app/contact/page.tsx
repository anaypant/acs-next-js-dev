/**
 * File: app/contact/page.tsx
 * Purpose: Renders the contact page with a contact form, team section, and testimonials.
 * Author: acagliol
 * Date: 06/15/25
 * Version: 1.1.1
 */

"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "../Navbar"
import Footer from "../Footer"

/**
 * Input Component
 * A reusable input field component with error handling and styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.error - Error message to display
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded ref
 * @returns {JSX.Element} Input field with error handling
 */
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { error?: string }>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          className={`w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e6537] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)
Input.displayName = "Input"

/**
 * Textarea Component
 * A reusable textarea component with error handling and styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.error - Error message to display
 * @param {React.Ref<HTMLTextAreaElement>} ref - Forwarded ref
 * @returns {JSX.Element} Textarea with error handling
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
>(({ className, error, ...props }, ref) => {
  return (
    <div className="relative">
      <textarea
        className={`w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e6537] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
})
Textarea.displayName = "Textarea"

/**
 * Button Component
 * A reusable button component with variants and sizes
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {"default" | "outline"} props.variant - Button style variant
 * @param {"default" | "sm" | "lg"} props.size - Button size
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref
 * @returns {JSX.Element} Styled button
 */
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline"
    size?: "default" | "sm" | "lg"
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e6537] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    default: "bg-gradient-to-r from-[#0a5a2f] to-[#157a42] text-white hover:from-[#0e6537] hover:to-[#157a42]",
    outline: "border border-[#0e6537] bg-transparent text-[#0e6537] hover:bg-[#0e6537]/5",
  }

  const sizes = {
    default: "h-10 py-2 px-4 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
  }

  return <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} ref={ref} {...props} />
})
Button.displayName = "Button"

/**
 * Icons Collection
 * A collection of SVG icons used throughout the contact page
 * Each icon is a React component that accepts standard SVG props
 */
const Icons = {
  MapPin: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Phone: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Mail: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Clock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Send: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  CheckCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Users: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Zap: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Target: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Quote: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  ),
}

/**
 * TeamSection Component
 * Displays team members with their roles and co-founder status
 * 
 * @returns {JSX.Element} Team section with member cards
 */
function TeamSection() {
  const teamMembers = [
    {
      name: "Anay Pant",
      role: "Chief Excutive Officer",
      isCoFounder: true,
    },
    {
      name: "Siddarth Nuthi",
      role: "Chief Technology Officer",
      isCoFounder: true,
    },
    {
      name: "Alejo Cagliolo",
      role: "Chief Operating Officer",
    },
    {
      name: "Utsav Arora",
      role: "Chief Software Officer",
    },
    {
      name: "Parshawn Haynes",
      role: "Chief Marketing Officer",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.div
      className="overflow-hidden rounded-xl bg-white p-8 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Meet Our Team</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-[#0a5a2f] to-[#157a42]"></div>
        <p className="mt-4 text-gray-600">
          Our dedicated team of professionals is committed to providing exceptional service and innovative solutions.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4]">
              {member.isCoFounder && (
                <span className="rounded-full bg-[#0e6537] px-3 py-1 text-xs font-medium text-white">Co-Founder</span>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-[#d8eee1] flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#0e6537]">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#002417]/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-white bg-transparent text-white hover:bg-white hover:text-green-800"
                >
                  <Icons.Mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </div>
            </div>
            <div className="p-6 text-center">
              <h3 className="mb-1 text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-sm font-medium text-[#0e6537]">{member.role}</p>
              {member.isCoFounder && (
                <div className="mt-2 hidden md:block">
                  <span className="inline-block rounded-full bg-[#e6f5ec] px-3 py-1 text-xs font-medium text-[#002417]">
                    Co-Founder
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/**
 * TestimonialsSection Component
 * Displays client testimonials with ratings and quotes
 * 
 * @returns {JSX.Element} Testimonials section with client feedback
 */
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "ACS transformed our operations with their innovative solutions. Their team was responsive, professional, and delivered beyond our expectations.",
      author: "Sarah Johnson",
      position: "CTO",
      company: "TechVision Inc.",
    },
    {
      quote:
        "Working with ACS has been a game-changer for our business. Their expertise and dedication to our success made all the difference.",
      author: "Michael Chen",
      position: "Operations Director",
      company: "Global Systems",
    },
    {
      quote:
        "The team at ACS provided exceptional service from start to finish. Their attention to detail and commitment to quality is unmatched.",
      author: "Emily Rodriguez",
      position: "CEO",
      company: "Innovate Partners",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.div
      className="overflow-hidden rounded-xl bg-white p-8 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">What Our Clients Say</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-[#0a5a2f] to-[#157a42]"></div>
        <p className="mt-4 text-gray-600">
          Don't just take our word for it. Here's what our clients have to say about working with ACS:
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="relative rounded-lg border border-gray-100 bg-gradient-to-br from-white to-[#f0f9f4] p-6 shadow-sm"
            variants={itemVariants}
          >
            <div className="absolute -top-3 -left-3 rounded-full bg-[#0e6537] p-2 text-white">
              <Icons.Quote className="h-4 w-4" />
            </div>
            <p className="mb-4 italic text-gray-600">"{testimonial.quote}"</p>
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="font-medium text-gray-800">{testimonial.author}</p>
              <p className="text-sm text-gray-600">
                {testimonial.position}, {testimonial.company}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/**
 * ContactPage Component
 * Main contact page component with form handling and validation
 * 
 * @returns {JSX.Element} Complete contact page with form, team, and testimonials
 */
export default function ContactPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    isDemoRequest: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState(false);
  const [emailDetails, setEmailDetails] = useState<{ messageId?: string; response?: string }>({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setApiError("Please fill in all required fields");
      return false;
    }
    if (!formData.email.includes('@')) {
      setApiError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setApiSuccess(false);
    setEmailDetails({});
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send message');
        }

        setIsSubmitted(true);
        setApiSuccess(true);
        setEmailDetails({
          messageId: data.messageId,
          response: data.response
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          isDemoRequest: false,
        });
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Failed to send message. Please try again later.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = "checked" in e.target ? e.target.checked : false;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "isDemoRequest" && checked) {
      setFormData((prev) => ({
        ...prev,
        subject: "Demo Request",
        message:
          "Hello, I am interested in a demo of your AI-powered real estate platform. I would like to learn more about how it can help my business. Please provide more information about scheduling a demo session.",
      }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gradient-to-b from-[#e6f5ec] via-[#f0f9f4] to-white">
        {/* Background patterns */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle gradient circles */}
          <div className="absolute -top-[15%] -right-[15%] h-[50%] w-[50%] rounded-full bg-[#0e6537]/5 blur-3xl" />
          <div className="absolute top-[60%] -left-[10%] h-[40%] w-[40%] rounded-full bg-[#0a5a2f]/5 blur-3xl" />
          <div className="absolute -bottom-[10%] right-[20%] h-[30%] w-[30%] rounded-full bg-[#157a42]/5 blur-3xl" />

          {/* Remove the diagonal stripes and grid pattern */}
          {/* Add a subtle dot pattern instead */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(#0e6537 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <motion.div
          className="container relative mx-auto px-4 py-8 sm:py-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="mb-8 sm:mb-16 text-center" variants={itemVariants}>
            <h1 className="mb-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-[#0a5a2f] to-[#157a42] bg-clip-text text-transparent">
                Contact Us
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-gray-700">
              We're here to help and answer any questions you might have. We look forward to hearing from you.
            </p>
          </motion.div>

          <div className="mx-auto max-w-6xl">
            {/* Contact Form and Information */}
            <div className="grid gap-4 sm:gap-8 md:grid-cols-12">
              {/* Contact Information */}
              <motion.div className="md:col-span-5 lg:col-span-4" variants={itemVariants}>
                <div className="rounded-xl bg-white p-4 sm:p-8 shadow-lg">
                  <div className="mb-6 sm:mb-8">
                    <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold text-gray-800">Get in Touch</h2>
                    <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-[#0a5a2f] to-[#157a42]"></div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="rounded-full bg-[#f0f9f4] p-2 sm:p-3 text-[#0e6537]">
                        <Icons.MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-medium text-gray-800">Our Location</h3>
                        <p className="mt-1 text-xs sm:text-sm text-gray-600">
                          501 North Capitol Avenue
                          <br />
                          Indianapolis, IN 46204
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="rounded-full bg-[#f0f9f4] p-2 sm:p-3 text-[#0e6537]">
                        <Icons.Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-medium text-gray-800">Email</h3>
                        <p className="mt-1 text-xs sm:text-sm text-gray-600">support@automatedconsultancy.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="rounded-full bg-[#f0f9f4] p-2 sm:p-3 text-[#0e6537]">
                        <Icons.Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-medium text-gray-800">Business Hours</h3>
                        <p className="mt-1 text-xs sm:text-sm text-gray-600">
                          Monday - Friday: 8am - 6pm
                          <br />
                          Saturday: 10am - 4pm
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <a
                      href="https://www.linkedin.com/company/automated-consultancy-services/posts/?feedView=all"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-[#0e6537] text-white px-6 py-3 rounded-lg hover:bg-[#0a5a2f] transition-colors shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div className="md:col-span-7 lg:col-span-8" variants={itemVariants}>
                <div className="rounded-xl bg-white p-4 sm:p-8 shadow-lg">
                  {isSubmitted ? (
                    <motion.div
                      className="flex h-full flex-col items-center justify-center py-8 sm:py-16 text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="mb-4 sm:mb-6 rounded-full bg-[#f0f9f4] p-3 sm:p-4">
                        <Icons.CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-[#0e6537]" />
                      </div>
                      <h2 className="mb-2 text-xl sm:text-2xl font-bold text-gray-800">Message Sent Successfully!</h2>
                      <p className="mb-6 sm:mb-8 max-w-md text-sm sm:text-base text-gray-600">
                        Thank you for reaching out to us. We've received your message and will get back to you as soon as
                        possible.
                      </p>
                      <Button
                        className="bg-gradient-to-r from-green-700 to-emerald-800 hover:from-green-800 hover:to-emerald-900"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="mb-6 sm:mb-8">
                        <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold text-gray-800">Send Us a Message</h2>
                        <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-[#0a5a2f] to-[#157a42]"></div>
                        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
                          Fill out the form below, and we'll be in touch as soon as possible.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                              Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0e6537] focus:ring-2 focus:ring-[#0e6537]/20 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter your name"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0e6537] focus:ring-2 focus:ring-[#0e6537]/20 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                            Subject
                          </label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0e6537] focus:ring-2 focus:ring-[#0e6537]/20 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Enter message subject"
                          />
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={4}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0e6537] focus:ring-2 focus:ring-[#0e6537]/20 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Enter your message"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isDemoRequest"
                            name="isDemoRequest"
                            className="h-4 w-4 rounded border-gray-300 text-[#0e6537] focus:ring-[#0e6537]"
                            checked={formData.isDemoRequest}
                            onChange={handleChange}
                          />
                          <label htmlFor="isDemoRequest" className="ml-2 block text-sm text-gray-700">
                            Request a demo
                          </label>
                        </div>
                        {apiError && (
                          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{apiError}</div>
                        )}
                        {apiSuccess && (
                          <div className="text-green-500 text-sm bg-green-50 p-3 rounded-lg">
                            Message sent successfully! We'll get back to you soon.
                          </div>
                        )}
                        <div>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0e6537] hover:bg-[#0a5a2f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0e6537] disabled:opacity-50 transition-all duration-200"
                          >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Meet the Team Section */}
            {/* <motion.div className="mt-6 sm:mt-8" variants={itemVariants}>
              <TeamSection />
            </motion.div> */}

            {/* FAQ Section */}
            <motion.div className="mt-6 sm:mt-8 overflow-hidden rounded-xl bg-white p-4 sm:p-8 shadow-lg" variants={itemVariants}>
              <div className="mb-6">
                <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold text-gray-800">Frequently Asked Questions</h2>
                <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-[#0a5a2f] to-[#157a42]"></div>
              </div>

              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {[
                  {
                    q: "What services does ACS provide?",
                    a: "ACS offers a comprehensive range of services including consulting, implementation, and support for businesses of all sizes.",
                  },
                  {
                    q: "How quickly can I expect a response?",
                    a: "We aim to respond to all inquiries within 24 business hours. For urgent matters, please call our support line.",
                  },
                  {
                    q: "Do you offer virtual consultations?",
                    a: "Yes, we offer both in-person and virtual consultations to accommodate your preferences and location.",
                  },
                  {
                    q: "What are your payment terms?",
                    a: "We offer flexible payment options including monthly retainers, project-based billing, and customized payment plans.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-100 p-4 sm:p-6 transition-all hover:border-[#0e6537]/20 hover:shadow-sm"
                  >
                    <h3 className="mb-2 sm:mb-3 text-base sm:text-lg font-medium text-gray-800">{faq.q}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}

/**
 * Change Log:
 * 06/15/25 - Version 1.1.1
 * - Removed: -- a/app/contact/page.tsx
 * - Added: ++ b/app/contact/page.tsx
 * - Removed:     <div className="relative min-h-screen bg-gradient-to-b from-[#e6f5ec] via-[#f0f9f4] to-white">
 * - Removed:       <Navbar/>
 * - Removed:        Background patterns 
 * 5/25/25 - Initial version

 * - Created contact page with form validation
 * - Added team section with member cards
 * - Implemented testimonials section
 * - Added reusable form components (Input, Textarea, Button)
 * - Integrated SVG icons collection
 * 
 * 6/11/25 - Version 1.1.0
 * - Enhanced documentation with detailed component information
 * - Added comprehensive state management documentation
 * - Improved code readability with additional comments
 * - Added dependency documentation
 * - Updated form validation logic
 * - Enhanced accessibility features
 * - Optimized performance with React hooks
 * - Added responsive design improvements
 */
