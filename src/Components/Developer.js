import React from 'react';
import { useLocation } from 'react-router-dom';

const Developer = () => {
    const { state } = useLocation();
    const name = state?.idToken?.payload?.given_name || 'Guest';
    return (
        <h2>Welcome, {name}! You are on the Developers page. 👨‍💻</h2>
    );
};

export default Developer;
