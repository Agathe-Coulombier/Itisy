import React, { useState, useContext } from 'react'; // Import necessary hooks and components
import axios from "axios"; // Import axios for HTTP requests
import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";
import './viewRecipe.css'
import { TbCooker } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiFridgeLine } from "react-icons/ri";
import { TbBowlSpoon } from "react-icons/tb";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";

const ViewRecipe = (props) => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const recipe = props.recipes[props.selectedRecipeIndex];

    // Render JSX
    return (
        <div className="recipe-details">

            <div className="recipe-content modal_content">
                <div className="left-column">
                    <div className="recipe-header">
                        <h1 className="recipe-title">{recipe.title}</h1>
                        <div className="recipe-meta">
                            <span className="meta-item">
                                <HiOutlineUserGroup className="recipe-item-logo" />
                                {recipe.persons} </span>
                            <span className="meta-item">
                                <TbBowlSpoon className="recipe-item-logo"/>
                                {recipe.prep_time}</span>
                            <span className="meta-item">
                                <TbCooker className="recipe-item-logo"/>
                                {recipe.cook_time}</span>
                            <span className="meta-item">
                                <RiFridgeLine className="recipe-item-logo"/>
                                {recipe.rest_time}</span>
                        </div>
                    </div>
                    <img src={recipe.image_url} alt={recipe.title} className="recipe-image" />
                </div>
                <div className="right-column">
                    <div className="recipe-ingredients">
                        <h2>Ingredients</h2>
                        <ul>
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="recipe-steps">
                        <h2>Directions</h2>
                        <ol>
                            {recipe.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewRecipe; // Export Login component