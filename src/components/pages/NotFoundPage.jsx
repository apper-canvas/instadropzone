import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto space-y-6"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ApperIcon name="FileQuestion" className="w-16 h-16 text-surface-400 mx-auto" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold text-surface-900">
          Page Not Found
        </h1>
        
        <p className="text-surface-600">
          The page you're looking for doesn't exist. Let's get you back to uploading files.
        </p>
        
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="gradient-primary text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
        >
          Back to Upload
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;