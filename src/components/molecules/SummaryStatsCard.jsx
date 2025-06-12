import React from 'react';
import { motion } from 'framer-motion';
import ProgressBar from '@/components/atoms/ProgressBar';

const SummaryStatsCard = ({ files }) => {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const completedFiles = files.filter(f => f.status === 'completed').length;
  const overallProgress = files.length > 0 ? (completedFiles / files.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-surface-900">{files.length}</div>
          <div className="text-sm text-surface-600">Total Files</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-surface-900">
            {(totalSize / (1024 * 1024)).toFixed(1)}MB
          </div>
          <div className="text-sm text-surface-600">Total Size</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{overallProgress.toFixed(0)}%</div>
          <div className="text-sm text-surface-600">Progress</div>
        </div>
      </div>
      
      {/* Overall Progress Bar */}
      <div className="mt-4">
        <ProgressBar progress={overallProgress} />
      </div>
    </motion.div>
  );
};

export default SummaryStatsCard;