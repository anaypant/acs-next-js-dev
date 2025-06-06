import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Globe } from 'lucide-react';
import React from 'react';

interface Step1WelcomeProps {
  setStep: (step: number) => void;
}

const Step1Welcome: React.FC<Step1WelcomeProps> = ({ setStep }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-8"
  >
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
        Welcome to ACS!
      </h1>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto">
        We're thrilled to have you join the Automated Consultancy Services family. 
        ACS is dedicated to revolutionizing the way businesses handle customer interactions 
        through intelligent automation and personalized service.
      </p>
    </div>
    <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Globe className="w-6 h-6 text-green-400" />
        What We Do
      </h2>
      <div className="space-y-4 text-gray-300">
        <p>
          At ACS, we specialize in creating seamless, automated solutions that enhance 
          your business's efficiency while maintaining a personal touch. Our platform 
          combines cutting-edge AI technology with human expertise to deliver exceptional 
          customer experiences.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            Intelligent email automation and response management
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            Advanced lead tracking and conversion optimization
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            Customizable communication workflows
          </li>
        </ul>
      </div>
    </div>
    <div className="flex justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setStep(2)}
        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold flex items-center gap-2"
      >
        Continue Setup
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  </motion.div>
);

export default Step1Welcome; 