import uploadFiles from '../mockData/uploadFiles.json';
import uploadSessions from '../mockData/uploadSessions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate file upload with progress
const simulateUpload = (fileId, onProgress) => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random progress increment
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        onProgress(progress);
        resolve();
      } else {
        onProgress(progress);
      }
    }, 200);
  });
};

// Generate thumbnail for images
const generateThumbnail = (file) => {
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    } else {
      resolve(null);
    }
  });
};

const uploadFileService = {
  async getAll() {
    await delay(300);
    return [...uploadFiles];
  },

  async getById(id) {
    await delay(200);
    const file = uploadFiles.find(f => f.id === id);
    if (!file) throw new Error('Upload file not found');
    return { ...file };
  },

  async create(fileData) {
    await delay(300);
    
    const thumbnail = await generateThumbnail(fileData.file);
    
    const newFile = {
      id: Date.now().toString(),
      name: fileData.name,
      size: fileData.size,
      type: fileData.type,
      status: 'pending',
      progress: 0,
      uploadedAt: null,
      url: null,
      thumbnail: thumbnail
    };

    uploadFiles.push(newFile);
    return { ...newFile };
  },

  async startUpload(fileId, onProgress) {
    await delay(200);
    
    const fileIndex = uploadFiles.findIndex(f => f.id === fileId);
    if (fileIndex === -1) throw new Error('File not found');

    // Update status to uploading
    uploadFiles[fileIndex].status = 'uploading';
    
    try {
      // Simulate upload with progress
      await simulateUpload(fileId, (progress) => {
        uploadFiles[fileIndex].progress = Math.round(progress);
        onProgress(Math.round(progress));
      });

      // Mark as completed
      uploadFiles[fileIndex].status = 'completed';
      uploadFiles[fileIndex].uploadedAt = new Date().toISOString();
      uploadFiles[fileIndex].url = `https://example.com/files/${fileId}`;
      
      return { ...uploadFiles[fileIndex] };
    } catch (error) {
      uploadFiles[fileIndex].status = 'failed';
      throw error;
    }
  },

  async pause(fileId) {
    await delay(200);
    const fileIndex = uploadFiles.findIndex(f => f.id === fileId);
    if (fileIndex === -1) throw new Error('File not found');
    
    uploadFiles[fileIndex].status = 'paused';
    return { ...uploadFiles[fileIndex] };
  },

  async resume(fileId) {
    await delay(200);
    const fileIndex = uploadFiles.findIndex(f => f.id === fileId);
    if (fileIndex === -1) throw new Error('File not found');
    
    uploadFiles[fileIndex].status = 'uploading';
    return { ...uploadFiles[fileIndex] };
  },

  async cancel(fileId) {
    await delay(200);
    const fileIndex = uploadFiles.findIndex(f => f.id === fileId);
    if (fileIndex === -1) throw new Error('File not found');
    
    uploadFiles.splice(fileIndex, 1);
    return true;
  },

  async retry(fileId) {
    await delay(200);
    const fileIndex = uploadFiles.findIndex(f => f.id === fileId);
    if (fileIndex === -1) throw new Error('File not found');
    
    uploadFiles[fileIndex].status = 'pending';
    uploadFiles[fileIndex].progress = 0;
    return { ...uploadFiles[fileIndex] };
  },

  async delete(id) {
    await delay(300);
    const index = uploadFiles.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Upload file not found');
    
    uploadFiles.splice(index, 1);
    return true;
  },

  async createSession() {
    await delay(200);
    const newSession = {
      id: Date.now().toString(),
      files: [],
      totalSize: 0,
      startTime: new Date().toISOString(),
      endTime: null
    };

    uploadSessions.push(newSession);
    return { ...newSession };
  }
};

export default uploadFileService;