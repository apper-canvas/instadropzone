import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { uploadFileService } from '../services';

function MainFeature({ files, setFiles, isDragging, onDrop, onDragOver, onDragLeave, onFileSelect }) {
  const [selectedFileId, setSelectedFileId] = useState(null);

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

  const handleRetry = async (fileId) => {
    try {
      await uploadFileService.retry(fileId);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'uploading', progress: 0 } : f
      ));
      toast.success('Retrying upload...');
    } catch (error) {
      toast.error('Failed to retry upload');
    }
  };

  const handleCancel = async (fileId) => {
    try {
      await uploadFileService.cancel(fileId);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success('Upload cancelled');
    } catch (error) {
      toast.error('Failed to cancel upload');
    }
  };

  const handlePause = async (fileId) => {
    try {
      await uploadFileService.pause(fileId);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'paused' } : f
      ));
      toast.success('Upload paused');
    } catch (error) {
      toast.error('Failed to pause upload');
    }
  };

  const handleResume = async (fileId) => {
    try {
      await uploadFileService.resume(fileId);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'uploading' } : f
      ));
      toast.success('Upload resumed');
    } catch (error) {
      toast.error('Failed to resume upload');
    }
  };

  return (
    <div className="space-y-8">
      {/* Drop Zone */}
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
        {/* Ripple Effect */}
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

        <input
          id="file-input"
          type="file"
          multiple
          onChange={onFileSelect}
          className="hidden"
        />
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-lg border border-surface-200 overflow-hidden"
          >
            <div className="p-6 border-b border-surface-200 bg-surface-50">
              <h3 className="text-lg font-heading font-semibold text-surface-900">
                Upload Queue ({files.length} files)
              </h3>
            </div>

            <div className="divide-y divide-surface-200 max-h-96 overflow-y-auto">
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                        <div className="w-full bg-surface-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="gradient-progress h-2 rounded-full"
                          />
                        </div>
                        
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
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePause(file.id)}
                          className="p-2 text-warning hover:bg-warning/10 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Pause" className="w-4 h-4" />
                        </motion.button>
                      )}

                      {file.status === 'paused' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleResume(file.id)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Play" className="w-4 h-4" />
                        </motion.button>
                      )}

                      {file.status === 'failed' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRetry(file.id)}
                          className="p-2 text-info hover:bg-info/10 rounded-lg transition-colors"
                        >
                          <ApperIcon name="RotateCcw" className="w-4 h-4" />
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCancel(file.id)}
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <ApperIcon name="X" className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {files.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 space-y-4"
        >
          <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto">
            <ApperIcon name="FolderOpen" className="w-8 h-8 text-surface-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-heading font-medium text-surface-700">
              No files uploaded yet
            </h3>
            <p className="text-surface-500">
              Start by dragging files to the drop zone above
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default MainFeature;