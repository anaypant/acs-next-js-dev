/**
 * File: app/settings/page.tsx
 * Purpose: Renders the user settings page with profile management, session control, notifications, security, and account deletion.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, User, Bell, Shield, Database } from "lucide-react"

/**
 * Logo Component
 * Renders the ACS logo with customizable size
 * 
 * @param {Object} props - Component props
 * @param {("sm"|"lg")} [props.size="sm"] - Size variant of the logo
 * @returns {JSX.Element} ACS logo with gradient styling
 */
function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-lg flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-sm">ACS</span>
      </div>
      <span className="font-bold text-lg bg-gradient-to-r from-[#0a5a2f] to-[#157a42] bg-clip-text text-transparent">
        ACS
      </span>
    </div>
  )
}

/**
 * Error handling function for 404 redirection
 * Logs error and redirects to 404 page
 * 
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {any} router - Next.js router instance
 */
const goto404 = (code: string, message: string, router: any) => {
  console.error(`${code}: ${message}`)
  router.push("/404")
}

/**
 * SettingsPage Component
 * Main settings page with user profile management and account controls
 * 
 * Features:
 * - Profile information management
 * - Session information display
 * - Notification preferences
 * - Security settings
 * - Account deletion
 * 
 * State Management:
 * - Session handling
 * - Form states
 * - Loading states
 * - Error handling
 * - Navigation state
 * 
 * @returns {JSX.Element} Complete settings page with all sections
 */
