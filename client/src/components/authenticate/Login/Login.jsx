import React, { useState, useContext } from 'react'; // Import necessary hooks and components
import axios from "axios"; // Import axios for HTTP requests
import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";
import { AuthContext } from '../../../hooks/authContext';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const Login = (props) => {
    // State to manage error messages
    const [error, setError] = useState("");
    // State to toggle password visibility
    const [iconPassword, setIconPassword] = useState(false);
    const { setIsAuthenticated, login } = useContext(AuthContext); // Destructure setIsAuthenticated from context


    const {t} = useTranslation();
    const navigate = useNavigate();

    // Handle input change for email and password fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        props.setUser({ ...props.user, [name]: value });
    };

    // Handle form submission for login
    const handleSubmit = async (e) => {
        e.preventDefault();

        
        try {
            const res = await axios.post("http://localhost:4000/auth/login", props.user, { withCredentials: true }); // Send POST request to login endpoint

            if (res.status === 200) {
                setIsAuthenticated(true);
                await login(props.user, res);
                navigate('/dashboard'); // Redirect to the dashboard
                document.body.classList.remove("modal-open");
            }

        } catch (error) {
            console.error("Error response:", error.response); // Log error response if request fails
            console.error("Error message:", error.message); // Log error message
            console.error("Error code:", error.code); // Log error code if available
            setError(error.response.data.message); // Set error message state with response data
        }
    };

    // Render JSX
    return (
        <div className="login modal_content"> {/* Login modal content */}
            <h3> {t("Sign in to organize your recipes")}</h3> {/* Heading */}
            <br/> {/* Line break */}
            <form action=""> {/* Login form */}

                {/* Email input field */}
                <input type="email"
                    id="email"
                    name="email"
                    placeholder={t("Email address *")}
                    value={props.user.email}
                    onChange={handleInputChange}
                    required />

                {/* Password input field with toggle icon */}
                <div className="password">
                    <input
                        type={iconPassword === false ? "password" : "text"}
                        id="password"
                        name="password"
                        placeholder={t("Password *")}
                        value={props.user.password}
                        onChange={handleInputChange}
                        required />
                    <span>
                    {(iconPassword === false ? <FaRegEyeSlash onClick={() => setIconPassword(!iconPassword)}/> : <FaRegEye onClick={() => setIconPassword(!iconPassword)}/>)}
                    </span>
                </div>

                {/* Forgot password link */}
                <a
                    href="#"
                    onClick={() => props.setForm("sendLink")}>
                    {t("Forgot password?")}
                </a>

                {/* Display error message if exists */}
                <p className="message">
                    {t(error)}
                </p>

                <div className="wrap">
                    {/* Submit button */}
                    <button type="submit"
                            className="primary"
                            onClick={handleSubmit}>
                        {t("Sign in")}
                    </button>
                </div>
            </form>

            {/* Link to register */}
            <p>{t("Not registered?")} &nbsp;
                <a
                    href="#"
                    onClick={() => props.setForm("register")}>
                    {t("Create an account")}
                </a>
            </p>
        </div>
    )
}

export default Login; // Export Login component
