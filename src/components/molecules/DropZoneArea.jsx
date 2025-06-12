import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const DropZoneArea = ({ isDragging, onDrop, onDragOver, onDragLeave, onFileSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 cursor-pointer ${
        isDragging
          ? 'border-secondary bg-secondary/5 drop-zone-active scale-105'
          : 'border-primary/30 hover:border-primary bg-primary/5 drop-zone-pattern'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => document.getElementById('file-input').click()}
    >
      {isDragging && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 bg-secondary/20 rounded-3xl"
        />
      )}

      <motion.div
        animate={{ 
          y: isDragging ? [0, -10, 0] : 0,
          scale: isDragging ? 1.1 : 1
        }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto">
          <ApperIcon 
            name={isDragging ? "Download" : "Upload"} 
            className="w-8 h-8 text-white" 
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-heading font-semibold text-surface-900">
            {isDragging ? 'Drop your files here' : 'Drag & drop files here'}
          </h3>
          <p className="text-surface-600">
            or <span className="text-primary font-medium">click to browse</span>
          </p>
          <p className="text-sm text-surface-500">
            Supports all file types • Max 100MB per file
          </p>
        </div>
      </motion.div>

      <Input
        id="file-input"
        type="file"
        multiple
        onChange={onFileSelect}
        className="hidden"
      />
    </motion.div>
  );
};

export default DropZoneArea;