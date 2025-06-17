import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

interface Step4SettingsProps {
  signature: string;
  setSignature: (s: string) => void;
  smsEnabled: boolean;
  setSmsEnabled: (v: boolean) => void;
  phone: string;
  setPhone: (p: string) => void;
  autoEmails: boolean;
  setAutoEmails: (v: boolean) => void;
  settingsLoading: boolean;
  handleSettingsSave: () => void;
}

const Step4Settings: React.FC<Step4SettingsProps> = ({
  signature,
  setSignature,
  smsEnabled,
  setSmsEnabled,
  phone,
  setPhone,
  autoEmails,
  setAutoEmails,
  settingsLoading,
  handleSettingsSave,
}) => {
  // Only allow SMS notifications if phone is entered
  const canEnableSms = phone.replace(/[^0-9]/g, '').length > 0;


  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className="flex flex-col items-center justify-center min-h-[80vh]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10 max-w-lg w-full shadow-2xl"
      >
        <div className="flex flex-col items-center mb-6">
          <Mail className="w-10 h-10 text-green-400 mb-2" />
          <h2 className="text-2xl font-bold mb-1">Default Email Signature</h2>
          <p className="text-gray-300 text-sm text-center max-w-md">
            All automated emails sent by ACS will end with this signature. You can personalize it for your brand.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <textarea
              className="w-full p-3 rounded bg-black/30 text-white border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
              rows={3}
              value={signature}
              onChange={e => setSignature(e.target.value)}
              placeholder="Best regards,\nYour Name\nYour Company"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="smsEnabled"
              checked={smsEnabled && canEnableSms}
              onChange={e => setSmsEnabled(e.target.checked)}
              className="accent-green-500"
              disabled={!canEnableSms}
            />
            <label htmlFor="smsEnabled" className={`text-sm ${!canEnableSms ? 'text-gray-500' : ''}`}>Enable SMS notifications</label>
            <div className="flex items-center ml-4">
              <span className="text-gray-400">+1</span>
              <input
                type="tel"
                className="ml-1 p-2 rounded bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 w-40"
                placeholder="Phone number"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="autoEmails"
              checked={autoEmails}
              onChange={e => setAutoEmails(e.target.checked)}
              className="accent-green-500"
            />
            <label htmlFor="autoEmails" className="text-sm">Allow automated emails</label>
          </div>
          <p className="text-xs text-gray-400 mt-1 ml-6">
            This gives ACS permission to send emails on behalf of the email you configured. If disabled, ACS will provide suggestions and AI responses, but will not send emails automatically. You can change this setting at any time.
          </p>
        </div>
        <div className="flex justify-end mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleSettingsSave}
            disabled={settingsLoading}
            className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-600 disabled:opacity-50"
          >
            {settingsLoading ? 'Saving...' : 'Save & Go to Dashboard'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Step4Settings; 