import React, { forwardRef } from "react"; // Import necessary modules from React
import Login from "../authenticate/Login/Login"; // Import the Login component
import Register from "../authenticate/Register/Register"; // Import the Register component
import SendLink from "../authenticate/SendLink/SendLink"; // Import the SendLink component
import ViewRecipe from "../recipes/viewRecipe.jsx";
import AddRecipe from "../recipes/addRecipe.jsx";
import { CgClose } from "react-icons/cg";
import "./Modal.css"; // Import local CSS file for styling

const Modal = forwardRef((props, ref) => { // Define Modal component using forwardRef to forward ref to a child component

    const FormComponents = { // Define an object mapping form types to their respective components
        "login": Login,
        "register": Register,
        "sendLink": SendLink,
        "viewRecipe": ViewRecipe,
        "addRecipe": AddRecipe,
    };
    const SelectedForm = FormComponents[props.formType]; // Select the appropriate form component based on the formType prop

    return (
        <div className="modal-overlay" >
            <div id="modal-content" className="modal-content" ref={ref} > {/* Render the modal container with id, class, and ref */}
                <CgClose id="closeModal" className="cross" alt="Close page" onClick={props.closeIcon}/> {/* Render a close icon with onClick handler */}
                {SelectedForm ? <SelectedForm setForm={props.setForm} user={props.user} setUser={props.setUser} recipes={props.recipes} selectedRecipeIndex={props.selectedRecipeIndex}/> : null} {/* Render the selected form component if it exists */}
            </div>
        </div>
    );
});

export default Modal; // Export the Modal component as the default export
