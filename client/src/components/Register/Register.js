import React, {useState} from 'react';
import "./Register.css";

const Register = () => {
    return (
        <div className="register">
        <h3> Create an account</h3>
        <form action="">

            <input type="text" 
                    id="email" 
                    name="email" 
                    placeholder="Email address" required />

            <input type="password"
                    id="password" 
                    name="password"
                    placeholder="Password" required />

            <div className="wrap">
                    <button type="submit"
                            className="primary">
                        Submit
                    </button>
            </div>
        </form>

        <p>Already have an account? &nbsp;
            <a href="#">
                    Sign in
            </a>
        </p>
    </div>
    )
}

export default Register;