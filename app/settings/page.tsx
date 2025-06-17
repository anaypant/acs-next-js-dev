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
import { ArrowLeft, User, Bell, Shield, Database, Mail, Loader2, Globe, Clock, Eye, Palette, Smartphone, Building, MapPin, FileText, Trash2, CheckCircle, XCircle, AlertCircle, Settings as SettingsIcon, LogOut } from "lucide-react"
import type { Session } from "next-auth"
import type { SignupProvider } from "@/app/types/auth"
import { Logo } from "@/app/dashboard/components/Sidebar"
import { clearAuthData } from '../utils/auth'

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
    name: "",
    email: "",
    phone: ""
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)

  // Bio information state (from new-user flow)
  const [bioForm, setBioForm] = useState({
    bio: "",
    location: "",
    state: "",
    country: "",
    zipcode: "",
    company: "",
    jobTitle: ""
  })
  const [bioLoading, setBioLoading] = useState(false)
  const [bioError, setBioError] = useState<string | null>(null)
  const [bioSuccess, setBioSuccess] = useState(false)

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

  // New settings state
  const [preferencesForm, setPreferencesForm] = useState({
    timezone: "America/New_York",
    language: "en",
    theme: "system",
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    dataSharing: false
  })
  const [preferencesLoading, setPreferencesLoading] = useState(false)
  const [preferencesError, setPreferencesError] = useState<string | null>(null)
  const [preferencesSuccess, setPreferencesSuccess] = useState(false)

  // Security settings state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false
  })
  const [securityLoading, setSecurityLoading] = useState(false)
  const [securityError, setSecurityError] = useState<string | null>(null)
  const [securitySuccess, setSecuritySuccess] = useState(false)

  // Add loading state for data fetching
  const [dataLoading, setDataLoading] = useState(true);

  // Initialize profile form with session data
  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(' ') || ['', '']
      setProfileForm({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '' // Phone will be fetched from database
      })
    }
  }, [session])

  // Update the data fetching useEffect to include loading state
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === "loading" || !session?.user?.id) {
        return;
      }

      setDataLoading(true);
      try {
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
          throw new Error(`Failed to fetch user data: ${response.status} ${responseText}`);
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error('Invalid response format from API');
        }

        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          const userData = data.items[0];
          
          // Set profile information
          const phone = userData.phone || '';
          setProfileForm(prev => ({ ...prev, phone }));
          
          // Set signature and auto emails
          const signature = userData.email_signature || '';
          const autoEmailsEnabled = userData.lcp_automatic_enabled === 'true';
          setSignatureForm({ email_signature: signature });
          setAutoEmails(autoEmailsEnabled);
          
          // Set LCP settings
          setLcpSettings({
            tone: userData.lcp_tone || "professional",
            style: userData.lcp_style || "concise",
            samplePrompt: userData.lcp_sample_prompt || ""
          });
          
          // Set bio information
          setBioForm({
            bio: userData.bio || "",
            location: userData.location || "",
            state: userData.state || "",
            country: userData.country || "",
            zipcode: userData.zipcode || "",
            company: userData.company || "",
            jobTitle: userData.job_title || ""
          });

          // Set preferences (with defaults)
          setPreferencesForm({
            timezone: userData.timezone || "America/New_York",
            language: userData.language || "en",
            theme: userData.theme || "system",
            emailNotifications: userData.email_notifications !== 'false',
            smsNotifications: userData.sms_notifications === 'true',
            marketingEmails: userData.marketing_emails === 'true',
            dataSharing: userData.data_sharing === 'true'
          });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        // Set error states for individual sections if needed
        setSignatureError(err instanceof Error ? err.message : 'Failed to fetch user data');
        setLcpError(err instanceof Error ? err.message : 'Failed to fetch user data');
      } finally {
        setDataLoading(false);
      }
    };

    fetchUserData();
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

  // Handle bio form changes
  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBioForm(prev => ({
      ...prev,
      [name]: value
    }))
    setBioError(null)
    setBioSuccess(false)
  }

  // Handle preferences form changes
  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setPreferencesForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setPreferencesError(null)
    setPreferencesSuccess(false)
  }

  // Handle security form changes
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSecurityForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setSecurityError(null)
    setSecuritySuccess(false)
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
            name: profileForm.name,
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

      // Update the session in the client
      await sessionResult.update({
        ...session,
        user: {
          ...session.user,
          name: profileForm.name,
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

  // Show loading screen while fetching user data
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0e6537] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    )
  }

  /**
   * Handles account deletion initiation
   * Opens the confirmation dialog
   */
  const handleDeleteAccount = async () => {
    try {
        const response = await fetch('/api/auth/delete', {
            method: 'POST',
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
        // Clear session_id cookie before signing out
        clearAuthData()
        await signOut({ callbackUrl: '/' });
    } catch (error) {
        setError('Error logging out');
    }
  }

  // Handle bio update
  const handleBioUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return

    setBioLoading(true)
    setBioError(null)
    setBioSuccess(false)

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
            bio: bioForm.bio,
            location: bioForm.location,
            state: bioForm.state,
            country: bioForm.country,
            zipcode: bioForm.zipcode,
            company: bioForm.company || null,
            job_title: bioForm.jobTitle || null,
            updated_at: new Date().toISOString()
          }
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update bio information')
      }

      setBioSuccess(true)
    } catch (err) {
      setBioError(err instanceof Error ? err.message : 'Failed to update bio information')
    } finally {
      setBioLoading(false)
    }
  }

  // Handle preferences update
  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return

    setPreferencesLoading(true)
    setPreferencesError(null)
    setPreferencesSuccess(false)

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
            timezone: preferencesForm.timezone,
            language: preferencesForm.language,
            theme: preferencesForm.theme,
            email_notifications: preferencesForm.emailNotifications ? 'true' : 'false',
            sms_notifications: preferencesForm.smsNotifications ? 'true' : 'false',
            marketing_emails: preferencesForm.marketingEmails ? 'true' : 'false',
            data_sharing: preferencesForm.dataSharing ? 'true' : 'false',
            updated_at: new Date().toISOString()
          }
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update preferences')
      }

      setPreferencesSuccess(true)
    } catch (err) {
      setPreferencesError(err instanceof Error ? err.message : 'Failed to update preferences')
    } finally {
      setPreferencesLoading(false)
    }
  }

  // Handle security update
  const handleSecurityUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return

    setSecurityLoading(true)
    setSecurityError(null)
    setSecuritySuccess(false)

    try {
      // Validate passwords
      if (securityForm.newPassword && securityForm.newPassword !== securityForm.confirmPassword) {
        throw new Error('New passwords do not match')
      }

      if (securityForm.newPassword && securityForm.newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }

      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      // Only update password if provided
      if (securityForm.newPassword) {
        updateData.password = securityForm.newPassword
      }

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
          update_data: updateData
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update security settings')
      }

      setSecuritySuccess(true)
      // Clear password fields
      setSecurityForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (err) {
      setSecurityError(err instanceof Error ? err.message : 'Failed to update security settings')
    } finally {
      setSecurityLoading(false)
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
              {/* Profile & Bio Section */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Profile</h3>
                <div className="space-y-1">
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
                    Basic Info
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection("bio")
                      document.getElementById("bio")?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full text-left transition-all duration-200 ${
                      activeSection === "bio"
                        ? "bg-gradient-to-r from-[#0a5a2f] to-[#0e6537] text-white"
                        : "text-gray-600 hover:bg-[#0e6537]/5"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    Bio & Location
                  </button>
                </div>
              </div>

              {/* Communication Section */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Communication</h3>
                <div className="space-y-1">
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
                    Email Settings
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
                </div>
              </div>

              {/* Preferences Section */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preferences</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveSection("preferences")
                      document.getElementById("preferences")?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg w-full text-left transition-all duration-200 ${
                      activeSection === "preferences"
                        ? "bg-gradient-to-r from-[#0a5a2f] to-[#0e6537] text-white"
                        : "text-gray-600 hover:bg-[#0e6537]/5"
                    }`}
                  >
                    <Palette className="h-4 w-4" />
                    App Settings
                  </button>
                </div>
              </div>

              {/* Security Section */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Security</h3>
                <div className="space-y-1">
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
                    Password & Security
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Account</h3>
                <div className="space-y-1">
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
                </div>
              </div>
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
              className="bg-white p-6 rounded-xl border border-green-100 shadow-lg hover:shadow-2xl transition-shadow duration-200 bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] scroll-mt-6"
            >
              <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
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
                      className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
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
                      className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
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

            {/* Bio Information Settings */}
            <div
              id="bio"
              className="bg-white p-6 rounded-xl border border-green-100 shadow-lg hover:shadow-2xl transition-shadow duration-200 bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] scroll-mt-6"
            >
              <h2 className="text-lg font-semibold mb-4">Bio & Location Information</h2>
              <form onSubmit={handleBioUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={bioForm.bio}
                    onChange={handleBioChange}
                    className="w-full h-24 px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={bioForm.company}
                      onChange={handleBioChange}
                      className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={bioForm.jobTitle}
                      onChange={handleBioChange}
                      className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
                      placeholder="Your job title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City/Location</label>
                    <input
                      type="text"
                      name="location"
                      value={bioForm.location}
                      onChange={handleBioChange}
                      className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
                      placeholder="Your city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={bioForm.state}
                      onChange={handleBioChange}
                      className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
                      placeholder="Your state or province"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      name="country"
                      value={bioForm.country}
                      onChange={handleBioChange}
                      className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
                    >
                      <option value="">Select Country</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Spain">Spain</option>
                      <option value="Italy">Italy</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip/Postal Code</label>
                    <input
                      type="text"
                      name="zipcode"
                      value={bioForm.zipcode}
                      onChange={handleBioChange}
                      className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
                      placeholder="Your zip or postal code"
                    />
                  </div>
                </div>

                {bioError && (
                  <p className="text-sm text-red-600 mt-2">{bioError}</p>
                )}
                {bioSuccess && (
                  <p className="text-sm text-green-600 mt-2">Bio information updated successfully!</p>
                )}
                <button
                  type="submit"
                  disabled={bioLoading}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm disabled:opacity-50"
                >
                  {bioLoading ? 'Saving...' : 'Save Bio Information'}
                </button>
              </form>
            </div>

            {/* Customize Settings */}
            <div
              id="customize"
              className="bg-white p-6 rounded-xl border border-green-100 shadow-lg hover:shadow-2xl transition-shadow duration-200 bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] scroll-mt-6"
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
                        className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
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
                        className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
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
                      className="w-full h-32 px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
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
                      className="w-full h-64 px-4 py-8 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
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

            {/* Notification Settings */}
            <div
              id="notifications"
              className="bg-white p-6 rounded-xl border border-green-100 shadow-lg hover:shadow-2xl transition-shadow duration-200 bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] scroll-mt-6"
            >
              <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
              <form onSubmit={handlePreferencesUpdate} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive email notifications for important updates</p>
                    </div>
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={preferencesForm.emailNotifications}
                      onChange={handlePreferencesChange}
                      className="w-4 h-4 text-[#0e6537] rounded focus:ring-[#0e6537]"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Get SMS alerts for urgent matters</p>
                    </div>
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={preferencesForm.smsNotifications}
                      onChange={handlePreferencesChange}
                      className="w-4 h-4 text-[#0e6537] rounded focus:ring-[#0e6537]"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
                    </div>
                    <input
                      type="checkbox"
                      name="marketingEmails"
                      checked={preferencesForm.marketingEmails}
                      onChange={handlePreferencesChange}
                      className="w-4 h-4 text-[#0e6537] rounded focus:ring-[#0e6537]"
                    />
                  </div>
                </div>
                {preferencesError && (
                  <p className="text-sm text-red-600 mt-2">{preferencesError}</p>
                )}
                {preferencesSuccess && (
                  <p className="text-sm text-green-600 mt-2">Notification preferences updated successfully!</p>
                )}
                <button
                  type="submit"
                  disabled={preferencesLoading}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm disabled:opacity-50"
                >
                  {preferencesLoading ? 'Saving...' : 'Save Notification Preferences'}
                </button>
              </form>
            </div>

            {/* App Preferences Settings */}
            <div
              id="preferences"
              className="bg-white p-6 rounded-xl border border-green-100 shadow-lg hover:shadow-2xl transition-shadow duration-200 bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] scroll-mt-6"
            >
              <h2 className="text-lg font-semibold mb-4">App Settings</h2>
              <form onSubmit={handlePreferencesUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      name="timezone"
                      value={preferencesForm.timezone}
                      onChange={handlePreferencesChange}
                      className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="America/Anchorage">Alaska Time (AKT)</option>
                      <option value="Pacific/Honolulu">Hawaii Time (HST)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                      <option value="Australia/Sydney">Sydney (AEST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      name="language"
                      value={preferencesForm.language}
                      onChange={handlePreferencesChange}
                      className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="it">Italiano</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select
                    name="theme"
                    value={preferencesForm.theme}
                    onChange={handlePreferencesChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
                  >
                    <option value="system">System Default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Data Sharing</p>
                    <p className="text-sm text-gray-600">Allow us to use your data to improve our services (anonymized)</p>
                  </div>
                  <input
                    type="checkbox"
                    name="dataSharing"
                    checked={preferencesForm.dataSharing}
                    onChange={handlePreferencesChange}
                    className="w-4 h-4 text-[#0e6537] rounded focus:ring-[#0e6537]"
                  />
                </div>

                {preferencesError && (
                  <p className="text-sm text-red-600 mt-2">{preferencesError}</p>
                )}
                {preferencesSuccess && (
                  <p className="text-sm text-green-600 mt-2">App settings updated successfully!</p>
                )}
                <button
                  type="submit"
                  disabled={preferencesLoading}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm disabled:opacity-50"
                >
                  {preferencesLoading ? 'Saving...' : 'Save App Settings'}
                </button>
              </form>
            </div>

            {/* Security Settings */}
            <div
              id="security"
              className="bg-white p-6 rounded-xl border border-green-100 shadow-lg hover:shadow-2xl transition-shadow duration-200 bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] scroll-mt-6"
            >
              <h2 className="text-lg font-semibold mb-4">Password & Security</h2>
              <form onSubmit={handleSecurityUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
                    placeholder="Enter your current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={securityForm.newPassword}
                    onChange={handleSecurityChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
                    placeholder="Enter your new password"
                  />
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={securityForm.confirmPassword}
                    onChange={handleSecurityChange}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg bg-[#f7fcfa] focus:outline-none focus:ring-2 focus:ring-[#0e6537] focus:border-[#0e6537] transition-all duration-150 shadow-sm placeholder-gray-400"
                    placeholder="Confirm your new password"
                  />
                </div>
                {securityError && (
                  <p className="text-sm text-red-600 mt-2">{securityError}</p>
                )}
                {securitySuccess && (
                  <p className="text-sm text-green-600 mt-2">Password updated successfully!</p>
                )}
                <button
                  type="submit"
                  disabled={securityLoading}
                  className="px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm disabled:opacity-50"
                >
                  {securityLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Danger Zone */}
            <div id="danger" className="bg-red-50 p-6 rounded-xl border-2 border-red-200 shadow-sm scroll-mt-6">
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
