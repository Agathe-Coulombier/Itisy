import React, { useEffect, useState } from 'react'; // Importing necessary modules from React
import axios from "axios"; // Importing axios for making HTTP requests
import { Icon } from 'react-icons-kit'; // Importing Icon component from react-icons-kit
import { eye } from "react-icons-kit/icomoon/eye"; // Importing eye icon from react-icons-kit
import { eyeBlocked } from 'react-icons-kit/icomoon/eyeBlocked'; // Importing eyeBlocked icon from react-icons-kit

const SendLink = (props) => {
    // State variables to manage form data, input fields, and error messages
    const [disabled, setDisabled] = useState(false); // State to manage button disabled state
    const [countdown, setCountdown] = useState(30); // State for countdown timer
    const [msg, setMsg] = useState(""); // State for message handling

    // Function to handle changes in the input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        props.setUser({ ...props.user, [name]: value }); // Update user state with new input value
    };

    // Effect hook to manage countdown timer
    useEffect(() => {
        let intervalId;

        // Start countdown timer when disabled state is true
        if (disabled) {
            intervalId = setInterval(() => {
                setCountdown((prevCount) => prevCount - 1); // Decrease countdown every second
            }, 1000);
        }

        // Cleanup function to clear interval when component unmounts or disabled state changes
        return () => {
            clearInterval(intervalId); // Clear the interval
        };
    }, [disabled]);

    // Effect hook to reset countdown when it reaches 0
    useEffect(() => {
        if (countdown === 0) {
            setDisabled(false); // Enable the button again after countdown finishes
            setMsg(""); // Reset message
            setCountdown(30); // Reset countdown timer
        }
    }, [countdown]);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const res = await axios.patch("http://localhost:4000/auth/send-link", props.user); // Send POST request with user data
            console.log(res); // Log response to console
            setDisabled(true); // Disable the button after successful submission
            setMsg(res.data.message); // Set request message state based on server response
        } catch (error) {
            console.error("Error response:", error.response); // Log error response if request fails
            console.error("Error message:", error.message); // Log error message
            console.error("Error code:", error.code); // Log error code if available
            setMsg(error.response.data.message); // Set error message state based on server response
        }
    };

    // JSX structure for rendering the SendLink component
    return (
        <div className="sendLink modal_content">
            <h3> Receive a link</h3>
            <br />
            <form action="">

                {/* Input field for entering email address */}
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email address"
                    value={props.user.email}
                    onChange={handleInputChange} // Handle input changes with handleInputChange function
                    required />

                {/* Display message if there is any */}
                <p 
                    className="message"
                    style={{ color: msg === "A mail has been successfully sent, check your spams if you can't find it" ? 'darkgreen' : 'darkred' }}>
                    {msg}
                </p>

                <div className="wrap">
                    {/* Button to submit the form */}
                    <button
                        type="submit"
                        className="primary"
                        disabled={disabled} // Disable button when disabled state is true
                        onClick={handleSubmit}> {/* Handle form submission with handleSubmit function */}
                        {disabled ? `Nothing? ${countdown}s to wait` : 'Send a link'} {/* Display appropriate text based on disabled state */}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SendLink; // Export SendLink component as default export
