import React, {useState} from 'react';
import {Icon} from 'react-icons-kit';
import {eye} from "react-icons-kit/icomoon/eye";
import {eyeBlocked} from 'react-icons-kit/icomoon/eyeBlocked'
import axios from "axios";
import "./Register.css";

const Register = (props) => {
    const[user, setUser] = useState({"email":"", "password":"", "confirmPassword":"", "firstName":"", "lastName":""});
    const [iconPassword, setIconPassword] = useState(false);
    const [iconConfirmPassword, setIconConfirmPassword] = useState(false);
    const[error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios
            .post("http://localhost:4000/auth/register", user)
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
        <div className="register">
        <h3> Create an account</h3>
        <form action="">
        <input type="text" 
            id="firstName" 
            name="firstName" 
            placeholder="First name *" 
            value={user.firstName}
            onChange={handleInputChange}
            required />

        <input type="text" 
            id="lastName" 
            name="lastName" 
            placeholder="Last name"
            value={user.lastName}
            onChange={handleInputChange}/>

        <input type="email" 
            id="email" 
            name="email" 
            placeholder="Email address *" 
            value={user.email}
            onChange={handleInputChange}
            required />

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

            <div className="wrap">
                    <button type="submit"
                            className="primary"
                            onClick={handleSubmit}>
                        Sign up
                    </button>
            </div>
        </form>

        <p>Already have an account? &nbsp;
        <a
            href=""
            onClick={() => props.setForm("login")}>
                    Sign in
            </a>
        </p>
    </div>
    )
}

export default Register;