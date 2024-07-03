import React, { useEffect, useState } from 'react'; // Import necessary hooks and components
import axios from "axios"; // Import axios for HTTP requests
import { Icon } from 'react-icons-kit'; // Import Icon component from react-icons-kit
import { eye } from "react-icons-kit/icomoon/eye"; // Import eye icon from react-icons-kit
import { eyeBlocked } from 'react-icons-kit/icomoon/eyeBlocked'; // Import eyeBlocked icon from react-icons-kit

const Login = (props) => {
    // State to manage user input for email and password
    const [user, setUser] = useState({ email: "", password: "" });
    // State to manage error messages
    const [error, setError] = useState("");
    // State to toggle password visibility
    const [iconPassword, setIconPassword] = useState(false);

    // Handle input change for email and password fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    // Handle form submission for login
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:4000/auth/login", user); // Send POST request to login endpoint
            console.log(res); // Log response data
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
            <h3> Sign in to organize your recipes</h3> {/* Heading */}
            <br/> {/* Line break */}
            <form action=""> {/* Login form */}

                {/* Email input field */}
                <input type="email"
                    id="email"
                    name="email"
                    placeholder="Email address"
                    value={user.email}
                    onChange={handleInputChange}
                    required />

                {/* Password input field with toggle icon */}
                <div className="password">
                    <input
                        type={iconPassword === false ? "password" : "text"}
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={handleInputChange}
                        required />
                    <span>
                        <Icon
                            icon={iconPassword === false ? eyeBlocked : eye} // Toggle between eyeBlocked and eye icons based on iconPassword state
                            onClick={() => setIconPassword(!iconPassword)} // Toggle iconPassword state onClick
                        />
                    </span>
                </div>

                {/* Forgot password link */}
                <a
                    href="#"
                    onClick={() => props.setForm("sendLink")}>
                    Forgot password ?
                </a>

                {/* Display error message if exists */}
                <p className="message">
                    {error}
                </p>

                <div className="wrap">
                    {/* Submit button */}
                    <button type="submit"
                            className="primary"
                            onClick={handleSubmit}>
                        Sign in
                    </button>
                </div>
            </form>

            {/* Link to register */}
            <p>Not registered? &nbsp;
                <a
                    href="#"
                    onClick={() => props.setForm("register")}>
                    Create an account
                </a>
            </p>
        </div>
    )
}

export default Login; // Export Login component
