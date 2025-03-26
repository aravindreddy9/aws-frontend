import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { jwtDecode } from 'jwt-decode';
import UserPool from "../UserPool";
import "./Auth.css";

const Auth = () => {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" , given_name: ""});
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [signupEmail, setSignupEmail] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");  
    const [error, setError] = useState(""); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleForm = () => {
        setIsSignup(!isSignup);
        setFormData({ email: "", password: "" , given_name: "" });  // Reset form data
        setEmail("");  
        setPassword("");
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isSignup) {
                console.log("Signing up user:", formData);
                const attributeList = [
                            new CognitoUserAttribute({ Name: "email", Value: formData.email }),
                            new CognitoUserAttribute({ Name: "given_name", Value: formData.given_name }) 
                        ];
                
                UserPool.signUp(formData.email, formData.password, attributeList, null, (err, result) => {
                    if (err) {
                        setMessage(err.message || "Error signing up");
                    } else {
                        setSignupEmail(formData.email);
                        setIsVerifying(true);
                    }
                });
            } else {
                console.log("Logging in user:", formData);
                const user = new CognitoUser({ Username: formData.email, Pool: UserPool });
                const authDetails = new AuthenticationDetails({ Username: formData.email, Password: formData.password });
                
                user.authenticateUser(authDetails, {
                    onSuccess: (session) => {
                        console.log("Login successful!", session);
        
                        // Fetch user role from Cognito token
                        const idToken = session.getIdToken();
                        const token = idToken.getJwtToken(); // 👈 Raw JWT
                        sessionStorage.setItem("idToken", token); // ✅ Store securely
                        
                        const decoded = jwtDecode(token);
                        const groups = decoded["cognito:groups"] || [];
                        const role = groups.length > 0 ? groups[0] : "User";


                        // Redirect based on role
                        if (role === "Admins") navigate("/admin");
                        else if (role === "Devs") navigate("/developer",{state:session});
                        else if (role === "Users") navigate("/user",{ state: session });
                        else navigate("/unauthorized")
                    },
                    onFailure: (err) => {
                        setError(err.message || "Login failed");
                    },
                });
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleVerification = (e) => {
        e.preventDefault();

        const user = new CognitoUser({ Username: signupEmail, Pool: UserPool });

        user.confirmRegistration(verificationCode, true, (err, result) => {
            if (err) {
                setError(err.message || "Verification failed");
            } else {
                console.log("Verification successful!", result);
                setMessage("Signup successful! Please wait for admin approval.");
                setTimeout(() => {
                    setMessage("");
                }, 3000);
                setIsVerifying(false);
                setIsSignup(false);
                setVerificationCode("");
                setFormData((prev) => ({ ...prev, email: signupEmail }));
            }
        });
    };


    return (
        <div className="auth-container">
        <h2 className="auth-header">{isSignup ? "Sign Up" : "Log In"}</h2>

        {!isVerifying ? (
            <form className="auth-form" onSubmit={handleSubmit}>
            <input className="auth-input" type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange} required />
            <input className="auth-input" type="password" name="password" placeholder="Password" onChange={handleChange} required />
            {isSignup && (
                <input className="auth-input" type="text" name="given_name" placeholder="Name" onChange={handleChange} required />
            )}
            <button className="auth-button" type="submit">
                {isSignup ? "Sign Up" : "Log In"}
            </button>
            </form>
        ) : (
            <form className="auth-form" onSubmit={handleVerification}>
            <input
                className="auth-input"
                type="text"
                value={verificationCode}
                name="verificationCode"
                placeholder="Enter verification code"
                onChange={(e) => setVerificationCode(e.target.value)}
                required
            />
            <button className="auth-button" type="submit">Verify</button>
            </form>
        )}

        <p className="toggle-link" onClick={toggleForm}>
            {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
        </p>

        {message && <p className="auth-message success">{message}</p>}
        {error && <p className="auth-message error">{error}</p>}
        </div>
    );
};

export default Auth;
