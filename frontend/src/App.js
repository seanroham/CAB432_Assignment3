import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from "axios";

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Error from './pages/Error';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import SignupPage from './components/SignupPage';
import DeleteFile from './components/DeleteFile';

import { getToken, removeToken, getRole } from './extensions/auth';


function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = getToken();
        const role = getRole();
        if (token && role) {
            axios.defaults.headers.common['x-access-token'] = token;
            setUser({ username: "LoggedUser", role: role }); // Use the role to set the user
        }
    }, []);


    const handleLogout = () => {
        removeToken();
        setUser(null);
    };



    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/deleterequest" element={<DeleteFile />} />
                    <Route path="*" element={<Error />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
