import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SummaryStatsCard from '@/components/molecules/SummaryStatsCard';
import FileUploadSection from '@/components/organisms/FileUploadSection';
import ConfettiAnimation from '@/components/organisms/ConfettiAnimation';
import { uploadFileService } from '@/services';

const HomePage = () => {
  const [files, setFiles] = useState([]);
  const [uploadSession, setUploadSession] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleFileUpload = async (newFiles) => {
    try {
      // Create new upload session
      const session = await uploadFileService.createSession();
      setUploadSession(session);

      // Process each file
      const processedFiles = [];
      for (const file of newFiles) {
        const uploadFile = await uploadFileService.create({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        });
        processedFiles.push(uploadFile);
      }

      setFiles(prev => [...prev, ...processedFiles]);
      
      // Start uploads
      for (const file of processedFiles) {
        await uploadFileService.startUpload(file.id, (progress) => {
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, progress } : f
          ));
        });
      }

      // Show confetti when all files complete
      const allComplete = processedFiles.every(f => f.status === 'completed');
      if (allComplete && processedFiles.length > 1) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }

      toast.success(`${processedFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      handleFileUpload(selectedFiles);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-surface-900">
            Upload Your Files
          </h2>
          <p className="text-lg text-surface-600 max-w-2xl mx-auto">
            Drag and drop files or click to browse. Watch your uploads progress in real-time with our smooth, gradient-accented interface.
          </p>
        </div>

        {/* Summary Stats */}
        {files.length > 0 && (
          <SummaryStatsCard files={files} />
        )}

        {/* Main Upload Feature */}
        <FileUploadSection
          files={files}
          setFiles={setFiles}
          isDragging={isDragging}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onFileSelect={handleFileSelect}
        />

        {/* Confetti Animation */}
        <ConfettiAnimation showConfetti={showConfetti} />
      </motion.div>
    </div>
  );
};

export default HomePage;