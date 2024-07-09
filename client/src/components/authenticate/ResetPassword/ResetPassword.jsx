import React, {useState, useEffect, useRef} from 'react';
import logoTab from "../../../Resources/logoTab.png";
import {Icon} from 'react-icons-kit';
import {eye} from "react-icons-kit/icomoon/eye";
import {eyeBlocked} from 'react-icons-kit/icomoon/eyeBlocked';
import axios from "axios";
import Footer from '../../Footer/Footer';
import NavBar from '../../NavBar/Navbar';
import "./ResetPassword.css";

const ResetPassword = (props) => {
    const[user, setUser] = useState({"token":"", "password":"", "confirmPassword":""});
    const [iconPassword, setIconPassword] = useState(false);
    const [iconConfirmPassword, setIconConfirmPassword] = useState(false);
    const[error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    // Define the buttons to display in the NavBar
    const buttonItems = [
        {}
    ];

    return (
            <div>
                <NavBar buttonItems={buttonItems}/> {/* Render NavBar component with toggleClick function */}

                <div id="resetPassword" className="main_content">
                    <form>
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
                            <Icon 
                            icon={(iconPassword === false ? eyeBlocked : eye)}
                            onClick={() => setIconPassword(!iconPassword)}
                            />
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
                            <Icon 
                            icon={(iconConfirmPassword === false ? eyeBlocked : eye)}
                            onClick={() => setIconConfirmPassword(!iconConfirmPassword)}
                            />
                        </span>
                    </div>

                    <p>{error}</p>

                </form>

                    <div className="wrap">
                        <button type="submit"
                                className="primary"
                                onClick={handleSubmit}>
                            Change password
                        </button>
                    </div>
                </div>

                <Footer /> {/* Render Footer component */}

            </div>

    );
    }

export default ResetPassword;