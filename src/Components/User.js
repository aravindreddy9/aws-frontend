import React from 'react';
import { useLocation } from 'react-router-dom';

const User = () => {
    const { state } = useLocation();
    console.log("Location State:", state);
    const name = state?.idToken?.payload?.given_name || 'Guest';
    return (
        <h2>Welcome, {name}! You are on the Users page. 👤</h2>
    );
};

export default User;
