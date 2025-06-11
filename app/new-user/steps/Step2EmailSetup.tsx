import React from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

interface Step2EmailSetupProps {
  // All state and handlers needed for this step
  emailOption: 'default' | 'custom';
  setEmailOption: (option: 'default' | 'custom') => void;
  responseEmail: string;
  setResponseEmail: (email: string) => void;
  customEmail: string;
  setCustomEmail: (email: string) => void;
  customDomain: string;
  domainError: string | null;
  isCheckingEmail: boolean;
  emailStatus: { available: boolean; message: string } | null;
  verifyIdentity: () => Promise<void>;
  isVerifyingIdentity: boolean;
  identityStatus: string | null;
  txtRecord: { Name: string; Type: string; Value: string } | null;
  setIdentityVerified: (v: boolean) => void;
  identityVerified: boolean;
  verifyDkim: () => Promise<void>;
  isVerifyingDkim: boolean;
  dkimStatus: string | null;
  setDkimVerified: (v: boolean) => void;
  dkimVerified: boolean;
  handleCustomEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomizeEmail: () => Promise<void>;
  loading: boolean;
  setStep: (step: number) => void;
}

const Step2EmailSetup: React.FC<Step2EmailSetupProps> = ({
  emailOption,
  setEmailOption,
  responseEmail,
  setResponseEmail,
  customEmail,
  setCustomEmail,
  customDomain,
  domainError,
  isCheckingEmail,
  emailStatus,
  verifyIdentity,
  isVerifyingIdentity,
  identityStatus,
  txtRecord,
  setIdentityVerified,
  identityVerified,
  verifyDkim,
  isVerifyingDkim,
  dkimStatus,
  setDkimVerified,
  dkimVerified,
  handleCustomEmailChange,
  handleCustomizeEmail,
  loading,
  setStep,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-8"
  >
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
        <Mail className="w-8 h-8 text-green-400" />
        Set Up Your ACS Mail
      </h2>
      <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-3 text-green-400">What is ACS Mail?</h3>
        <p className="text-gray-300 mb-4">
          ACS Mail is your professional communication hub. It's a dedicated email address that:
        </p>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <span>Automatically manages and responds to incoming inquiries</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <span>Integrates with our AI-powered response system</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <span>Provides a professional identity for your business communications</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 space-y-6">
      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEmailOption('default')}
            className={`flex-1 p-4 rounded-lg border transition-all duration-200 ${
              emailOption === 'default'
                ? 'border-green-400 bg-green-400/10'
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            <h3 className="font-semibold mb-2">Use ACS Domain</h3>
            <p className="text-sm text-gray-400">
              Quick setup with our trusted domain
            </p>
          </motion.button>
          <span className="font-bold text-gray-400 select-none">OR</span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEmailOption('custom')}
            className={`flex-1 p-4 rounded-lg border transition-all duration-200 ${
              emailOption === 'custom'
                ? 'border-green-400 bg-green-400/10'
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            <h3 className="font-semibold mb-2">Use Custom Domain</h3>
            <p className="text-sm text-gray-400">
              Connect your own domain (requires DNS setup)
            </p>
          </motion.button>
        </div>
        {emailOption === 'default' ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium">Your ACS Mail Address</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={responseEmail.split('@')[0]}
                onChange={(e) => setResponseEmail(`${e.target.value}@homes.automatedconsultancy.com`)}
                className="flex-1 p-2 rounded bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="username"
              />
              <span className="p-2 text-gray-400">@homes.automatedconsultancy.com</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-medium">Custom Email Setup</label>
            <input
              type="email"
              value={customEmail}
              onChange={handleCustomEmailChange}
              className={`w-full p-2 rounded bg-black/20 text-white border ${
                domainError ? 'border-red-400' : 'border-white/20'
              } focus:outline-none focus:ring-2 focus:ring-green-400`}
              placeholder="your.name@yourdomain.com"
            />
            {domainError && (
              <p className="text-red-400 text-sm mt-1">{domainError}</p>
            )}
            {customDomain && (
              <div className="text-sm text-gray-400">
                Domain to verify: <span className="text-emerald-300">{customDomain}</span>
              </div>
            )}
            <div className="bg-black/20 p-4 rounded-lg text-sm text-gray-400">
              <p className="font-medium mb-2">Required DNS Records:</p>
              <ul className="space-y-2">
                <li>• MX Record: mail.homes.automatedconsultancy.com</li>
                <li>• SPF Record: v=spf1 include:homes.automatedconsultancy.com ~all</li>
                <li>• DKIM Record: (Will be provided after domain verification)</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={verifyIdentity}
              disabled={isVerifyingIdentity || !customDomain}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {isVerifyingIdentity ? 'Verifying Identity...' : 'Verify Identity'}
            </button>
            {identityStatus && (
              <div className={`text-sm ${txtRecord ? 'text-green-400' : 'text-red-400'}`}>{identityStatus}</div>
            )}
            {txtRecord && (
              <div className="bg-black/30 p-4 rounded-lg mt-2">
                <div className="mb-2 text-green-300 font-semibold">Add this TXT record to your DNS:</div>
                <div className="font-mono text-xs text-white">
                  Name: <span className="text-emerald-300">{txtRecord.Name}</span><br />
                  Type: <span className="text-emerald-300">{txtRecord.Type}</span><br />
                  Value: <span className="text-emerald-300">{txtRecord.Value}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIdentityVerified(true)}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
                >
                  I have added the TXT record
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={verifyDkim}
              disabled={isVerifyingDkim || !customDomain || !identityVerified}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 mt-2"
            >
              {isVerifyingDkim ? 'Verifying DKIM...' : 'Verify DKIM'}
            </button>
            {dkimStatus && (
              <div className={`text-sm ${dkimVerified ? 'text-green-400' : 'text-blue-400'}`}>{dkimStatus}</div>
            )}
            {txtRecord && txtRecord.Name === 'DKIM Records' && (
              <div className="bg-black/30 p-4 rounded-lg mt-2">
                <div className="mb-2 text-blue-300 font-semibold">Add these CNAME records to your DNS:</div>
                <div className="font-mono text-xs text-white">
                  {JSON.parse(txtRecord.Value).map((record: any, index: number) => (
                    <div key={index} className="mb-2">
                      <div>Name: <span className="text-emerald-300">{record.Name}</span></div>
                      <div>Type: <span className="text-emerald-300">{record.Type}</span></div>
                      <div>Value: <span className="text-emerald-300">{record.Value}</span></div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setDkimVerified(true)}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
                >
                  I have added the CNAME records
                </button>
              </div>
            )}
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded-lg ${
            emailStatus?.available 
              ? 'bg-green-400/10 border border-green-400/50' 
              : 'bg-red-400/10 border border-red-400/50'
          }`}
        >
          <div className="flex items-center gap-2">
            {isCheckingEmail ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
            ) : emailStatus?.available ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                {emailOption === 'default' && emailStatus?.message === 'This email is available' && (
                  <span className="text-sm">{emailStatus.message}</span>
                )}
                {emailStatus?.message !== 'This email is available' && (
                  <span className="text-sm">{emailStatus.message}</span>
                )}
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-sm">{isCheckingEmail ? 'Checking availability...' : emailStatus?.message}</span>
              </>
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-end gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
                        onClick={() => setStep(2)}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setStep(4)}
          className="px-4 py-2 text-yellow-400 border border-yellow-400 rounded-lg font-semibold transition-all duration-200 bg-transparent hover:bg-yellow-400/10"
        >
          Skip for now
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCustomizeEmail}
          disabled={!emailStatus?.available || isCheckingEmail || loading || (emailOption === 'custom' && !dkimVerified) || (emailOption === 'custom' && !identityVerified)}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            emailStatus?.available && !isCheckingEmail && !loading && (emailOption !== 'custom' || (dkimVerified && identityVerified))
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          Save & Continue
        </motion.button>
      </div>
    </div>
  </motion.div>
);

export default Step2EmailSetup; 