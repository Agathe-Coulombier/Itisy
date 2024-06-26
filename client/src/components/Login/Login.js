import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Icon} from 'react-icons-kit';
import {eye} from "react-icons-kit/icomoon/eye";
import {eyeBlocked} from 'react-icons-kit/icomoon/eyeBlocked'
import "./Login.css";

const Login = (props) => {
    const[user, setUser] = useState({"email":"", "password":""});
    const[error, setError] = useState("");
    const [iconPassword, setIconPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios
            .post("http://localhost:4000/auth/login", user)
            .then(res =>{
                console.log(res)
            })
            .catch(error => {
                console.error("Error response:", error.response);
                console.error("Error message:", error.message);
                console.error("Error code:", error.code);
                setError(error.response.data.message)
            })
    }

    return (
        <div className="login">
        <h3> Sign in to organize your recipes</h3>
        <form action="">

            <input type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Email address" 
                    value={user.email}
                    onChange={handleInputChange}
                    required />

            <div className="passwordForm">
            <div className="password">
                <input 
                    type={iconPassword === false ? "password" : "text"}
                    id="password" 
                    name="password"
                    placeholder="Password" 
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
            <a
                href="#"
                onClick={() => props.setForm("SendLink")}>
                        Forgot password ?
            </a>
            </div>




            <p>
            {error}
            </p>

            <div className="wrap">
                    <button type="submit"
                            className="primary"
                            onClick={handleSubmit}>
                        Sign in
                    </button>
            </div>
        </form>


        <p>Not registered? &nbsp;
            <a
            href=""
            onClick={() => props.setForm("register")}>
                    Create an account
            </a>
        </p>
    </div>
    )
}

export default Login;