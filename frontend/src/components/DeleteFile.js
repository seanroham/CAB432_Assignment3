import React, { useState } from 'react';
import '../styles/style.css';

const API_URL = 'https://4nstcf5k15.execute-api.ap-southeast-2.amazonaws.com/testprod/delete-file';

const DeleteFile = () => {
    const [fileName, setFileName] = useState('');
    const [olderThanMinutes, setOlderThanMinutes] = useState(10);
    const [loading, setLoading] = useState(false);

    const handleDeleteFile = async () => {
        setLoading(true);
        console.log('deleting:', fileName);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName }),
            });
            const result = await response.json();
            console.log (result)
        } catch (error) {
            console.error('Error deleting file:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOldFiles = async () => {
        setLoading(true);
        console.log('deleting files older than:', olderThanMinutes, 'minutes');
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deleteOldFiles: true, olderThanMinutes }),
            });
            const result = await response.json();
            console.log (result)

        } catch (error) {
            console.error('Error deleting old files:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="custom-container-2">
            <div className="modal-content">
                <h3>Delete File</h3>
                <p className="login-info">Delete a specific file or files older than specified minutes</p>

                <div className="form-group">
                    <label className="form-label">File Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter file name to delete"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                </div>
                <button
                    className="btn-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        handleDeleteFile();
                    }}
                    disabled={loading}
                >
                    {loading ? 'Deleting...' : 'Delete File'}
                </button>

                <div className="form-group">
                    <label className="form-label">Delete Files Older Than (minutes)</label>
                    <input
                        type="range"
                        min="1"
                        max="60"
                        value={olderThanMinutes}
                        onChange={(e) => setOlderThanMinutes(e.target.value)}
                        className="slider"
                    />
                    <p>{olderThanMinutes} Minutes</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={(e) => {
                        e.preventDefault();
                        handleDeleteOldFiles();
                    }}
                    disabled={loading}
                >
                    {loading ? 'Deleting...' : 'Delete Old Files'}
                </button>


            </div>
        </div>
    );
};

export default DeleteFile;
