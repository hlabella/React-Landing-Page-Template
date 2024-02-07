import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const UserProfile = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [profile, setProfile] = useState({
        user: {
            first_name: ''
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
    });
    const [displayValues, setDisplayValues] = useState({ ...profile });


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        } 
        fetch(`${apiUrl}/api/profile/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setProfile(data);
            setDisplayValues(data);
        });
    }, [navigate]);


    const PIX_TYPE_LABELS = {
        documento: 'CPF ou CNPJ',
        celular: 'Celular',
        email: 'E-mail',
      };

    const handleInputChange = (event) => {
        setProfile({ ...profile, [event.target.name]: event.target.value });
    };

    const handleSubmit = () => {
        const token = localStorage.getItem('token');
        fetch(`${apiUrl}/api/profile/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profile)
        }).then(() => {
            setDisplayValues({ ...profile });
        });
    };

    const goToDashboard = () => {
        navigate('/dashboard'); 
    };

    return (
        <div className="user-profile-container">
            <div className="dashboard-link">
                <button onClick={goToDashboard} className="dashboard-button"><FontAwesomeIcon icon={faArrowLeft} /> Voltar</button>
            </div>
            <h2>PSICÓLOGO</h2>

            <h4>Nome/Razão Social</h4>
            <div className="input-group">
                <span className="value-display">{displayValues.user.first_name}</span>
            </div>

            <h4>CNPJ</h4>
            <div className="input-group">  
                <span className="value-display">{displayValues.cpf_cnpj}</span>
            </div>

            <h4>Assinatura</h4>
            <div className="input-group">  
                <span className="value-display">
                    {(!displayValues.subscription_id || displayValues.subscription_id === '') ? 'Inativa' : 'Ativa'}
                </span>
            </div>

            <h4>Endereço</h4>
            <div className="input-group">
                <textarea
                    name="endereco_completo"
                    value={profile.endereco_completo || ''}
                    onChange={handleInputChange}
                    placeholder="Endereço Completo"
                />
                <span className="value-display">{displayValues.endereco_completo}</span>
            </div>

            <h4>Número do CRP</h4>
            <div className="input-group">
                <input
                    type="text"
                    name="crp_number"
                    value={profile.crp_number || ''}
                    onChange={handleInputChange}
                    placeholder="Número CRP"
                />
                <span className="value-display">{displayValues.crp_number}</span>
            </div>

            <h4>Inscrição Municipal</h4>
            <div className="input-group">
                <input
                    type="text"
                    name="inscricao_municipal"
                    value={profile.inscricao_municipal || ''}
                    onChange={handleInputChange}
                    placeholder="Inscrição Municipal"
                />
                <span className="value-display">{displayValues.inscricao_municipal}</span>
            </div>
            
            {/* tipo_pix1 and chave_pix1 */}
            <h4>Tipo de Chave PIX 1</h4>
            <div className="input-group">
                <select
                    name="tipo_pix1"
                    value={profile.tipo_pix1 || ''}
                    onChange={handleInputChange}
                >
                    <option value="documento">CPF ou CNPJ</option>
                    <option value="celular">Celular</option>
                    <option value="email">E-mail</option>
                </select>
                <span className="value-display">{PIX_TYPE_LABELS[displayValues.tipo_pix1] || ''}</span>
            </div>

            <h4>Chave PIX 1</h4>
            <div className="input-group">
                <input
                    type="text"
                    name="chave_pix1"
                    value={profile.chave_pix1 || ''}
                    onChange={handleInputChange}
                    placeholder="Chave PIX 1"
                />
                <span className="value-display">{displayValues.chave_pix1}</span>
            </div>

            {/* tipo_pix2 and chave_pix2 */}
            <h4>Tipo de Chave PIX 2 (opcional)</h4>
            <div className="input-group">
                <select
                    name="tipo_pix2"
                    value={profile.tipo_pix2 || ''}
                    onChange={handleInputChange}
                >
                    <option value="documento">CPF ou CNPJ</option>
                    <option value="celular">Celular</option>
                    <option value="email">E-mail</option>
                </select>
                <span className="value-display">{PIX_TYPE_LABELS[displayValues.tipo_pix2] || ''}</span>
            </div>

            <h4>Chave PIX 2 (opcional)</h4>
            <div className="input-group">
                <input
                    type="text"
                    name="chave_pix2"
                    value={profile.chave_pix2 || ''}
                    onChange={handleInputChange}
                    placeholder="Chave PIX 2"
                />
                <span className="value-display">{displayValues.chave_pix2}</span>
            </div>

            <button className="save-button" onClick={handleSubmit}>Salvar</button>
        </div>
    );
};

export default UserProfile;
