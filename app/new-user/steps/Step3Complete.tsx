import { motion } from 'framer-motion';
import { CheckCircle2, Mail } from 'lucide-react';
import React from 'react';

interface Step3CompleteProps {
  lcpSettings: {
    tone: string;
    style: string;
    samplePrompt: string;
  };
  setLcpSettings: (settings: { tone: string; style: string; samplePrompt: string }) => void;
  handleComplete: () => void;
  loading: boolean;
}

const Step3Complete: React.FC<Step3CompleteProps> = ({
  lcpSettings,
  setLcpSettings,
  handleComplete,
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
          Customize how your AI assistant generates email responses. These settings will be used as a base for all AI-generated emails.
        </p>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Tone</label>
              <select
                value={lcpSettings.tone}
                onChange={(e) => setLcpSettings({ ...lcpSettings, tone: e.target.value })}
                className="w-full p-2 rounded bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="empathetic">Empathetic</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">Sets the overall tone of AI-generated emails</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Writing Style</label>
              <select
                value={lcpSettings.style}
                onChange={(e) => setLcpSettings({ ...lcpSettings, style: e.target.value })}
                className="w-full p-2 rounded bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="concise">Concise</option>
                <option value="detailed">Detailed</option>
                <option value="conversational">Conversational</option>
                <option value="technical">Technical</option>
                <option value="persuasive">Persuasive</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">Determines the writing style of AI-generated emails</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sample Email Prompt</label>
            <textarea
              value={lcpSettings.samplePrompt}
              onChange={(e) => setLcpSettings({ ...lcpSettings, samplePrompt: e.target.value })}
              className="w-full h-32 p-2 rounded bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter a sample email that represents your preferred writing style..."
            />
            <p className="text-xs text-gray-400 mt-1">
              Provide a sample email that demonstrates your preferred writing style. This helps the AI better understand your communication preferences.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleComplete}
        disabled={loading}
        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
            Saving...
          </>
        ) : (
          <>
            Complete Setup
            <CheckCircle2 className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </div>
  </motion.div>
);

export default Step3Complete; 