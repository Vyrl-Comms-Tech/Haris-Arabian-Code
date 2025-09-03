import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/PodcastPlayer.css';

// Function to extract YouTube video ID from URL
const extractYouTubeId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default function PodcastPlayer() {
  const BaseUrl = import.meta.env.VITE_BASE_URL;
  const [podcasts, setPodcasts] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch podcasts from API using axios
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/AllPodcasts`);
        
        if (response.data.success) {
          // Sort podcasts by orderNumber
          const sortedPodcasts = response.data.data.sort((a, b) => a.orderNumber - b.orderNumber);
          setPodcasts(sortedPodcasts);
          
          // Set the first podcast (orderNumber 1) as the main episode
          if (sortedPodcasts.length > 0) {
            setCurrentEpisode(sortedPodcasts[0]);
          }
        } else {
          setError('Failed to fetch podcasts');
        }
      } catch (err) {
        setError('Error fetching podcasts: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, [BaseUrl]);

  // Handle episode click
  const handleEpisodeClick = (episode) => {
    setCurrentEpisode(episode);
  };

  if (loading) {
    return (
      <div className="podcast-container">
        <div className="podcast-content">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            fontSize: '1.2rem'
          }}>
            <p>Loading podcasts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="podcast-container">
        <div className="podcast-content">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            fontSize: '1.2rem',
            color: '#ff6b6b'
          }}>
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentEpisode || podcasts.length === 0) {
    return (
      <div className="podcast-container">
        <div className="podcast-content">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            fontSize: '1.2rem'
          }}>
            <p>No podcasts available</p>
          </div>
        </div>
      </div>
    );
  }

  const sidebarEpisodes = podcasts.filter(podcast => podcast._id !== currentEpisode._id);

  return (
    <div className="podcast-container">
      <div className="podcast-content">
        <h1 className="podcast-title">Podcast</h1>
        <div className="podcast-layout">
          {/* Main Video Player */}
          <div className="main-video-section">
            <div className="video-player">
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(currentEpisode.youtubeUrl)}`}
                title={currentEpisode.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <div className="main-video-info">
              <h2 className="main-video-title">{currentEpisode.title}</h2>
              <p className="main-video-description">{currentEpisode.description}</p>
            </div>
          </div>

          {/* Sidebar with Episode List */}
          <div className="sidebar">
            <div 
              className="episode-list"
              data-lenis-prevent="true"
              data-scroll-container="true"
            >
              {sidebarEpisodes.map((episode) => (
                <div 
                  key={episode._id} 
                  className="episode-item"
                  onClick={() => handleEpisodeClick(episode)}
                >
                  <div className="episode-thumbnail">
                    <img 
                      src={`https://img.youtube.com/vi/${extractYouTubeId(episode.youtubeUrl)}/mqdefault.jpg`} 
                      alt={episode.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="episode-info">
                    <div className="episode-indicator">
                      <span className="indicator-dot"></span>
                      <span className="episode-views">{episode.category}</span>
                    </div>
                    <h3 className="episode-title">{episode.title}</h3>
                    <p className="episode-description">{episode.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}