import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Recibos = () => {
    
    const navigate = useNavigate();
    const whatsappNumber = "5511982646000";
    const templateMessage = "Olá! Quero falar sobre Nota Fiscal/Recibos.";
    const encodedMessage = encodeURIComponent(templateMessage);
  
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

    return (
        <div className="patients-table">
            <div className="dashboard-link">
                <button onClick={goToDashboard} className="dashboard-button"><FontAwesomeIcon icon={faArrowLeft} /> Voltar</button>
            </div>
            <h2>Recibos</h2>
            <a href={`https://wa.me/${whatsappNumber}?text=${encodedMessage}`}>
                <p style={{color:"blue"}}>Estamos evoluindo esta aba do site! Para que você possa configurar as notas e recibo, clique aqui e converse diretamente conosco</p>
            </a>
            
        </div>
    );
};

export default Recibos;
