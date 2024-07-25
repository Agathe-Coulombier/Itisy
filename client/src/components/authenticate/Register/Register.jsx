import React, { useState, useContext } from 'react'; // Import React and useState hook from React
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import axios from "axios"; // Import axios for making HTTP requests
import { AuthContext } from '../../../hooks/authContext';
import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Register = (props) => { // Define Register component with props parameter
    const [iconPassword, setIconPassword] = useState(false); // State variable to toggle password visibility
    const [iconConfirmPassword, setIconConfirmPassword] = useState(false); // State variable to toggle confirm password visibility
    const [error, setError] = useState(""); // State variable to manage error messages
    const { setIsAuthenticated, login } = useContext(AuthContext); // Destructure setIsAuthenticated from context
    const {t} = useTranslation();

    const handleInputChange = (e) => { // Event handler to update user state on input change
        const { name, value } = e.target;
        props.setUser({ ...props.user, [name]: value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => { // Event handler to handle form submission
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const res = await axios.post("http://localhost:4000/auth/register", props.user, { withCredentials: true }); // Send POST request to register user
            
            if (res.status === 200) {

                const res = await axios.post("http://localhost:4000/auth/login", props.user, { withCredentials: true }); // Send POST request to login endpoint
                // console.log("Login response: ", res); // Log response data
        
                    if (res.status === 200) {
                        setIsAuthenticated(true);
                        await login(props.user, res);
                        navigate('/dashboard'); // Redirect to the dashboard
                        document.body.classList.remove("modal-open");
                    }
                }
            } catch (error) {
                console.error("Error response:", error.response); // Log error response data to console if request fails
                console.error("Error message:", error.message); // Log error message to console
                console.error("Error code:", error.code); // Log error code to console
                setError(error.response.data.message); // Set error message state with error response message
            }
    };

    return (
        <div className="register modal-content"> {/* Register form container */}
            <h3> {t('Create an account')}</h3> {/* Heading */}
            <br/>
            <form action=""> {/* Registration form */}

                <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    placeholder={t("First name *")} 
                    value={props.user.firstName}
                    onChange={handleInputChange}
                    required /> {/* First name input field */}

                <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    placeholder={t("Last name")}
                    value={props.user.lastName}
                    onChange={handleInputChange} /> {/* Last name input field */}

                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder={t("Email address *")} 
                    value={props.user.email}
                    onChange={handleInputChange}
                    required /> {/* Email address input field */}

                <div className="password"> {/* Password input field with toggle visibility */}
                    <input 
                        type={iconPassword === false ? "password" : "text"}
                        id="password" 
                        name="password"
                        placeholder={t("Password *")} 
                        value={props.user.password}
                        onChange={handleInputChange}
                        required /> {/* Password input field */}

                    <span> {/* Icon to toggle password visibility */}
                        {(iconPassword === false ? <FaRegEyeSlash onClick={() => setIconPassword(!iconPassword)}/> : <FaRegEye onClick={() => setIconPassword(!iconPassword)}/>)}
                    </span>
                </div>

                <div className="password"> {/* Confirm password input field with toggle visibility */}
                    <input 
                        type={iconConfirmPassword === false ? "password" : "text"}
                        id="confirmPassword" 
                        name="confirmPassword"
                        placeholder={t("Confirm password *")} 
                        value={props.user.confirmPassword}
                        onChange={handleInputChange}
                        required /> {/* Confirm password input field */}

                    <span> {/* Icon to toggle confirm password visibility */}
                        {(iconPassword === false ? <FaRegEyeSlash onClick={() => setIconPassword(!iconPassword)}/> : <FaRegEye onClick={() => setIconPassword(!iconPassword)}/>)}
                    </span>
                </div>

                <p className="message">{t(error)}</p> {/* Error message display */}

                <div className="wrap"> {/* Submit button wrapper */}
                    <button 
                        type="submit"
                        className="primary"
                        onClick={handleSubmit}>
                        {t('Sign up')} {/* Submit button */}
                    </button>
                </div>
            </form>

            <p>{t('Already have an account?')} &nbsp; {/* Link to switch to login form */}
                <a
                    href="#"
                    onClick={() => props.setForm("login")}>
                    {t('Sign in')}
                </a>
            </p>
        </div>
    )
}

export default Register; // Export Register component as default
