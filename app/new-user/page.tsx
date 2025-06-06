'use client';

// This page is currently disabled and will be used in the future to handle new user onboarding
// Redirecting to dashboard instead

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { config } from '@/lib/local-api-config';
import { goto404 } from '../utils/error';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, CheckCircle2, ArrowRight, XCircle, AlertTriangle, Info } from 'lucide-react';
import Step1Welcome from './steps/Step1Welcome';
import Step2EmailSetup from './steps/Step2EmailSetup';
import Step3Complete from './steps/Step3Complete';
import Step4Settings from './steps/Step4Settings';

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

export default function NewUserPage() {
  const router = useRouter();
  const { data: session, status } = useSession() as { data: { user: SessionUser } | null, status: string };
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [responseEmail, setResponseEmail] = useState('');
  const [emailOption, setEmailOption] = useState<'default' | 'custom'>('default');
  const [customDomain, setCustomDomain] = useState('');
  const [step, setStep] = useState(1);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    available: boolean;
    message: string;
  } | null>(null);
  const [dkimVerified, setDkimVerified] = useState(false);
  const [isVerifyingDkim, setIsVerifyingDkim] = useState(false);
  const [dkimStatus, setDkimStatus] = useState<string | null>(null);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [isVerifyingIdentity, setIsVerifyingIdentity] = useState(false);
  const [identityStatus, setIdentityStatus] = useState<string | null>(null);
  const [txtRecord, setTxtRecord] = useState<{ Name: string; Type: string; Value: string } | null>(null);
  const [customEmail, setCustomEmail] = useState('');
  const [domainError, setDomainError] = useState<string | null>(null);
  const [error, setError] = useState<{
    message: string;
    type: 'error' | 'warning' | 'info';
    show: boolean;
  } | null>(null);
  const [signature, setSignature] = useState('');
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [phone, setPhone] = useState('');
  const [autoEmails, setAutoEmails] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // List of unsupported public email domains
  const unsupportedDomains = [
    'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'aol.com', 'protonmail.com', 'zoho.com', 'mail.com', 'gmx.com', 'yandex.com', 'msn.com', 'live.com', 'me.com', 'comcast.net', 'att.net', 'verizon.net', 'sbcglobal.net', 'bellsouth.net', 'cox.net', 'charter.net', 'rocketmail.com', 'ymail.com', 'aim.com', 'mail.ru', 'rediffmail.com', 'hushmail.com', 'fastmail.com', 'inbox.com', 'qq.com', 'naver.com', '163.com', '126.com', 'yeah.net', 'googlemail.com'
  ];

  const isUnsupportedDomain = (domain: string) => {
    return unsupportedDomains.includes(domain.toLowerCase());
  };

  const showError = (message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    setError({ message, type, show: true });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const checkEmailAvailability = async (email: string) => {
    if (!email) {
      setEmailStatus(null);
      return;
    }

    setIsCheckingEmail(true);
    try {
      const checkResponse = await fetch(`api/db/select`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Users',
          index_name: 'responseEmail-index',
          key_name: 'responseEmail',
          key_value: email,
        }),
      });

      if (!checkResponse.ok) {
        throw new Error('Failed to check email availability');
      }

      const existingEmails = await checkResponse.json();
      const items = existingEmails.items || [];
      if (items.length > 0) {
        if (items.some((user: any) => user.id !== session?.user?.id)) {
          setEmailStatus({
            available: false,
            message: 'This email is already in use'
          });
        } else {
          setEmailStatus({
            available: true,
            message: 'This is your current email'
          });
        }
      } else {
        setEmailStatus({
          available: true,
          message: 'This email is available'
        });
      }
    } catch (error) {
      setEmailStatus({
        available: false,
        message: 'Error checking email availability'
      });
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const validateDomain = (domain: string) => {
    // Basic domain validation
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domain) {
      setDomainError('Domain is required');
      return false;
    }
    if (!domainRegex.test(domain)) {
      setDomainError('Please enter a valid domain (e.g., example.com)');
      return false;
    }
    setDomainError(null);
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setDomainError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setDomainError('Please enter a valid email address');
      return false;
    }
    setDomainError(null);
    return true;
  };

  const handleCustomEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setCustomEmail(newEmail);
    
    // Extract domain from email
    const domain = newEmail.split('@')[1];
    if (domain) {
      setCustomDomain(domain);
      validateDomain(domain);
      if (isUnsupportedDomain(domain)) {
        setDomainError('This domain is currently unsupported. Please contact us for more information.');
      } else {
        setDomainError(null);
      }
    } else {
      setCustomDomain('');
      setDomainError('Please enter a complete email address');
    }

    // Reset verification states
    setDkimVerified(false);
    setDkimStatus(null);
    setIdentityVerified(false);
    setIdentityStatus(null);
    setTxtRecord(null);
  };

  const verifyIdentity = async () => {
    if (!validateEmail(customEmail)) {
      showError('Please enter a valid email address before verifying identity');
      return;
    }
    setIsVerifyingIdentity(true);
    setIdentityStatus(null);
    setTxtRecord(null);
    try {
      const res = await fetch('/api/domain/verify-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: customDomain }),
      });
      const data = await res.json();
      if (res.ok && data.txt_record) {
        setIdentityStatus(data.message || 'Identity verification initiated.');
        setTxtRecord(data.txt_record);
        setIdentityVerified(false); // User must confirm after adding TXT
      } else {
        const errorMessage = data.message || 'Failed to initiate identity verification.';
        setIdentityStatus(errorMessage);
        setTxtRecord(null);
        showError(errorMessage);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error verifying identity.';
      setIdentityStatus(errorMessage);
      setTxtRecord(null);
      showError(errorMessage);
    } finally {
      setIsVerifyingIdentity(false);
    }
  };

  const verifyDkim = async () => {
    if (!validateEmail(customEmail)) {
      showError('Please enter a valid email address before verifying DKIM');
      return;
    }
    if (!identityVerified) {
      showError('Please complete identity verification first', 'warning');
      return;
    }
    setIsVerifyingDkim(true);
    setDkimStatus(null);
    try {
      const res = await fetch('/api/domain/verify-dkim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: customDomain }),
      });
      const data = await res.json();
      
      if (res.ok && data.dkim_records) {
        setDkimStatus('DKIM verification initiated. Please add the following CNAME records to your DNS:');
        setDkimVerified(false); // User must confirm after adding CNAME records
        // Store the DKIM records for display
        setTxtRecord({
          Name: 'DKIM Records',
          Type: 'CNAME',
          Value: JSON.stringify(data.dkim_records, null, 2)
        });
      } else {
        const errorMessage = data.error || 'Failed to initiate DKIM verification.';
        setDkimVerified(false);
        setDkimStatus(errorMessage);
        setTxtRecord(null);
        showError(errorMessage);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error verifying DKIM.';
      setDkimVerified(false);
      setDkimStatus(errorMessage);
      setTxtRecord(null);
      showError(errorMessage);
    } finally {
      setIsVerifyingDkim(false);
    }
  };

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

        const response = await fetch(`api/db/select`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            table_name: 'Users',
            index_name: 'id-index',
            key_name: 'id',
            key_value: session.user.id,
          }),
        });

        if (!response.ok) {
          throw new Error(`Database query failed with status ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        const items = result.items || [];
        if (Array.isArray(items) && items.length > 1) {
          goto404('500', 'Multiple entries found for this user', router);
          return;
        }
        setData(items[0] || null);
        
        // Get their default email from the database
        const defaultEmail = items[0]?.acsMail;
        console.log(defaultEmail);
        if (!defaultEmail) {
          // If no email exists, create one based on their name
          const name = session.user.name || '';
          const generatedEmail = `${name.toLowerCase().replace(/\s+/g, '')}@homes.automatedconsultancy.com`;
          
          // Check if this email already exists
          const checkResponse = await fetch(`api/db/select`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              table_name: 'Users',
              index_name: 'responseEmail-index',
              key_name: 'responseEmail',
              key_value: generatedEmail,
            }),
          });

          if (!checkResponse.ok) {
            throw new Error('Failed to check email availability');
          }

          const existingEmails = await checkResponse.json();
          const items = existingEmails.items || [];
          if (Array.isArray(items) && items.length > 0) {
            // If email exists, append a number
            let counter = 1;
            let newEmail = generatedEmail;
            while (items.some((user: any) => user.responseEmail === newEmail)) {
              newEmail = `${name.toLowerCase().replace(/\s+/g, '')}${counter}@homes.automatedconsultancy.com`;
              counter++;
            }
            setResponseEmail(newEmail);
          } else {
            setResponseEmail(generatedEmail);
          }
        } else {
          setResponseEmail(defaultEmail);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') {
      fetchData();
    }
  }, [session, status, router]);

  useEffect(() => {
    const email = emailOption === 'default' 
      ? responseEmail 
      : `${responseEmail.split('@')[0]}@${customDomain}`;
    checkEmailAvailability(email);
  }, [responseEmail, customDomain, emailOption]);

  // Fetch default signature from Users table when entering settings step
  useEffect(() => {
    if (step === 4 && data) {
      setSignature(data.email_signature || '');
      setSmsEnabled(data.smsEnabled || false);
      setPhone(data.phone ? String(data.phone).replace(/[-()\s]/g, '') : '');
      setAutoEmails(data.autoEmails !== false); // default to true
    }
  }, [step, data]);

  const handleSettingsSave = async () => {
    setSettingsLoading(true);
    try {
      const cleanedPhone = phone.replace(/[-()\s]/g, '');
      const res = await fetch('/api/db/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_name: 'Users',
          key_name: 'id',
          key_value: session?.user?.id,
          update_data: {
            signature,
            smsEnabled,
            phone: cleanedPhone,
            autoEmails,
            lcp_automatic_enabled: autoEmails ? 'true' : 'false',
            sms_enabled: smsEnabled ? 'true' : 'false',
            newUser: false,
          }
        }),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      router.push('/dashboard');
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Failed to save settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleCustomizeEmail = async () => {
    try {
      setLoading(true);
      const finalEmail = emailOption === 'default' 
        ? responseEmail 
        : customEmail; // Use the full custom email

      if (emailOption === 'custom') {
        const domain = customEmail.split('@')[1];
        if (isUnsupportedDomain(domain)) {
          showError('This domain is currently unsupported. Please contact us for more information.');
          setLoading(false);
          return;
        }
      }

      if (emailOption === 'custom' && (!dkimVerified || !identityVerified)) {
        showError('Please complete all domain verifications before continuing', 'warning');
        return;
      }

      if (emailOption === 'custom') {
        // Only verify email validity and update for custom domain
        const verifyResponse = await fetch('/api/domain/verify-email-validity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: session?.user?.id,
            newEmail: finalEmail
          }),
        });

        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json();
          throw new Error(errorData.error || 'Failed to verify email validity');
        }

        // For custom domain, only update responseEmail
        const updateRes = await fetch('/api/db/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table_name: 'Users',
            key_name: 'id',
            key_value: session?.user?.id,
            update_data: {
              responseEmail: finalEmail
            }
          }),
        });
        if (!updateRes.ok) {
          throw new Error('Failed to update response email');
        }
      } else if (emailOption === 'default') {
        // For ACS Mail, just update both acsMail and responseEmail
        const updateRes = await fetch('/api/db/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table_name: 'Users',
            key_name: 'id',
            key_value: session?.user?.id,
            update_data: {
              acsMail: finalEmail,
              responseEmail: finalEmail
            }
          }),
        });
        if (!updateRes.ok) {
          throw new Error('Failed to update ACS Mail and response email');
        }
      }

      // Success: proceed to next step
      setStep(4);
    } catch (error) {
      console.error('Error updating email:', error);
      showError(error instanceof Error ? error.message : 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A2F1F] to-[#0E3B2A] text-white p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A2F1F] to-[#0E3B2A] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
              error.type === 'error' 
                ? 'bg-red-500/90 text-white' 
                : error.type === 'warning'
                ? 'bg-yellow-500/90 text-white'
                : 'bg-blue-500/90 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {error.type === 'error' && <XCircle className="w-5 h-5" />}
              {error.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
              {error.type === 'info' && <Info className="w-5 h-5" />}
              <p>{error.message}</p>
            </div>
          </motion.div>
        )}
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"
            />
          </div>
        ) : step === 1 ? (
          <Step1Welcome setStep={setStep} />
        ) : step === 2 ? (
          <Step2EmailSetup
            emailOption={emailOption}
            setEmailOption={setEmailOption}
            responseEmail={responseEmail}
            setResponseEmail={setResponseEmail}
            customEmail={customEmail}
            setCustomEmail={setCustomEmail}
            customDomain={customDomain}
            domainError={domainError}
            isCheckingEmail={isCheckingEmail}
            emailStatus={emailStatus}
            verifyIdentity={verifyIdentity}
            isVerifyingIdentity={isVerifyingIdentity}
            identityStatus={identityStatus}
            txtRecord={txtRecord}
            setIdentityVerified={setIdentityVerified}
            identityVerified={identityVerified}
            verifyDkim={verifyDkim}
            isVerifyingDkim={isVerifyingDkim}
            dkimStatus={dkimStatus}
            setDkimVerified={setDkimVerified}
            dkimVerified={dkimVerified}
            handleCustomEmailChange={handleCustomEmailChange}
            handleCustomizeEmail={handleCustomizeEmail}
            loading={loading}
            setStep={setStep}
          />
        ) : step === 3 ? (
          <Step3Complete />
        ) : step === 4 ? (
          <Step4Settings
            signature={signature}
            setSignature={setSignature}
            smsEnabled={smsEnabled}
            setSmsEnabled={setSmsEnabled}
            phone={phone}
            setPhone={setPhone}
            autoEmails={autoEmails}
            setAutoEmails={setAutoEmails}
            settingsLoading={settingsLoading}
            handleSettingsSave={handleSettingsSave}
          />
        ) : null}
      </div>
    </div>
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
