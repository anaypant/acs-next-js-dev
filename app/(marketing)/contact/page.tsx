/**
 * File: app/contact/page.tsx
 * Purpose: Renders the contact page with a contact form, team section, and testimonials.
 * Author: acagliol
 * Date: 06/15/25
 * Version: 1.2.0
 */

"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Users, Zap, Target, Quote, AlertTriangle } from "lucide-react"

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
      role: "Chief Executive Officer",
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
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.div
      className="overflow-hidden rounded-xl bg-card p-8 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Meet Our Team</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-primary to-secondary"></div>
        <p className="mt-4 text-muted-foreground">
          Our dedicated team of professionals is committed to providing exceptional service and innovative solutions.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-accent to-accent/50">
              {member.isCoFounder && (
                <span className="absolute top-4 left-4 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">Co-Founder</span>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-3xl font-bold text-secondary">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-white bg-transparent text-white hover:bg-white hover:text-primary"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </div>
            </div>
            <div className="p-6 text-center">
              <h3 className="mb-1 text-xl font-semibold text-card-foreground">{member.name}</h3>
              <p className="text-sm font-medium text-secondary">{member.role}</p>
              {member.isCoFounder && (
                <div className="mt-2 hidden md:block">
                  <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary">
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
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.div
      className="overflow-hidden rounded-xl bg-card p-8 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-semibold text-card-foreground">What Our Clients Say</h2>
        <div className="h-1 w-16 bg-gradient-to-r from-secondary to-primary"></div>
        <p className="mt-4 text-muted-foreground">
          Don't just take our word for it. Here's what our clients have to say about working with ACS:
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="relative rounded-lg border border-border bg-gradient-to-br from-card to-accent p-6 shadow-sm"
            variants={itemVariants}
          >
            <div className="absolute -top-3 -left-3 rounded-full bg-secondary p-2 text-secondary-foreground">
              <Quote className="h-4 w-4" />
            </div>
            <p className="mb-4 italic text-muted-foreground">"{testimonial.quote}"</p>
            <div className="mt-4 border-t border-border pt-4">
              <p className="font-medium text-card-foreground">{testimonial.author}</p>
              <p className="text-sm text-muted-foreground">
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
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-b from-accent via-accent/50 to-background">
        {/* Background patterns */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle gradient circles */}
          <div className="absolute -top-[15%] -right-[15%] h-[50%] w-[50%] rounded-full bg-secondary/5 blur-3xl" />
          <div className="absolute top-[60%] -left-[10%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-3xl" />
          <div className="absolute -bottom-[10%] right-[20%] h-[30%] w-[30%] rounded-full bg-primary/5 blur-3xl" />

          {/* Add a subtle dot pattern instead */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(var(--secondary) 1px, transparent 1px)`,
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
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Contact Us
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
              We're here to help and answer any questions you might have. We look forward to hearing from you.
            </p>
          </motion.div>

          <div className="mx-auto max-w-6xl">
            {/* Contact Form and Information */}
            <div className="grid gap-4 sm:gap-8 md:grid-cols-12">
              {/* Contact Information */}
              <motion.div className="md:col-span-5 lg:col-span-4" variants={itemVariants}>
                <div className="rounded-xl bg-card p-4 sm:p-8 shadow-lg">
                  <div className="mb-6 sm:mb-8">
                    <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold text-card-foreground">Get in Touch</h2>
                    <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-secondary to-primary"></div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="rounded-full bg-accent p-2 sm:p-3 text-secondary">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-medium text-card-foreground">Our Location</h3>
                        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                          501 North Capitol Avenue
                          <br />
                          Indianapolis, IN 46204
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="rounded-full bg-accent p-2 sm:p-3 text-secondary">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-medium text-card-foreground">Email</h3>
                        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">support@automatedconsultancy.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="rounded-full bg-accent p-2 sm:p-3 text-secondary">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-medium text-card-foreground">Business Hours</h3>
                        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                          Monday - Friday: 8am - 6pm
                          <br />
                          Saturday: 10am - 4pm
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn Button with improved styling */}
                  <div className="mt-8 pt-6 border-t border-border">
                    <a
                      href="https://www.linkedin.com/company/automated-consultancy-services/posts/?feedView=all"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="!text-white inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#0077b5] to-[#005885] px-6 py-3 rounded-lg hover:from-[#005885] hover:to-[#004065] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      Follow us on LinkedIn
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div className="md:col-span-7 lg:col-span-8" variants={itemVariants}>
                <div className="rounded-xl bg-card p-4 sm:p-8 shadow-lg">
                  {isSubmitted ? (
                    <motion.div
                      className="flex flex-col items-center justify-center py-8 sm:py-16 text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="mb-4 sm:mb-6 rounded-full bg-accent p-3 sm:p-4">
                        <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-secondary" />
                      </div>
                      <h2 className="mb-2 text-xl sm:text-2xl font-bold text-card-foreground">Message Sent Successfully!</h2>
                      <p className="mb-6 sm:mb-8 max-w-md text-sm sm:text-base text-muted-foreground">
                        Thank you for reaching out to us. We've received your message and will get back to you as soon as
                        possible.
                      </p>
                      <Button
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="overflow-hidden">
                      <div className="mb-6 sm:mb-8">
                        <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold text-card-foreground">Send Us a Message</h2>
                        <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-secondary to-primary"></div>
                        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
                          Fill out the form below, and we'll be in touch as soon as possible.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                              Name
                            </label>
                            <Input
                              type="text"
                              id="name"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter your name"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                              Email
                            </label>
                            <Input
                              type="email"
                              id="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                            Subject
                          </label>
                          <Input
                            type="text"
                            id="subject"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Enter message subject"
                          />
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                            Message
                          </label>
                          <Textarea
                            id="message"
                            name="message"
                            rows={4}
                            required
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
                            className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
                            checked={formData.isDemoRequest}
                            onChange={handleChange}
                          />
                          <label htmlFor="isDemoRequest" className="ml-2 block text-sm text-foreground">
                            Request a demo
                          </label>
                        </div>
                        {apiError && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{apiError}</AlertDescription>
                          </Alert>
                        )}
                        {apiSuccess && (
                          <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>
                              Message sent successfully! We'll get back to you soon.
                            </AlertDescription>
                          </Alert>
                        )}
                        <div>
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r text-muted from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                          >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* FAQ Section */}
            <motion.div className="mt-6 sm:mt-8 overflow-hidden rounded-xl bg-card p-4 sm:p-8 shadow-lg" variants={itemVariants}>
              <div className="mb-6">
                <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold text-card-foreground">Frequently Asked Questions</h2>
                <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-secondary to-primary"></div>
              </div>

              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {[
                  {
                    q: "What services does ACS provide?",
                    a: "ACS offers a comprehensive range of services including consulting, implementation, and support for businesses of all sizes.",
                  },
                  {
                    q: "How quickly can I expect a response?",
                    a: "We aim to respond to all inquiries within 24 business hours.",
                  },
                  {
                    q: "Do you offer virtual consultations?",
                    a: "Yes, we offer both in-person and virtual consultations to accommodate your preferences and location.",
                  },
                  {
                    q: "What are your payment terms?",
                    a: "Currently, ACS operates on a case-by-case basis. We are open to discussing payment options with our clients depending on their needs.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border p-4 sm:p-6 transition-all hover:border-secondary/20 hover:shadow-sm"
                  >
                    <h3 className="mb-2 sm:mb-3 text-base sm:text-lg font-medium text-card-foreground">{faq.q}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

/**
 * Change Log:
 * 06/15/25 - Version 1.2.0
 * - Fixed Framer Motion type errors by adding "as const" to animation types
 * - Replaced hardcoded colors with theme CSS variables
 * - Updated background gradients to use theme colors
 * - Updated border colors to use theme border variables
 * - Updated text colors to use theme foreground variables
 * - Updated accent colors to use theme accent variables
 * - Updated button gradients to use theme primary/secondary colors
 * - Fixed typo in "Chief Executive Officer"
 * - Maintained all responsive design and functionality
 * 
 * 06/15/25 - Version 1.1.2
 * - Removed duplicate Footer component (footer is now handled by PageLayout)
 * - Improved LinkedIn button styling with proper LinkedIn brand colors
 * - Added better spacing and visual separation for LinkedIn button
 * - Enhanced button hover effects and transitions
 * - Updated submit button with gradient and hover effects
 * 
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
