import React, { forwardRef } from "react"; // Import necessary modules from React
import Login from "../Login/Login"; // Import the Login component
import Register from "../Register/Register"; // Import the Register component
import SendLink from "../SendLink/SendLink"; // Import the SendLink component
import { Icon } from 'react-icons-kit'; // Import Icon component from react-icons-kit
import { cross } from "react-icons-kit/icomoon/cross"; // Import the cross icon from react-icons-kit
import "./Modal.css"; // Import local CSS file for styling

const Modal = forwardRef((props, ref) => { // Define Modal component using forwardRef to forward ref to a child component
    const FormComponents = { // Define an object mapping form types to their respective components
        "login": Login,
        "register": Register,
        "sendLink": SendLink
    };
    
    const SelectedForm = FormComponents[props.formType]; // Select the appropriate form component based on the formType prop
    
    return (
        <div id="authModal" className="modal auth" ref={ref}> {/* Render the modal container with id, class, and ref */}
            <Icon icon={cross} id="closeModal" className="cross" alt="Close page" onClick={props.closeIcon}/> {/* Render a close icon with onClick handler */}
            {SelectedForm ? <SelectedForm setForm={props.setForm} user={props.user} setUser={props.setUser} /> : null} {/* Render the selected form component if it exists */}
        </div>
    );
});

export default Modal; // Export the Modal component as the default export
