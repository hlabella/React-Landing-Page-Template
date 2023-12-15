import React, { useState, useEffect } from 'react';

const UserProfile = () => {
    
    const apiUrl = process.env.REACT_APP_API_URL;
    
    const [profile, setProfile] = useState({
        user: {
            first_name: ''
        },
        endereco_completo: '',
        cpf_cnpj: '',
        crp_number: '',
        inscricao_municipal: '',
        dados_bancarios_1: '',
        dados_bancarios_2: '',
        dados_bancarios_3: ''
    });

    const [displayValues, setDisplayValues] = useState({ ...profile });

    useEffect(() => {
        const token = localStorage.getItem('token');
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
    }, []);

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


    return (
        <div className="user-profile-container">
            <h2>PSICÓLOGO</h2>
            <h4>Nome/Razão Social*</h4>
            <div className="input-group">
                <span className="value-display">{displayValues.user.first_name}</span>
            </div>

            <h4>CNPJ*</h4>
            <div className="input-group">  
                
                <span className="value-display">{displayValues.cpf_cnpj}</span>
            </div>

            <h4>Endereço*</h4>
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
            
            <h4>Dados Bancários 1</h4>
            <div className="input-group">
                <textarea
                    name="dados_bancarios_1"
                    value={profile.dados_bancarios_1 || ''}
                    onChange={handleInputChange}
                    placeholder="Dados Bancários 1"
                />
                <span className="value-display">{displayValues.dados_bancarios_1}</span>
            </div>
            
            <h4>Dados Bancários 2</h4>
            <div className="input-group">
                <textarea
                    name="dados_bancarios_2"
                    value={profile.dados_bancarios_2 || ''}
                    onChange={handleInputChange}
                    placeholder="Dados Bancários 2"
                />
                <span className="value-display">{displayValues.dados_bancarios_2}</span>
            </div>
            
            <h4>Dados Bancários 3</h4>
            <div className="input-group">
                <textarea
                    name="dados_bancarios_3"
                    value={profile.dados_bancarios_3 || ''}
                    onChange={handleInputChange}
                    placeholder="Dados Bancários 3"
                />
                <span className="value-display">{displayValues.dados_bancarios_3}</span>
            </div>

            <button className="save-button" onClick={handleSubmit}>Salvar</button>
        </div>
    );
};

export default UserProfile;
