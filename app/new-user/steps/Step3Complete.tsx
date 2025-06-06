import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import React from 'react';

const Step3Complete: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center space-y-4"
  >
    <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
    <h2 className="text-2xl font-bold">Setup Complete!</h2>
    <p className="text-gray-300">Redirecting to your dashboard...</p>
  </motion.div>
);

export default Step3Complete; 