import React, { useState } from 'react';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import '../styles/VideoUpload.css';

function VideoUpload({ onUploadComplete }) {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [format, setFormat] = useState('mp4');
    const VIDEO_UPLOAD_URL = 'http://localhost:3000';
    const VIDEO_PROCESSING_URL = 'http://localhost:3002';

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFormatChange = (e) => {
        setFormat(e.target.value);
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        try {
            const { data: { signedUrl, videoId } } = await axios.post(`${VIDEO_UPLOAD_URL}/upload`, {
                title: file.name,
            });

            await axios.put(signedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                },
            });

            const processResponse = await axios.post(`${VIDEO_PROCESSING_URL}/process`, {
                videoId,
                title: file.name,
                format,
            });

            onUploadComplete(processResponse.data);
        } catch (err) {
            console.error('Error uploading video:', err);
        } finally {
            setUploading(false);
            setUploadProgress(0);
            setFile(null);
        }
    };

    return (
        <div className="video-upload-container">
            <h3 className="upload-title">Upload Video</h3>
            <div className="video-upload-card">
                <input
                    type="file"
                    className="file-input"
                    onChange={handleFileChange}
                />
                <select className="format-select" value={format} onChange={handleFormatChange}>
                    <option value="mp4">MP4</option>
                    <option value="avi">AVI</option>
                    <option value="mkv">MKV</option>
                </select>
                <button
                    className="upload-button"
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>

                {uploading && <ProgressBar progress={uploadProgress} />}
            </div>
        </div>
    );
}

export default VideoUpload;
