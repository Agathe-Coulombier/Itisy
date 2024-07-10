import React, { useState } from 'react'; // Import React and useState hook from React
import { Icon } from 'react-icons-kit'; // Import Icon component from react-icons-kit
import { eye } from "react-icons-kit/icomoon/eye"; // Import eye icon from react-icons-kit
import { eyeBlocked } from 'react-icons-kit/icomoon/eyeBlocked'; // Import eyeBlocked icon from react-icons-kit
import axios from "axios"; // Import axios for making HTTP requests

const Register = (props) => { // Define Register component with props parameter
    const [iconPassword, setIconPassword] = useState(false); // State variable to toggle password visibility
    const [iconConfirmPassword, setIconConfirmPassword] = useState(false); // State variable to toggle confirm password visibility
    const [error, setError] = useState(""); // State variable to manage error messages

    const handleInputChange = (e) => { // Event handler to update user state on input change
        const { name, value } = e.target;
        props.setUser({ ...props.user, [name]: value });
    };

    const handleSubmit = async (e) => { // Event handler to handle form submission
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const res = await axios.post("http://localhost:4000/auth/register", props.user); // Send POST request to register user
            console.log(res); // Log response data to console
        } catch (error) {
            console.error("Error response:", error.response); // Log error response data to console if request fails
            console.error("Error message:", error.message); // Log error message to console
            console.error("Error code:", error.code); // Log error code to console
            setError(error.response.data.message); // Set error message state with error response message
        }
    };

    return (
        <div className="register modal_content"> {/* Register form container */}
            <h3> Create an account</h3> {/* Heading */}
            <br/>
            <form action=""> {/* Registration form */}

                <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    placeholder="First name *" 
                    value={props.user.firstName}
                    onChange={handleInputChange}
                    required /> {/* First name input field */}

                <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    placeholder="Last name"
                    value={props.user.lastName}
                    onChange={handleInputChange} /> {/* Last name input field */}

                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Email address *" 
                    value={props.user.email}
                    onChange={handleInputChange}
                    required /> {/* Email address input field */}

                <div className="password"> {/* Password input field with toggle visibility */}
                    <input 
                        type={iconPassword === false ? "password" : "text"}
                        id="password" 
                        name="password"
                        placeholder="Password *" 
                        value={props.user.password}
                        onChange={handleInputChange}
                        required /> {/* Password input field */}

                    <span> {/* Icon to toggle password visibility */}
                        <Icon 
                            icon={iconPassword === false ? eyeBlocked : eye}
                            onClick={() => setIconPassword(!iconPassword)}
                        />
                    </span>
                </div>

                <div className="password"> {/* Confirm password input field with toggle visibility */}
                    <input 
                        type={iconConfirmPassword === false ? "password" : "text"}
                        id="confirmPassword" 
                        name="confirmPassword"
                        placeholder="Confirm password *" 
                        value={props.user.confirmPassword}
                        onChange={handleInputChange}
                        required /> {/* Confirm password input field */}

                    <span> {/* Icon to toggle confirm password visibility */}
                        <Icon 
                            icon={iconConfirmPassword === false ? eyeBlocked : eye}
                            onClick={() => setIconConfirmPassword(!iconConfirmPassword)}
                        />
                    </span>
                </div>

                <p className="message">{error}</p> {/* Error message display */}

                <div className="wrap"> {/* Submit button wrapper */}
                    <button 
                        type="submit"
                        className="primary"
                        onClick={handleSubmit}>
                        Sign up {/* Submit button */}
                    </button>
                </div>
            </form>

            <p>Already have an account? &nbsp; {/* Link to switch to login form */}
                <a
                    href="#"
                    onClick={() => props.setForm("login")}>
                    Sign in
                </a>
            </p>
        </div>
    )
}

export default Register; // Export Register component as default