export default function SettingsPage() {
  const sessionResult = useSession()
  const session = sessionResult?.data
  const status = sessionResult?.status || "loading"
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // State for delete account dialog
  const [openDialog, setOpenDialog] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState("profile")

  // Handle mounting state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check authentication status
  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      goto404("405", "User not found", router)
    }
  }, [status, router, mounted])

  // Handle scroll-based section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["session", "profile", "notifications", "security", "danger"]
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) {
    return null // Return null on server-side and first render
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0e6537] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  /**
   * Handles account deletion initiation
   * Opens the confirmation dialog
   */
  const handleDeleteAccount = () => {
    setOpenDialog(true)
  }

  /**
   * Closes the delete account dialog
   * Resets form state
   */
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEmailInput("")
    setError(null)
  }

  /**
   * Handles email verification for account deletion
   * Makes API call to delete account and handles response
   * 
   * @throws {Error} If deletion fails or user not found
   */
  const handleEmailVerification = async () => {
    if (!session) {
      goto404("405", "User not found", router)
      return
    }

    const user = session.user
    if (user) {
      console.log("session:", user.email)
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || "Failed to delete account.")
        setLoading(false)
        return
      }

      // Clear any stored data in localStorage/sessionStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("next-auth.session-token")
        sessionStorage.removeItem("next-auth.session-token")
      }

      // Close the dialog
      setOpenDialog(false)

      // Show success message briefly before redirect
      setError(null)
      setLoading(false)

      // Force a hard reload to clear any remaining state
      if (typeof window !== "undefined") {
        window.location.href = "/"
      }
    } catch (err) {
      console.error("Delete account error:", err)
      setError("An unexpected error occurred.")
      setLoading(false)
    }
  }

  /**
   * Handles navigation back to dashboard
   */
  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  /**
   * Handles user logout
   * Clears session data and redirects to home
   * 
   * @throws {Error} If logout fails
   */
  const handleLogout = async () => {
    try {
      // Clear session_id cookie
      if (typeof document !== "undefined") {
        document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      }

      // Sign out from NextAuth
      await signOut({
        callbackUrl: "/",
        redirect: true,
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Logo />
          <button
            onClick={handleBackToDashboard}
            className="p-2 hover:bg-gradient-to-r hover:from-[#0e6537]/10 hover:to-[#157a42]/10 transition-all duration-200 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="bg-white p-4 rounded-lg border-[#d8eee1] border shadow-sm h-fit sticky top-6">
            <nav className="space-y-2">
              <button
                onClick={() => {
                  setActiveSection("profile")
                  document.getElementById("profile")?.scrollIntoView({ behavior: "smooth" })
                }}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full text-left transition-all duration-200 ${
                  activeSection === "profile"
                    ? "bg-gradient-to-r from-[#0a5a2f] to-[#0e6537] text-white"
                    : "text-gray-600 hover:bg-[#0e6537]/5"
                }`}
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <button
                onClick={() => {
                  setActiveSection("session")
                  document.getElementById("session")?.scrollIntoView({ behavior: "smooth" })
                }}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full text-left transition-all duration-200 ${
                  activeSection === "session"
                    ? "bg-gradient-to-r from-[#0a5a2f] to-[#0e6537] text-white"
                    : "text-gray-600 hover:bg-[#0e6537]/5"
                }`}
              >
                <Shield className="h-4 w-4" />
                Session
              </button>
              <button
                onClick={() => {
                  setActiveSection("notifications")
                  document.getElementById("notifications")?.scrollIntoView({ behavior: "smooth" })
                }}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full text-left transition-all duration-200 ${
                  activeSection === "notifications"
                    ? "bg-gradient-to-r from-[#0a5a2f] to-[#0e6537] text-white"
                    : "text-gray-600 hover:bg-[#0e6537]/5"
                }`}
              >
                <Bell className="h-4 w-4" />
                Notifications
              </button>
              <button
                onClick={() => {
                  setActiveSection("security")
                  document.getElementById("security")?.scrollIntoView({ behavior: "smooth" })
                }}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full text-left transition-all duration-200 ${
                  activeSection === "security"
                    ? "bg-gradient-to-r from-[#0a5a2f] to-[#0e6537] text-white"
                    : "text-gray-600 hover:bg-[#0e6537]/5"
                }`}
              >
                <Shield className="h-4 w-4" />
                Security
              </button>
              <button
                onClick={() => {
                  setActiveSection("danger")
                  document.getElementById("danger")?.scrollIntoView({ behavior: "smooth" })
                }}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full text-left transition-all duration-200 ${
                  activeSection === "danger"
                    ? "bg-gradient-to-r from-[#0a5a2f] to-[#0e6537] text-white"
                    : "text-gray-600 hover:bg-[#0e6537]/5"
                }`}
              >
                <Database className="h-4 w-4" />
                Danger Zone
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Session Information */}
            <div
              id="session"
              className="bg-white p-6 rounded-lg border-[#d8eee1] border shadow-sm bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] scroll-mt-6"
            >
              <h2 className="text-lg font-semibold mb-4">Session Information</h2>
              <div className="space-y-3">
                {session?.user &&
                  Object.entries(session.user).map(([key, value]) => (
                    <div key={key} className="flex gap-4">
                      <span className="text-sm font-medium text-gray-700 min-w-[120px] capitalize">{key}:</span>
                      <span className="text-sm text-gray-600">{String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Profile Settings */}
            <div
              id="profile"
              className="bg-white p-6 rounded-lg border-[#d8eee1] border shadow-sm bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] scroll-mt-6"
            >
              <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue="Sarah"
                    className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Johnson"
                    className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={session?.user?.email || "sarah.johnson@realty.com"}
                    className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue="(555) 123-4567"
                    className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                  />
                </div>
              </div>
              <button className="mt-4 px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm">
                Save Changes
              </button>
            </div>

            {/* Notification Settings */}
            <div
              id="notifications"
              className="bg-white p-6 rounded-lg border-[#d8eee1] border shadow-sm bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] scroll-mt-6"
            >
              <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Lead Notifications</p>
                    <p className="text-sm text-gray-600">Get notified when new leads come in</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0e6537]" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Reminders</p>
                    <p className="text-sm text-gray-600">Receive email reminders for follow-ups</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0e6537]" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Get SMS alerts for urgent matters</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-[#0e6537]" />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div
              id="security"
              className="bg-white p-6 rounded-lg border-[#d8eee1] border shadow-sm bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] scroll-mt-6"
            >
              <h2 className="text-lg font-semibold mb-4">Security</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                  />
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm">
                  Update Password
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div id="danger" className="bg-red-50 p-6 rounded-lg border-2 border-red-200 shadow-sm scroll-mt-6">
              <h2 className="text-lg font-semibold mb-2 text-red-800">Danger Zone</h2>
              <p className="text-sm text-red-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account Confirmation Dialog */}
        {openDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg border-[#d8eee1] border shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Delete Account</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <p className="text-sm text-gray-500 mb-4">Please type your email address to confirm:</p>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537] mb-4"
              />
              {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCloseDialog}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmailVerification}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Change Log:
 * 5/25/25 - Initial version
 * - Created settings page with profile management
 * - Implemented session information display
 * - Added notification preferences
 * - Integrated security settings
 * - Added account deletion functionality
 * - Implemented responsive navigation
 * - Added loading and error states
 * - Enhanced UI with animations and transitions
 */
