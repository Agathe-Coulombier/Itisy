import React, {useState, useEffect, useRef} from 'react';
import logoTab from "../../../Resources/logoTab.png";
import {Icon} from 'react-icons-kit';
import {eye} from "react-icons-kit/icomoon/eye";
import {eyeBlocked} from 'react-icons-kit/icomoon/eyeBlocked';
import axios from "axios";


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

    return (
        <form>
            <nav id="navbar">
                < div className="items">
                    <div className="left subItems">
                        <img src={logoTab} alt="Chef hat logo"/>
                        <h1 className="text" >itisy</h1>
                    </div>
                </ div>
                < hr />
            </ nav>

            <div id="reset-password" classname="content">
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
                </div>

            <div className="wrap">
                <button type="submit"
                        className="primary"
                        onClick={handleSubmit}>
                    Change password
                </button>
            </div>

        </form>


    );
    }

export default ResetPassword;