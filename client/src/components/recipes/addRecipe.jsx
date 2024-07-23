import React, { useState, useContext } from 'react'; // Import necessary hooks and components
import axios from "axios"; // Import axios for HTTP requests
import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";

const AddRecipe = (props) => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    // Render JSX
    return (
        <div className="login modal_content"> {/* Login modal content */}
            <h3> {t("ADD RECIPE")}</h3> {/* Heading */}
            <br/> {/* Line break */}
        </div>
    )
}

export default AddRecipe; // Export Login component