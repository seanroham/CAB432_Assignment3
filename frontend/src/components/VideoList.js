import React, { useEffect, useState } from 'react';
import { getVideos } from '../extensions/api';
import '../styles/VideoList.css';

function VideoList() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        async function fetchVideos() {
            const fetchedVideos = await getVideos();
            setVideos(fetchedVideos);
        }
        fetchVideos();
    }, []);

    return (
        <div className="video-list-container">
            <h3 className="list-title">Uploaded Videos</h3>
            <div className="video-list">
                {videos.map(video => (
                    <div key={video.id} className="video-card">
                        <h4 className="video-title">{video.name}</h4>
                        <p className="video-status"><strong>Status:</strong> {video.status}</p>
                        <p className="video-upload-date"><strong>Uploaded At:</strong> {new Date(video.createdAt).toLocaleString()}</p>

                        {video.thumbnailPath && (
                            <div className="thumbnail-container">
                                <img
                                    src={video.thumbnailPath}
                                    alt="Thumbnail"
                                    className="video-thumbnail"
                                />
                                <a href={video.thumbnailPath} download>
                                    <button className="download-button">Download Thumbnail</button>
                                </a>
                            </div>
                        )}

                        <div className="download-container">
                            {video.signedUrl && (
                                <a href={video.signedUrl} download>
                                    <button className="download-button">Download Video</button>
                                </a>
                            )}

                            {video.audioUrl && (
                                <a href={video.audioUrl} download>
                                    <button className="download-button secondary">Download Audio</button>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VideoList;
