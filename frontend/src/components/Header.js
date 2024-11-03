import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { getToken, removeToken, getRole } from '../extensions/auth';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        setIsLoggedIn(!!token);
        setIsAdmin(getRole().includes('admin'));
    }, []);

    const handleLogout = () => {
        removeToken();
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <Navbar className="navbar" expand="lg">
            <Container>
                <Navbar.Brand as={NavLink} to="/" className="navbar-brand">
                    <img src="/assets/logo.svg" className="logo" />

                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-content" />
                <Navbar.Collapse id="navbar-content">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/" exact>
                            Home
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard">
                            Dashboard
                        </Nav.Link>
                        {isAdmin && (
                            <Nav.Link as={NavLink} to="/userprofiles">
                                User Profiles
                            </Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        {isLoggedIn ? (
                            <Button variant="outline-light" className="logout-button" onClick={handleLogout}>
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/login" className="login-button">
                                    Login
                                </Nav.Link>
                                <Button as={NavLink} to="/signup" className="signup-button">
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
