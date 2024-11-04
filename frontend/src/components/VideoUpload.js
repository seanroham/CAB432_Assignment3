import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import '../styles/VideoUpload.css';
import { uploadVideo } from '../extensions/api';
function VideoUpload({ onUploadComplete }) {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [format, setFormat] = useState('mp4');


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
            // Use uploadVideo from api.js
            const { videoId } = await uploadVideo(
                file,
                file.name,
                (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            );

            // The rest of the video processing will be handled on the backend
            onUploadComplete({ videoId });
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
