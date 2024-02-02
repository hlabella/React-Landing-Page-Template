import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCalendar, faUser, faReceipt, faChartLine, faCreditCard, faDollarSign, faLock } from '@fortawesome/free-solid-svg-icons';

//whatsapp stuff
import { WhatsAppWidget } from 'react-whatsapp-widget';
import 'react-whatsapp-widget/dist/index.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [profile, setProfile] = useState({
        user: {
            first_name: '',
            email: ''
        },
        endereco_completo: '',
        cpf_cnpj: '',
        crp_number: '',
        inscricao_municipal: '',
        tipo_pix1: '',
        chave_pix1: '',
        tipo_pix2: '',
        chave_pix2: '',
        subscription_id: '',
        phone_number: ''
    });

    
    
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      //paywall

      fetch(`${apiUrl}/api/profile/`, {
          headers: {
              'Authorization': `Token ${token}`
          }
      })
      .then(res => res.json())
      .then(data => {
          setProfile(data);
      });
      
    }, [navigate]);

    const handleNavigation = (path) => {
        navigate(path);
    };


  
    return (
      <div id="dash" className="container mt-5 dashboard" style={{ paddingTop: "120px" }}>
            {profile.subscription_id && profile.subscription_id !== '' ? (
                <h1 className="text-center">{profile.user.first_name.toUpperCase()}</h1>
            ) : (
                <div>
                    <h1 className="text-center">{profile.user.first_name.toUpperCase()}</h1>
                    <p className="text-center" style={{ color: '#ec7c7c' }}>assinatura inativa</p>
                </div>
            )}
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
                        {profile.subscription_id && profile.subscription_id !== '' ? (
                                <div className="card-body">
                                    <FontAwesomeIcon icon={faReceipt} size="3x" />
                                    <h5 className="card-title">Meus recibos/Notas Fiscais</h5>
                                </div>
                            ) : (
                                <div className="card-body">
                                    <FontAwesomeIcon icon={faLock} size="3x" style={{ color: '#ec7c7c' }} />
                                    <h5 className="card-title">Meus recibos/Notas Fiscais (Acesso Restrito)</h5>
                                </div>
                        )}
                    </div>
                </div>
                <div className="col-md-4 mb-3" onClick={() => handleNavigation('./relatorios')}>
                    <div className="card">
                        {profile.subscription_id && profile.subscription_id !== '' ? (
                            <div className="card-body">
                                <FontAwesomeIcon icon={faChartLine} size="3x" />
                                <h5 className="card-title">Relatórios</h5>
                            </div>
                        ) : (
                            <div className="card-body">
                                <FontAwesomeIcon icon={faLock} size="3x" style={{ color: '#ec7c7c' }} />
                                <h5 className="card-title">Relatórios (Acesso Restrito)</h5>
                            </div>
                        )}
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
                        {profile.subscription_id && profile.subscription_id !== '' ? (
                            <div className="card-body">
                                <FontAwesomeIcon icon={faDollarSign} size="3x" />
                                <h5 className="card-title">Cobrança</h5>
                            </div>
                        ) : (
                            <div className="card-body">
                                <FontAwesomeIcon icon={faLock} size="3x" style={{ color: '#ec7c7c' }} />
                                <h5 className="card-title">Cobrança (Acesso Restrito)</h5>
                            </div>
                        )}
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
