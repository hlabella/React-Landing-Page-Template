import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCalendar, faUser, faReceipt, faChartLine, faCreditCard, faDollarSign } from '@fortawesome/free-solid-svg-icons';

//whatsapp stuff
import { WhatsAppWidget } from 'react-whatsapp-widget';
import 'react-whatsapp-widget/dist/index.css';

const Dashboard = () => {

    const navigate = useNavigate();
    
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
    }, [navigate]);

    const handleNavigation = (path) => {
        navigate(path);
    };
  
    return (
      <div id="dash" className="container mt-5 dashboard" style={{ paddingTop: "120px" }}>
            <h1 className="text-center">ÁREA DO PROFISSIONAL</h1>
            <div className="row">
                <div className="col-md-4 mb-3" onClick={() => handleNavigation('./meu-consultorio')}>
                    <div className="card">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faBuilding} size="3x" />
                            <h5 className="card-title">Meu consultório</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3" onClick={() => handleNavigation('./minha-agenda')}>
                    <div className="card">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faCalendar} size="3x" />
                            <h5 className="card-title">Minha Agenda</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3" onClick={() => handleNavigation('./meus-pacientes')}>
                    <div className="card">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faUser} size="3x" />
                            <h5 className="card-title">Meus Pacientes</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3" onClick={() => handleNavigation('./meus-recibos')}>
                    <div className="card">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faReceipt} size="3x" />
                            <h5 className="card-title">Meus recibos/Notas Fiscais</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3" onClick={() => handleNavigation('./relatorios')}>
                    <div className="card">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faChartLine} size="3x" />
                            <h5 className="card-title">Relatórios</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3" onClick={() => handleNavigation('./assinatura')}>
                    <div className="card">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faCreditCard} size="3x" />
                            <h5 className="card-title">Assinatura</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 mb-3" onClick={() => handleNavigation('./cobranca')}>
                    <div className="card cardcobranca">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faDollarSign} size="3x" />
                            <h5 className="card-title">Cobrança</h5>
                        </div>
                    </div>
                </div>
            </div>
            <WhatsAppWidget 
                companyName="COBRA AI" 
                message="Olá! Qual é sua dúvida?" 
                phoneNumber="5511982646000" 
                sendButtonText="Enviar"
                inputPlaceHolder="Escreva uma mensagem"
                replyTimeText="Responde típicamente em menos de 1 dia"
            />
        </div>  
        
    );
  };
  
  export default Dashboard;
