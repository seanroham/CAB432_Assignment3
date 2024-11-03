import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1 className="hero-title">Welcome to Video Transcoder Pro</h1>
                <p className="hero-description">
                    Seamlessly transcode videos and extract high-quality audio with our advanced online tool.
                </p>
                <div className="cta-buttons">
                    <button className="cta-button primary" onClick={() => navigate('/dashboard')}>
                        Start Transcoding
                    </button>
                    {/*<button className="cta-button secondary" onClick={() => console.log("Learn More")}>*/}
                    {/*    Learn More*/}
                    {/*</button>*/}
                </div>
            </div>

            <div className="features-section">
                <h2 className="section-title">Our Features</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <img src="/assets/video.svg" alt="Video Transcoding" className="feature-icon"/>
                        <h3>High-Quality Video Transcoding</h3>
                        <p>Convert videos to multiple formats quickly and efficiently without losing quality.</p>
                    </div>
                    <div className="feature-item">
                        <img src="/assets/audio.svg" alt="Audio Extraction" className="feature-icon"/>
                        <h3>Audio Extraction</h3>
                        <p>Extract audio from video files in various formats like MP3, WAV, and more.</p>
                    </div>
                    <div className="feature-item">
                        <img src="/assets/cloud.svg" alt="Cloud Storage" className="feature-icon"/>
                        <h3>Cloud Storage</h3>
                        <p>Upload and store your files securely in the cloud for easy access anytime, anywhere.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
