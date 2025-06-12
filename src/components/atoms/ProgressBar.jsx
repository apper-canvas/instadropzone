import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, className = 'w-full bg-surface-200 rounded-full h-2', barClassName = 'gradient-progress h-2 rounded-full' }) => {
  return (
    <div className={className}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={barClassName}
      />
    </div>
  );
};

export default ProgressBar;