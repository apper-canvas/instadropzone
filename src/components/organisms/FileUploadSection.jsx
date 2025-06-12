import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import DropZoneArea from '@/components/molecules/DropZoneArea';
import FileListItem from '@/components/molecules/FileListItem';
import { uploadFileService } from '@/services';

const FileUploadSection = ({ files, setFiles, isDragging, onDrop, onDragOver, onDragLeave, onFileSelect }) => {
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
      <DropZoneArea
        isDragging={isDragging}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onFileSelect={onFileSelect}
      />

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
                <FileListItem
                  key={file.id}
                  file={file}
                  onRetry={handleRetry}
                  onCancel={handleCancel}
                  onPause={handlePause}
                  onResume={handleResume}
                />
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
};

export default FileUploadSection;