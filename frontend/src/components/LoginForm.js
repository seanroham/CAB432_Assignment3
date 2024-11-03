import React, { useState } from 'react';
import { login } from '../extensions/api';
import { setToken } from '../extensions/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/authstyling.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const result = await login({ username, password });
            if (result.idToken) {
                setToken(result.idToken, result.userGroups);
                navigate('/dashboard');
                window.location.reload();
            } else {
                handleError(401);
            }
        } catch (error) {
            console.error('Login request error:', error);
            setError('Login failed: Please try again later.');
        }
    };

    const handleError = (status) => {
        switch (status) {
            case 400:
                setError('Invalid login request: Please check your input.');
                break;
            case 401:
                setError('Login failed: Incorrect username or password.');
                break;
            default:
                setError('Unexpected error occurred. Please try again later.');
                break;
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                <p className="login-info">To use our services, please log in:</p>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary login-button">Log In</button>
            </form>
        </div>
    );
};

export default LoginForm;
