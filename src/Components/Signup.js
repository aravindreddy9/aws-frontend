import React, { useState } from "react";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import UserPool from "../UserPool";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const attributeList = [
            new CognitoUserAttribute({ Name: "email", Value: email })
        ];

        UserPool.signUp(email, password, attributeList, null, (err, result) => {
            if (err) {
                setMessage(err.message || "Error signing up");
            } else {
                setMessage("Signup successful! Please wait for admin approval.");
            }
        });
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Signup;
