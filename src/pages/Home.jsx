import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import { uploadFileService } from '../services';

function Home() {
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

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const completedFiles = files.filter(f => f.status === 'completed').length;
  const overallProgress = files.length > 0 ? (completedFiles / files.length) * 100 : 0;

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
              <div className="w-full bg-surface-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="gradient-progress h-2 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Upload Feature */}
        <MainFeature
          files={files}
          setFiles={setFiles}
          isDragging={isDragging}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onFileSelect={handleFileSelect}
        />

        {/* Confetti Animation */}
        <AnimatePresence>
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -20,
                    rotate: 0,
                    scale: 1
                  }}
                  animate={{
                    y: window.innerHeight + 20,
                    rotate: 360,
                    scale: 0
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute w-3 h-3 gradient-secondary rounded-full"
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Home;