import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const Agenda = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        
    }, [navigate]);

    

    return (
        <div className="patients-table">
            <h2>Agenda</h2>
            <h3>Em construção</h3>
            
        </div>
    );
};

export default Agenda;
