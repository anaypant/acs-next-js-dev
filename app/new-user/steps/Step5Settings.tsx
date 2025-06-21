import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

interface SettingsData {
  signature: string;
  smsEnabled: boolean;
  phone: string;
  autoEmails: boolean;
}

interface Step5SettingsProps {
  data: SettingsData;
  setData: (data: SettingsData) => void;
  onContinue: () => void;
  onBack: () => void;
  loading: boolean;
}

const Step5Settings: React.FC<Step5SettingsProps> = ({
  data,
  setData,
  onContinue,
  onBack,
  loading,
}) => {
  const canEnableSms = data.phone.replace(/[^0-9]/g, '').length > 0;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setData({ ...data, [name]: type === 'checkbox' ? checked : value });
  }

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
            All automated emails sent by ACS will end with this signature.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <textarea
              name="signature"
              className="w-full p-3 rounded bg-black/30 text-white border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
              rows={3}
              value={data.signature}
              onChange={handleChange}
              placeholder="Best regards,\nYour Name\nYour Company"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="smsEnabled"
              id="smsEnabled"
              checked={data.smsEnabled && canEnableSms}
              onChange={handleChange}
              className="accent-green-500"
              disabled={!canEnableSms}
            />
            <label htmlFor="smsEnabled" className={`text-sm ${!canEnableSms ? 'text-gray-500' : ''}`}>Enable SMS notifications</label>
            <div className="flex items-center ml-4">
              <span className="text-gray-400">+1</span>
              <input
                type="tel"
                name="phone"
                className="ml-1 p-2 rounded bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 w-40"
                placeholder="Phone number"
                value={data.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="autoEmails"
              name="autoEmails"
              checked={data.autoEmails}
              onChange={handleChange}
              className="accent-green-500"
            />
            <label htmlFor="autoEmails" className="text-sm">Allow automated emails</label>
          </div>
        </div>
        <div className="flex justify-between mt-8">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
            >
                Back
            </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onContinue}
            disabled={loading}
            className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save & Go to Dashboard'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Step5Settings; 