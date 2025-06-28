'use client';

// This page is currently disabled and will be used in the future to handle new user onboarding
// Redirecting to dashboard instead

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/local-api-config';
import { goto404 } from '../utils/error';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Globe, CheckCircle2, ArrowRight, XCircle, AlertTriangle, Info } from 'lucide-react';
import Step1Welcome from './steps/Step1Welcome';
import Step2Profile from './steps/Step2Profile';
import Step3EmailSetup from './steps/Step2EmailSetup';
import Step4LCPSettings from './steps/Step4LCPSettings';
import Step5Settings from './steps/Step5Settings';
import { useNewUser } from './useNewUser';
import { PageLayout } from '@/components/common/Layout/PageLayout';
import { LoadingSpinner } from '@/components/common/Feedback/LoadingSpinner';
import { apiClient } from '@/lib/api/client';

interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  isNewUser?: boolean;
}

interface UserData {
  signature?: string;
  smsEnabled?: boolean;
  phone?: string;
  autoEmails?: boolean;
  [key: string]: any;
}

const stepVariants = {
    hidden: { opacity: 0, x: 200 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -200 },
};

export default function NewUserPage() {
    const router = useRouter();
    const { data: session, status } = useSession() as { data: { user: SessionUser } | null, status: string };
    
    const {
        step,
        loading,
        error,
        nextStep,
        prevStep,
        profileData,
        setProfileData,
        handleProfileSubmit,
        emailData,
        setEmailData,
        handleEmailSubmit,
        lcpSettings,
        setLcpSettings,
        handleLcpSettingsSubmit,
        settingsData,
        setSettingsData,
        handleSettingsSubmit,
        handleCompleteSetup
    } = useNewUser();

    // Redirect if not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    // Show loading while checking authentication
    if (status === 'loading' || loading) {
        return (
            <PageLayout showNavbar={false} showFooter={false}>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <LoadingSpinner size="lg" text="Loading..." />
                </div>
            </PageLayout>
        );
    }

    // Show error if any
    if (error) {
        return (
            <PageLayout showNavbar={false} showFooter={false}>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1Welcome onContinue={nextStep} />;
            case 2:
                return (
                    <Step2Profile
                        data={profileData}
                        setData={setProfileData}
                        onContinue={handleProfileSubmit}
                        onBack={prevStep}
                        loading={loading}
                    />
                );
            case 3:
                return (
                    <Step3EmailSetup
                        data={emailData}
                        setData={setEmailData}
                        onContinue={handleEmailSubmit}
                        onBack={prevStep}
                        loading={loading}
                    />
                );
            case 4:
                const lcpSettingsData = {
                    tone: lcpSettings.lcp_tone,
                    style: lcpSettings.lcp_style,
                    samplePrompt: lcpSettings.lcp_sample_prompt
                };
                const setLcpSettingsData = (newData: { tone: string, style: string, samplePrompt: string }) => {
                    setLcpSettings({
                        lcp_tone: newData.tone,
                        lcp_style: newData.style,
                        lcp_sample_prompt: newData.samplePrompt
                    });
                };
                return (
                    <Step4LCPSettings
                        data={lcpSettingsData}
                        setData={setLcpSettingsData}
                        onContinue={handleLcpSettingsSubmit}
                        onBack={prevStep}
                        loading={loading}
                    />
                );
            case 5:
                return (
                    <Step5Settings 
                        data={settingsData} 
                        setData={setSettingsData} 
                        onContinue={handleSettingsSubmit} 
                        onBack={prevStep} 
                        loading={loading} 
                    />
                );
            case 6:
                // Final step - complete setup
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                Setup Complete!
                            </h1>
                            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                                Congratulations! Your ACS account has been successfully configured. 
                                You're now ready to start using our automated consultancy services.
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
                            <h2 className="text-2xl font-semibold mb-4 text-white">
                                What's Next?
                            </h2>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    You can now access your dashboard and start:
                                </p>
                                <ul className="space-y-2">
                                    <li>• Managing your conversations</li>
                                    <li>• Setting up automated responses</li>
                                    <li>• Tracking your leads and conversions</li>
                                    <li>• Customizing your communication preferences</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCompleteSetup}
                                disabled={loading}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Redirecting...' : 'Go to Dashboard'}
                            </motion.button>
                        </div>
                    </motion.div>
                );
            default:
                return <Step1Welcome onContinue={nextStep} />;
        }
    };

    return (
        <PageLayout showNavbar={false} showFooter={false}>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </PageLayout>
    );
}

/*
Original implementation commented out for future use:

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/local-api-config';
import { goto404 } from '../utils/error';
import { useEffect, useState } from 'react';

export default function NewUserPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseEmail, setResponseEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === 'unauthenticated') {
          goto404('401', 'No active session found', router);
          return;
        }

        if (!session?.user?.email) {
          return;
        }

        const response = await fetch(`${config.API_URL}/db/select`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            table_name: 'Users',
            key_name: 'id',
            key_value: session.user.id,
          }),
        });

        if (!response.ok) {
          throw new Error(`Database query failed with status ${response.status}`);
        }

        const result = await response.json();
        if (Array.isArray(result) && result.length > 1) {
          goto404('500', 'Multiple entries found for this user', router);
          return;
        }
        setData(result[0] || null);
        setResponseEmail(result[0]?.responseEmail || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
        // goto404('500', 'Failed to fetch user data', router);
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') {
      fetchData();
    }
  }, [session, status, router]);

  const handleCustomizeEmail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/db/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Users',
          key_name: 'id',
          key_value: session?.user?.email,
          update_data: {
            responseEmail: responseEmail
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update email');
      }

      // After successful update, redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating email:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A2F1F] text-white p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A2F1F] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome New User!</h1>
        <div className="bg-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4"><span className="text-gray-300">Your Account Information</span></h2>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Your ACS Mail is:</label>
            <p className="text-sm text-gray-400 mb-2">This is the domain ACS has created for you. It will be the default, but you can customize the domain to another domain of your choosing.</p>
            <input
              type="email"
              className="w-full p-2 rounded bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={responseEmail}
              onChange={e => setResponseEmail(e.target.value)}
              placeholder="Enter your response email"
            />
            <button
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              onClick={handleCustomizeEmail}
              type="button"
            >
              Customize
            </button>
          </div>
          <pre className="bg-black/20 p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
*/
