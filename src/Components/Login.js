import React, { useState } from "react";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "../UserPool";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = new CognitoUser({ Username: email, Pool: UserPool });
        const authDetails = new AuthenticationDetails({ Username: email, Password: password });

        user.authenticateUser(authDetails, {
            onSuccess: (session) => {
                console.log("Login successful!", session);

                // Fetch user role from Cognito token
                const idToken = session.getIdToken();
                const groups = idToken.payload["cognito:groups"] || [];
                const role = groups.length > 0 ? groups[0] : "User";

                // Redirect based on role
                if (role === "Admin") navigate("/admin");
                else if (role === "Developer") navigate("/developer");
                else navigate("/user");
            },
            onFailure: (err) => {
                setError(err.message || "Login failed");
            },
        });
    };

    return (
        <div>
            <h2>Login</h2>
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
                <button type="submit">Login</button>
            </form>
            <p>{error}</p>
        </div>
    );
};

export default Login;
