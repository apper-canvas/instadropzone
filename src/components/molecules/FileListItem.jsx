import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/atoms/ProgressBar';
import Button from '@/components/atoms/Button';
import { uploadFileService } from '@/services';

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type) => {
  if (type.startsWith('image/')) return 'Image';
  if (type.startsWith('video/')) return 'Video';
  if (type.startsWith('audio/')) return 'Music';
  if (type.includes('pdf')) return 'FileText';
  if (type.includes('document') || type.includes('word')) return 'FileText';
  if (type.includes('spreadsheet') || type.includes('excel')) return 'Table';
  if (type.includes('presentation') || type.includes('powerpoint')) return 'Presentation';
  if (type.includes('zip') || type.includes('rar')) return 'Archive';
  return 'File';
};

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'text-success';
    case 'uploading': return 'text-primary';
    case 'failed': return 'text-error';
    case 'paused': return 'text-warning';
    default: return 'text-surface-500';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed': return 'CheckCircle';
    case 'uploading': return 'Loader';
    case 'failed': return 'XCircle';
    case 'paused': return 'PauseCircle';
    default: return 'Clock';
  }
};

const FileListItem = ({ file, onRetry, onCancel, onPause, onResume }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 hover:bg-surface-50 transition-colors"
    >
      <div className="flex items-center space-x-4">
        {/* File Icon/Thumbnail */}
        <div className="flex-shrink-0">
          {file.type.startsWith('image/') && file.thumbnail ? (
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <img 
                src={file.thumbnail} 
                alt={file.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-surface-100 rounded-lg flex items-center justify-center">
              <ApperIcon 
                name={getFileIcon(file.type)} 
                className="w-6 h-6 text-surface-600"
              />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-surface-900 truncate">
              {file.name}
            </h4>
            <span className="text-xs text-surface-500 ml-2">
              {formatFileSize(file.size)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <ProgressBar progress={file.progress} />
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <ApperIcon 
                  name={getStatusIcon(file.status)} 
                  className={`w-4 h-4 ${getStatusColor(file.status)} ${
                    file.status === 'uploading' ? 'animate-spin' : ''
                  }`}
                />
                <span className={getStatusColor(file.status)}>
                  {file.status}
                </span>
              </div>
              <span className="text-surface-500">
                {file.progress}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex items-center space-x-2">
          {file.status === 'uploading' && (
            <Button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPause(file.id)}
              className="p-2 text-warning hover:bg-warning/10 rounded-lg transition-colors"
            >
              <ApperIcon name="Pause" className="w-4 h-4" />
            </Button>
          )}

          {file.status === 'paused' && (
            <Button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onResume(file.id)}
              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <ApperIcon name="Play" className="w-4 h-4" />
            </Button>
          )}

          {file.status === 'failed' && (
            <Button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRetry(file.id)}
              className="p-2 text-info hover:bg-info/10 rounded-lg transition-colors"
            >
              <ApperIcon name="RotateCcw" className="w-4 h-4" />
            </Button>
          )}

          <Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onCancel(file.id)}
            className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FileListItem;