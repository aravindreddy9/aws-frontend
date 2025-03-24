import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "../UserPool";

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
                        setMessage("Signup successful! Please wait for admin approval.");
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
                        const groups = idToken.payload["cognito:groups"] || [];
                        const role = groups.length > 0 ? groups[0] : "User";
        
                        // Redirect based on role
                        if (role === "Admins") navigate("/admin");
                        else if (role === "Devs") navigate("/developer");
                        else navigate("/user");
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
                setMessage("Verification successful! You can now log in.");
                setIsVerifying(false); // Hide verification input
            }
        });
    };


    return (
        <div className="auth-container">
            <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
            {!isVerifying ? (
                <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                {isSignup && (
                    <input type="text" name="given_name" placeholder="Name" onChange={handleChange} required />
                )}
                <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
            </form>
            ) : (
                <form onSubmit={handleVerification}>
                    <input type="text" value={verificationCode} name="verificationCode" placeholder="Enter verification code" onChange={(e) => setVerificationCode(e.target.value)} required />
                    <button type="submit">Verify</button>
                </form>
            )}
            <p onClick={toggleForm}>
                {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
            </p>
            {message && <p>{message}</p>} {/* Display success message */}
            {error && <p>{error}</p>} {/* Display error message */}
        </div>
    );
};

export default Auth;
