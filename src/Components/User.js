import React from 'react';
import { useLocation } from 'react-router-dom';
import { signOut } from "../Utils/AuthUtils";
import { useNavigate } from "react-router-dom";
import './User.css';

const User = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const name = state?.idToken?.payload?.given_name || 'Guest';
    const handleSignOut = () => {
        signOut();
        navigate("/");
        };
    return (
        <div className="user-container">
            <div className="user-header">
            <div className="user-title">User Panel</div>
            <button className="signout-button" onClick={handleSignOut}>
                Sign Out
            </button>
            </div>
            <h2 className="user-welcome">
            Welcome, {name}! You are on the Users page. 👤
            </h2>
        </div>
    );
};

export default User;
