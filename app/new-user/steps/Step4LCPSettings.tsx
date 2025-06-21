import { motion } from 'framer-motion';
import { CheckCircle2, Mail } from 'lucide-react';
import React from 'react';

interface LcpSettingsData {
    tone: string;
    style: string;
    samplePrompt: string;
}

interface Step4LCPSettingsProps {
  data: LcpSettingsData;
  setData: (data: LcpSettingsData) => void;
  onContinue: () => void;
  onBack: () => void;
  loading: boolean;
}

const Step4LCPSettings: React.FC<Step4LCPSettingsProps> = ({
  data,
  setData,
  onContinue,
  onBack,
  loading
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
        Customize Your AI Assistant
      </h2>
      <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-3 text-green-400">LCP AI Customization</h3>
        <p className="text-gray-300 mb-4">
          Customize how your AI assistant generates email responses.
        </p>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Tone</label>
              <select
                value={data.tone}
                onChange={(e) => setData({ ...data, tone: e.target.value })}
                className="w-full p-2 rounded bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="empathetic">Empathetic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Writing Style</label>
              <select
                value={data.style}
                onChange={(e) => setData({ ...data, style: e.target.value })}
                className="w-full p-2 rounded bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="concise">Concise</option>
                <option value="detailed">Detailed</option>
                <option value="conversational">Conversational</option>
                <option value="technical">Technical</option>
                <option value="persuasive">Persuasive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sample Email</label>
            <textarea
              value={data.samplePrompt}
              onChange={(e) => setData({ ...data, samplePrompt: e.target.value })}
              className="w-full h-32 p-2 rounded bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter a sample email that represents your preferred writing style..."
            />
          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-between gap-4">
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
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        disabled={loading}
        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save and Continue'}
        {!loading && <CheckCircle2 className="w-5 h-5" />}
      </motion.button>
    </div>
  </motion.div>
);

export default Step4LCPSettings; 