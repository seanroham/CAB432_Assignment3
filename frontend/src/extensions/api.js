import axios from 'axios';

const AUTH_URL = 'http://localhost:3003';
const VIDEO_UPLOAD_URL = 'http://localhost:3001';
const VIDEO_PROCESSING_URL = 'http://localhost:3002';
const VIDEO_METADATA_URL = 'http://localhost:3000';
// const AUTH_URL = 'https://api.group62.cab432.com';
// const VIDEO_UPLOAD_URL = 'https://api.group62.cab432.com';
// const VIDEO_PROCESSING_URL = 'https://api.group62.cab432.com';
// const VIDEO_METADATA_URL = 'https://api.group62.cab432.com';

// Login API
export const login = async (credentials) => {
    const response = await axios.post(`${AUTH_URL}/login`, credentials);
    return response.data;
};

// Sign up API
export const signup = async (userData) => {
    const response = await axios.post(`${AUTH_URL}/signup`, userData);
    return response.data;
};

// Upload video API call
export const uploadVideo = async (file, fileName, onUploadProgress) => {
    try {
        // Request signed URL from backend
        const { data: { signedUrl, videoId } } = await axios.post(`${VIDEO_UPLOAD_URL}/upload`, {
            title: fileName,
        });

        // Upload video file to the signed URL
        await axios.put(signedUrl, file, {
            headers: { 'Content-Type': file.type },
            onUploadProgress,
        });

        return { videoId };
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
};

// Process video API call
export const processVideo = async (videoData) => {
    const response = await axios.post(`${VIDEO_PROCESSING_URL}/process`, videoData);
    return response.data;
};

// Get videos API call
export const getVideos = async () => {
    const response = await axios.get(`${VIDEO_METADATA_URL}/videos`);
    return response.data;
};
