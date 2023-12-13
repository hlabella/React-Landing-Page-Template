// Login.jsx in your React app

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate

    const validateInputs = () => {
        if (!username.trim() || !password) {
            setError('É obrigatório usuário e senha.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        if (!validateInputs()) return;

        setLoading(true);
        try {
            const response = await fetch('https://apissl.cobraai.me/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Login falhou.');
            }
        } catch (error) {
            setError('Ocorreu um erro durante o login.');
        }
        setLoading(false);
    };

    return (
        <div id="login" className="text-center">
            <div className="container">
                <div className="section-title">
                    <h2>Entrar</h2>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="username">Usuário</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                            aria-required="true"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            aria-required="true"
                        />
                    </div>
                    <button className="btn btn-default navbar-btn" type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
