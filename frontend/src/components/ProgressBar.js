import React from 'react';
import '../styles/VideoUpload.css';

function ProgressBar({ progress }) {
    return (
        <div className="progress-container">
            <div
                className="progress-bar"
                role="progressbar"
                style={{width: `${progress}%`}}
            >
                <span className="progress-text">{progress}%</span>
            </div>
        </div>

    );
}

export default ProgressBar;
