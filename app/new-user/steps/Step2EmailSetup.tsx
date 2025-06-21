import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, XCircle } from 'lucide-react';

interface EmailData {
    responseEmail: string;
    customDomain: string;
    customEmail: string;
    emailOption: 'default' | 'custom';
}

interface Step3EmailSetupProps {
  data: EmailData;
  setData: (data: EmailData) => void;
  onContinue: () => void;
  onBack: () => void;
  loading: boolean;
}

const Step3EmailSetup: React.FC<Step3EmailSetupProps> = ({
  data,
  setData,
  onContinue,
  onBack,
  loading,
}) => {
    const [emailStatus, setEmailStatus] = useState<{ available: boolean; message: string } | null>(null);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    // Simplified handlers for this refactoring pass.
    // In a full implementation, these would call the backend.
    const verifyIdentity = () => console.log("Verifying identity for", data.customDomain);
    const verifyDkim = () => console.log("Verifying DKIM for", data.customDomain);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };
    
    return (
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
          ACS Mail is your professional communication hub.
        </p>
      </div>
    </div>
    <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 space-y-6">
      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setData({ ...data, emailOption: 'default' })}
            className={`flex-1 p-4 rounded-lg border transition-all duration-200 ${
              data.emailOption === 'default'
                ? 'border-green-400 bg-green-400/10'
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            <h3 className="font-semibold mb-2">Use ACS Domain</h3>
          </motion.button>
          <span className="font-bold text-gray-400 select-none">OR</span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setData({ ...data, emailOption: 'custom' })}
            className={`flex-1 p-4 rounded-lg border transition-all duration-200 ${
              data.emailOption === 'custom'
                ? 'border-green-400 bg-green-400/10'
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            <h3 className="font-semibold mb-2">Use Custom Domain</h3>
          </motion.button>
        </div>
        {data.emailOption === 'default' ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium">Your ACS Mail Address</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="responseEmail"
                value={data.responseEmail.split('@')[0]}
                onChange={(e) => setData({ ...data, responseEmail: `${e.target.value}@homes.automatedconsultancy.com` })}
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
              name="customEmail"
              value={data.customEmail}
              onChange={handleEmailChange}
              className="w-full p-2 rounded bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="your.name@yourdomain.com"
            />
            <button
              type="button"
              onClick={verifyIdentity}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Verify Identity
            </button>
             <button
              type="button"
              onClick={verifyDkim}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 mt-2"
            >
              Verify DKIM
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          disabled={loading}
          className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-600"
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </motion.button>
      </div>
    </div>
  </motion.div>
)};

export default Step3EmailSetup; 