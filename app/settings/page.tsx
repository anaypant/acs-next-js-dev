/**
 * File: app/settings/page.tsx
 * Purpose: Renders the user settings page with profile management, session control, notifications, security, and account deletion.
 * Author: acagliol
 * Date: 06/15/25
 * Version: 1.0.1
 */

"use client"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, User, Bell, Shield, Database, Mail, Loader2 } from "lucide-react"
import type { Session } from "next-auth"
import type { SignupProvider } from "@/app/types/auth"
import { Logo } from "@/app/dashboard/components/Sidebar"

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
  const session = sessionResult?.data as (Session & {
    user: {
      id: string
      email: string
      name: string
      authType: 'new' | 'existing'
      provider: SignupProvider
      accessToken?: string
    }
  }) | null
  const status = sessionResult?.status || "loading"
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // State for delete account dialog
  const [openDialog, setOpenDialog] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState("profile")

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)

  // Email signature state
  const [signatureForm, setSignatureForm] = useState({
    email_signature: ""
  })
  const [signatureLoading, setSignatureLoading] = useState(false)
  const [signatureError, setSignatureError] = useState<string | null>(null)
  const [signatureSuccess, setSignatureSuccess] = useState(false)

  // Automated emailing state
  const [autoEmails, setAutoEmails] = useState(true)
  const [autoEmailsLoading, setAutoEmailsLoading] = useState(false)
  const [autoEmailsError, setAutoEmailsError] = useState<string | null>(null)
  const [autoEmailsSuccess, setAutoEmailsSuccess] = useState(false)

  // Add new state for LCP AI settings
  const [lcpSettings, setLcpSettings] = useState({
    tone: "professional",
    style: "concise",
    samplePrompt: ""
  })
  const [lcpLoading, setLcpLoading] = useState(false)
  const [lcpError, setLcpError] = useState<string | null>(null)
  const [lcpSuccess, setLcpSuccess] = useState(false)

  // Initialize profile form with session data
  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(' ') || ['', '']
      setProfileForm({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: session.user.email || '',
        phone: '' // Phone will need to be fetched from database if needed
      })
    }
  }, [session])

  // Initialize signature form with session data
  useEffect(() => {
    const fetchSignature = async () => {
      // Wait for session to be loaded and authenticated
      if (status === "loading" || !session?.user?.id) {
        return;
      }

      try {
        setSignatureLoading(true);
        const requestBody = {
          table_name: 'Users',
          index_name: 'id-index',
          key_name: 'id',
          key_value: session.user.id,
        };

        const response = await fetch('/api/db/select', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          credentials: 'include',
        });

        const responseText = await response.text();
        if (!response.ok) {
          throw new Error(`Failed to fetch signature: ${response.status} ${responseText}`);
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error('Invalid response format from API');
        }

        // Check if data.items is an array and has items
        if (Array.isArray(data.items) && data.items.length > 0) {
          const signature = data.items[0].email_signature;
          const autoEmailsEnabled = data.items[0].lcp_automatic_enabled === 'true';
          setSignatureForm({ email_signature: signature || '' });
          setAutoEmails(autoEmailsEnabled);
        } else {
          setSignatureForm({ email_signature: '' });
          setAutoEmails(true); // Default to true if not set
        }
      } catch (err) {
        setSignatureError(err instanceof Error ? err.message : 'Failed to fetch signature');
      } finally {
        setSignatureLoading(false);
      }
    };

    fetchSignature();
  }, [session?.user?.id, status]);

  // Add useEffect to fetch LCP settings
  useEffect(() => {
    const fetchLcpSettings = async () => {
      if (status === "loading" || !session?.user?.id) {
        return;
      }

      try {
        setLcpLoading(true);
        const requestBody = {
          table_name: 'Users',
          index_name: 'id-index',
          key_name: 'id',
          key_value: session.user.id,
        };

        const response = await fetch('/api/db/select', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          credentials: 'include',
        });

        const responseText = await response.text();
        if (!response.ok) {
          throw new Error(`Failed to fetch LCP settings: ${response.status} ${responseText}`);
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error('Invalid response format from API');
        }

        if (Array.isArray(data.items) && data.items.length > 0) {
          const settings = data.items[0];
          setLcpSettings({
            tone: settings.lcp_tone || "professional",
            style: settings.lcp_style || "concise",
            samplePrompt: settings.lcp_sample_prompt || ""
          });
        }
      } catch (err) {
        setLcpError(err instanceof Error ? err.message : 'Failed to fetch LCP settings');
      } finally {
        setLcpLoading(false);
      }
    };

    fetchLcpSettings();
  }, [session?.user?.id, status]);

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }))
    setProfileError(null)
    setProfileSuccess(false)
  }

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return

    setProfileLoading(true)
    setProfileError(null)
    setProfileSuccess(false)

    try {
      // First update the database
      const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Users',
          index_name: 'id-index',
          key_name: 'id',
          key_value: session.user.id,
          update_data: {
            name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
            email: profileForm.email,
            phone: profileForm.phone || null,
            updated_at: new Date().toISOString()
          }
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      // If database update was successful, update the NextAuth session
      const result = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            ...session.user,
            name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
            email: profileForm.email
          }
        })
      })

      if (!result.ok) {
        throw new Error('Failed to update session')
      }

      // Update the session in the client
      await sessionResult.update({
        ...session,
        user: {
          ...session.user,
          name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
          email: profileForm.email
        }
      })

      setProfileSuccess(true)
    } catch (err: any) {
      setProfileError(err.message || 'An error occurred while updating your profile')
    } finally {
      setProfileLoading(false)
    }
  }

  // Handle signature form changes
  const handleSignatureChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setSignatureForm(prev => ({
      ...prev,
      email_signature: value
    }));
    setSignatureError(null);
    setSignatureSuccess(false);
  }

  // Handle signature update
  const handleSignatureUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return

    setSignatureLoading(true)
    setSignatureError(null)
    setSignatureSuccess(false)

    try {
      const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Users',
          index_name: 'id-index',
          key_name: 'id',
          key_value: session.user.id,
          update_data: {
            email_signature: signatureForm.email_signature,
            updated_at: new Date().toISOString()
          }
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update signature')
      }

      setSignatureSuccess(true)
    } catch (err: any) {
      setSignatureError(err.message || 'An error occurred while updating your signature')
    } finally {
      setSignatureLoading(false)
    }
  }

  // Handle automated emailing update
  const handleAutoEmailsUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!session?.user?.id) return;
    
    const newValue = e.target.checked;
    setAutoEmailsLoading(true);
    setAutoEmailsError(null);
    setAutoEmailsSuccess(false);

    try {
      // First update the user's automated emailing setting
      const userResponse = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Users',
          index_name: 'id-index',
          key_name: 'id',
          key_value: session.user.id,
          update_data: {
            lcp_automatic_enabled: newValue ? 'true' : 'false',
            updated_at: new Date().toISOString()
          }
        }),
        credentials: 'include',
      });

      if (!userResponse.ok) {
        throw new Error('Failed to update automated emailing setting');
      }

      // First get all threads for this user
      const threadsQueryResponse = await fetch('/api/db/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Threads',
          index_name: 'associated_account-index',
          key_name: 'associated_account',
          key_value: session.user.id
        }),
        credentials: 'include',
      });

      if (!threadsQueryResponse.ok) {
        throw new Error('Failed to fetch user threads');
      }

      const threadsData = await threadsQueryResponse.json();
      if (!threadsData.items || !Array.isArray(threadsData.items)) {
        throw new Error('Invalid response format for threads');
      }

      // Update each thread individually
      const updatePromises = threadsData.items.map((thread: any) => 
        fetch('/api/db/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            table_name: 'Threads',
            key_name: 'conversation_id',
            key_value: thread.conversation_id,
            index_name: 'conversation_id-index',
            update_data: {
              lcp_enabled: newValue ? 'true' : 'false'
            }
          }),
          credentials: 'include',
        })
      );

      // Wait for all updates to complete
      const updateResults = await Promise.all(updatePromises);
      const failedUpdates = updateResults.filter(res => !res.ok);
      
      if (failedUpdates.length > 0) {
        throw new Error(`Failed to update ${failedUpdates.length} threads`);
      }

      setAutoEmails(newValue);
      setAutoEmailsSuccess(true);
    } catch (err) {
      setAutoEmailsError(err instanceof Error ? err.message : 'Failed to update automated emailing setting');
    } finally {
      setAutoEmailsLoading(false);
    }
  };

  // Add handler for LCP settings update
  const handleLcpSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLcpLoading(true);
    setLcpError(null);
    setLcpSuccess(false);

    try {
      const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Users',
          index_name: 'id-index',
          key_name: 'id',
          key_value: session.user.id,
          update_data: {
            deletelcp_tone: lcpSettings.tone,
            lcp_style: lcpSettings.style,
            lcp_sample_prompt: lcpSettings.samplePrompt,
            updated_at: new Date().toISOString()
          }
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update LCP settings');
      }

      setLcpSuccess(true);
    } catch (err: any) {
      setLcpError(err.message || 'An error occurred while updating LCP settings');
    } finally {
      setLcpLoading(false);
    }
  };

  // Add handler for LCP settings change
  const handleLcpSettingsChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLcpSettings(prev => ({
      ...prev,
      [name]: value
    }));
    setLcpError(null);
    setLcpSuccess(false);
  };

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
  const handleDeleteAccount = async () => {
    try {
        const response = await fetch('/api/user/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session?.user?.id })
        });

        if (!response.ok) {
            throw new Error('Failed to delete account');
        }

        await signOut({ callbackUrl: '/' });
    } catch (error) {
        setError('Error deleting account');
    }
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
        await signOut({ callbackUrl: '/' });
    } catch (error) {
        setError('Error logging out');
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
                  setActiveSection("customize")
                  document.getElementById("customize")?.scrollIntoView({ behavior: "smooth" })
                }}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full text-left transition-all duration-200 ${
                  activeSection === "customize"
                    ? "bg-gradient-to-r from-[#0a5a2f] to-[#0e6537] text-white"
                    : "text-gray-600 hover:bg-[#0e6537]/5"
                }`}
              >
                <Mail className="h-4 w-4" />
                Customize
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
            {/* Session Information
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
            </div> */}

            {/* Profile Settings */}
            <div
              id="profile"
              className="bg-white p-6 rounded-lg border-[#d8eee1] border shadow-sm bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] scroll-mt-6"
            >
              <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                    />
                  </div>
                </div>
                {profileError && (
                  <p className="text-sm text-red-600 mt-2">{profileError}</p>
                )}
                {profileSuccess && (
                  <p className="text-sm text-green-600 mt-2">Profile updated successfully!</p>
                )}
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm disabled:opacity-50"
                >
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Customize Settings */}
            <div
              id="customize"
              className="bg-white p-6 rounded-lg border-[#d8eee1] border shadow-sm bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] scroll-mt-6"
            >
              <h2 className="text-lg font-semibold mb-4">Email Settings</h2>
              
              {/* LCP AI Customization */}
              <div className="mb-8">
                <h3 className="text-md font-semibold mb-4">LCP AI Customization</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Customize how the LCP AI generates email responses. These settings will be used as a base for all AI-generated emails.
                </p>
                <form onSubmit={handleLcpSettingsUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Tone</label>
                      <select
                        name="tone"
                        value={lcpSettings.tone}
                        onChange={handleLcpSettingsChange}
                        className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                      >
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="formal">Formal</option>
                        <option value="casual">Casual</option>
                        <option value="empathetic">Empathetic</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Sets the overall tone of AI-generated emails</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Writing Style</label>
                      <select
                        name="style"
                        value={lcpSettings.style}
                        onChange={handleLcpSettingsChange}
                        className="w-full px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                      >
                        <option value="concise">Concise</option>
                        <option value="detailed">Detailed</option>
                        <option value="conversational">Conversational</option>
                        <option value="technical">Technical</option>
                        <option value="persuasive">Persuasive</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Determines the writing style of AI-generated emails</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sample Email Prompt</label>
                    <textarea
                      name="samplePrompt"
                      value={lcpSettings.samplePrompt}
                      onChange={handleLcpSettingsChange}
                      className="w-full h-32 px-3 py-2 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537]"
                      placeholder="Enter a sample email that represents your preferred writing style..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Provide a sample email that demonstrates your preferred writing style. This helps the AI better understand your communication preferences.
                    </p>
                  </div>
                  {lcpError && (
                    <p className="text-sm text-red-600 mt-2">{lcpError}</p>
                  )}
                  {lcpSuccess && (
                    <p className="text-sm text-green-600 mt-2">LCP settings updated successfully!</p>
                  )}
                  <button
                    type="submit"
                    disabled={lcpLoading}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm disabled:opacity-50"
                  >
                    {lcpLoading ? 'Saving...' : 'Save LCP Settings'}
                  </button>
                </form>
              </div>

              {/* Automated Emailing Setting */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">Automated Emailing</p>
                    <p className="text-sm text-gray-600">
                      Allow ACS to automatically send emails on your behalf. If disabled, ACS will provide suggestions and AI responses, but will not send emails automatically.
                    </p>
                  </div>
                  <div className="flex items-center">
                    {autoEmailsLoading ? (
                      <div className="w-4 h-4 relative">
                        <Loader2 className="w-4 h-4 text-[#0e6537] animate-spin" />
                      </div>
                    ) : (
                      <input
                        type="checkbox"
                        id="autoEmails"
                        checked={autoEmails}
                        onChange={handleAutoEmailsUpdate}
                        disabled={autoEmailsLoading}
                        className="w-4 h-4 text-[#0e6537] rounded focus:ring-[#0e6537] disabled:opacity-50"
                      />
                    )}
                  </div>
                </div>
                {autoEmailsError && (
                  <p className="text-sm text-red-600 mt-2">{autoEmailsError}</p>
                )}
                {autoEmailsSuccess && (
                  <p className="text-sm text-green-600 mt-2">Automated emailing setting updated successfully!</p>
                )}
              </div>

              {/* Email Signature */}
              <div>
                <h3 className="text-md font-semibold mb-2">Email Signature</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This is your default email signature, automatically created by ACS. It will be used on all your automated emails sent through the platform. You can customize it below.
                </p>
                <form onSubmit={handleSignatureUpdate} className="space-y-4">
                  <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none rounded-t-lg"></div>
                    <textarea
                      name="email_signature"
                      value={signatureForm.email_signature}
                      onChange={handleSignatureChange}
                      className="w-full h-64 px-4 py-8 border-[#d8eee1] border rounded-lg focus:outline-none focus:ring-[#0e6537] font-mono text-sm whitespace-pre-wrap"
                      placeholder="Enter your email signature here..."
                      style={{ 
                        fontFamily: 'monospace',
                        lineHeight: '1.5',
                        tabSize: 2
                      }}
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none rounded-b-lg"></div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="inline-block w-2 h-2 bg-gray-300 rounded-full"></span>
                    <span>Preserves whitespace and formatting</span>
                  </div>
                  {signatureError && (
                    <p className="text-sm text-red-600 mt-2">{signatureError}</p>
                  )}
                  {signatureSuccess && (
                    <p className="text-sm text-green-600 mt-2">Signature updated successfully!</p>
                  )}
                  <button
                    type="submit"
                    disabled={signatureLoading}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm disabled:opacity-50"
                  >
                    {signatureLoading ? 'Saving...' : 'Save Signature'}
                  </button>
                </form>
              </div>
            </div>

            {/* Notification Settings @TODO: Implement */}
            {/* <div
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
            </div> */}

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
              <p className="text-sm text-gray-500 mb-4">
                Please type <span className="font-bold">{session?.user?.email}</span> to delete:
              </p>
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
 * 06/15/25 - Version 1.0.1
 * - Removed: -- a/app/settings/page.tsx
 * - Added: ++ b/app/settings/page.tsx
 * - Removed: function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
 * - Removed:   return (
 * - Removed:     <div className="flex items-center gap-2">
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
