import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Icon} from 'react-icons-kit';
import {eye} from "react-icons-kit/icomoon/eye";
import {eyeBlocked} from 'react-icons-kit/icomoon/eyeBlocked'
import "./SendLink.css";

const SendLink = (props) => {
    const[user, setUser] = useState({"email":""});
    const [disabled, setDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [info, setInfo] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    useEffect(() => {
        let intervalId;
    
        if (disabled) {
        intervalId = setInterval(() => {
            setCountdown((prevCount) => prevCount - 1);
        }, 1000);
        }
    
        return () => {
        clearInterval(intervalId);
        };
    }, [disabled]);
    
    useEffect(() => {
        if (countdown === 0) {
        setDisabled(false);
        setCountdown(30);
        }
    }, [countdown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisabled(true);
        
        await axios
            .patch("http://localhost:4000/auth/send-link", user)
            .then(res =>{
                console.log(res)
                setInfo(res.data.message)
            })
            .catch(error => {
                console.error("Error response:", error.response);
                console.error("Error message:", error.message);
                console.error("Error code:", error.code);
            })
        
    };




    return (
        <div className="login">
        <h3> Receive a link</h3>
        <form action="">

            <input type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Email address" 
                    value={user.email}
                    onChange={handleInputChange}
                    required />

            <p>
                {info}
            </p>

            <div className="wrap">
                    <button type="submit"
                            className="primary"
                            disabled={disabled}
                            onClick={handleSubmit}>
                        {disabled ? `Wait ${countdown}s to send again` : 'Send a link'}
                    </button>
            </div>
        </form>
        
    </div>
    )
}

export default SendLink;