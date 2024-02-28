import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import ReactPlayer from 'react-player/lazy'

const Tutorial = () => {
    
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

    }, [navigate]);

    const goToDashboard = () => {
        navigate('/dashboard'); 
    };

    const videos = [
        { id: 1, url: 'https://www.youtube.com/embed/14pxC17vHlo', titulo: '1. Aprenda a usar o COBRA AI (intro geral)' },
        { id: 2, url: 'https://www.youtube.com/embed/QDIMudSm7L4', titulo: '2. Aprenda a usar a aba Meu Consultório' },
        { id: 3, url: 'https://www.youtube.com/embed/12NIbVBQqN0', titulo: '3. Aprenda a usar a aba Meus Pacientes' },
        { id: 4, url: 'https://www.youtube.com/embed/fyVz22yFLtI?si=ccvazpoc8ySsmaO8', titulo: '4. Aprenda a usar a aba Minha Agenda' },
        { id: 5, url: 'https://www.youtube.com/embed/_qzA1HTXqf4', titulo: '5. Aprenda a usar a aba Assinatura' },
        { id: 6, url: 'https://www.youtube.com/embed/ec7cEpPwuHY', titulo: '6. Aprenda a usar a aba Cobrança' },
        { id: 7, url: '', titulo: '7. Aprenda a usar a aba Meus Recibos/Notas Fiscais (EM BREVE)' },
        { id: 8, url: '', titulo: '8. Aprenda a usar a aba Relatórios (EM BREVE)' }
    ];

    const [selectedVideo, setSelectedVideo] = React.useState(null);

    const selectVideo = (videoUrl) => {
        setSelectedVideo(videoUrl);
    };

    const closeVideo = () => {
        setSelectedVideo(null);
    };

    return (
        <div className="tutorial-table">
            <div className="dashboard-link">
                <button onClick={goToDashboard} className="dashboard-button"><FontAwesomeIcon icon={faArrowLeft} /> Voltar</button>
            </div>
            <h2>Aprenda a usar o COBRA AI</h2>
            <div className="react-player-wrapper-tutorial">
                <ReactPlayer 
                url='/img/cobraai_short.mp4'
                controls={true}
                className="react-player-tutorial"
                />
            </div>
            <div className="container">
                <div className="row playlist">
                    {videos.map(video => (
                        <div key={video.id} className="col-12 playlist-item" onClick={() => selectVideo(video.url)}>
                            <div className="video-content">
                                <FontAwesomeIcon icon={faPlayCircle} size="2x" />
                                <span className="video-title">{video.titulo}</span>
                            </div>
                        </div>
                    ))} 
                </div>
            </div>
            {selectedVideo && (
                <div className="video-modal" onClick={closeVideo}>
                    <div className="video-container">
                        <iframe 
                            src={selectedVideo} 
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen 
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default Tutorial;
