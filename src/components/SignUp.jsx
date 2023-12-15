import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [cpfCnpj, setCpfCnpj] = useState('');
    const [firstName, setFirstName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate(); // Initialize useNavigate

    const validateInputs = () => {
        if (!username.trim()) {
            setError('Usuário é obrigatório.');
            return false;
        }
        if (!email.trim()) {
            setError('Email é obrigatório.');
            return false;
        }     
        if (!firstName.trim()) {
            setError('Nome/Razão Social é obrigatório.');
            return false;
        }  
        if (!cpfCnpj.trim()) {
            setError('CPF/CNPJ é obrigatório.');
            return false;
        }
        if (!password1 || !password2) {
            setError('É necessário confirmar a senha.');
            return false;
        }
        if (password1 !== password2) {
            setError('Senhas não são iguais.');
            return false;
        }
        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        if (!validateInputs()) return;

        setLoading(true);
        fetch(`${apiUrl}/api/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password1, password2, email, cpf_cnpj: cpfCnpj, first_name: firstName})
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            navigate('/agreement');
        })
        .catch(error => {
            setError('Erro durante cadastro: ' + error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <div id="signup" className="text-center">
            <div className="container">
                <div className="section-title">
                    <h2>Cadastro</h2>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="username">Usuário</label>
                        <input 
                            type="text" 
                            id="username"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className="form-control"
                        />
                    </div>                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">Nome Completo/Razão Social</label>
                        <input 
                            type="text" 
                            id="firstName"
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cpfCnpj">CPF/CNPJ</label>
                        <input 
                            type="text" 
                            id="cpfCnpj"
                            value={cpfCnpj} 
                            onChange={(e) => setCpfCnpj(e.target.value)} 
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password1">Senha</label>
                        <input 
                            type="password" 
                            id="password1"
                            value={password1} 
                            onChange={(e) => setPassword1(e.target.value)} 
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password2">Confirme a Senha</label>
                        <input 
                            type="password" 
                            id="password2"
                            value={password2} 
                            onChange={(e) => setPassword2(e.target.value)} 
                            className="form-control"
                        />
                    </div>
                    <button className="btn btn-primary navbar-btn" type="submit" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
