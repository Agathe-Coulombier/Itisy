import React, {useState, useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom';

import { BiLoaderCircle } from "react-icons/bi";
import { FaRegEye, FaRegFile } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import Footer from '../../Footer/Footer';
import NavBar from '../../NavBar/Navbar';
import "./ResetPassword.css";

// Utility function to parse query parameters
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const ResetPassword = (props) => {
    const[user, setUser] = useState({"password":"", "confirmPassword":""});
    const [iconPassword, setIconPassword] = useState(false);
    const [iconConfirmPassword, setIconConfirmPassword] = useState(false);
    const[error, setError] = useState("");
    const [success, setSuccess] = useState(false); // State to track if password reset was successful
    const token = useQuery().get('token'); // Retrieve the token from the URL


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    // Handle form submission for password reset
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch(`http://localhost:4000/auth/resetPassword/${token}`, user, { withCredentials: true }); // Send PATCH request to resetPassword endpoint
            setUser({"password":"", "confirmPassword":""});
            setSuccess(true);
            setTimeout(() => {
                window.location.href = '/'; // Redirect to the main page
            }, 3000);

        } catch (error) {
            console.error("Error response:", error.response); // Log error response if request fails
            console.error("Error message:", error.message); // Log error message
            console.error("Error code:", error.code); // Log error code if available
            console.log(error.response.data.message)
            setError(error.response.data.message); // Set error message state with response data
        }
    };

    // Define the buttons to display in the NavBar
    const buttonItems = [
        {}
    ];

    return (
            <React.Fragment>
                <NavBar buttonItems={buttonItems}/> {/* Render NavBar component with toggleClick function */}

                {success ? (
                <div id="resetPassword" className="auth">
                    < img src={'/images/auth/lock_open.svg'} alt="Lock closed"/>
                    <h1>Your password is updated</h1>
                    <BiLoaderCircle id="loader"/>
                </div>
                ) : (

                <div id="resetPassword" className="auth">
                    <form>

                        < img src={'/images/auth/lock_closed.svg'} alt="Lock closed"/>

                        < div className="password">
                        <input 
                            type={iconPassword === false ? "password" : "text"}
                            id="password" 
                            name="password"
                            placeholder="Password *" 
                            value={user.password}
                            onChange={handleInputChange}
                            required />
                        <span >
                            {(iconPassword === false ? <FaRegEyeSlash onClick={() => setIconPassword(!iconPassword)}/> : <FaRegEye onClick={() => setIconPassword(!iconPassword)}/>)}
                        </span>
                    </div>

                    < div className="password">
                        <input 
                            type={iconConfirmPassword === false ? "password" : "text"}
                            id="confirmPassword" 
                            name="confirmPassword"
                            placeholder="Confirm password *" 
                            value={user.confirmPassword}
                            onChange={handleInputChange}
                            required />
                        <span >
                        {(iconPassword === false ? <FaRegEyeSlash onClick={() => setIconPassword(!iconPassword)}/> : <FaRegEye onClick={() => setIconPassword(!iconPassword)}/>)}
                        </span>
                    </div>

                    {/* Display error message if exists */}
                    <p className="message">
                        {error}
                    </p>

                    <div className="wrap">
                        <button type="submit"
                                className="primary"
                                onClick={handleSubmit}>
                            Change password
                        </button>
                    </div>

                </form>
                </div>
                )}

                <Footer /> {/* Render Footer component */}

            </React.Fragment>

    )
    }

export default ResetPassword;