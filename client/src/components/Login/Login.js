import React, {useState} from 'react';
import "./Login.css";

const Login = () => {
    return (
        <div className="login">
        <h3> Sign in to organize your recipes</h3>
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


        <p>Not registered? &nbsp;
            <a href="#">
                    Create an account
            </a>
        </p>
    </div>
    )
}

export default Login;