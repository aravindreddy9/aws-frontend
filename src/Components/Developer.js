import React from 'react';
import { useLocation } from 'react-router-dom';
import { signOut } from "../Utils/AuthUtils";
import { useNavigate } from "react-router-dom";
import './Developer.css';

const Developer = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const name = state?.idToken?.payload?.given_name || 'Guest';

    const handleSignOut = () => {
        signOut();
        navigate("/");
    };
    return (
        <div className="dev-container">
            <div className="dev-header">
            <div className="dev-title">Developer Panel</div>
            <button className="signout-button" onClick={handleSignOut}>
                Sign Out
            </button>
            </div>
            <h2 className="dev-welcome">
            Welcome, {name}! You are on the Developer page. 🛠️
            </h2>
        </div>
        );
};

export default Developer;
