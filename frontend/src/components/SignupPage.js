import React, { useState } from 'react';
import { signup } from '../extensions/api';
import { useNavigate } from 'react-router-dom';
import '../styles/authstyling.css';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const result = await signup({ username, email, password });
            if (result.message) {
                navigate('/login');
            }
        } catch (error) {
            setError('Signup failed, please try again.');
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSignup} className="signup-form">
                <h2>Sign Up</h2>
                <p className="signup-info">Create an account to get started:</p>
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
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit" className="btn btn-primary signup-button">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupPage;
