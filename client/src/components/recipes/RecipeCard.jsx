// RecipeCard.js
import React from 'react';
import './RecipeCard.css'; // Custom CSS for styling
import { TbCooker } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiFridgeLine } from "react-icons/ri";
import { TbBowlSpoon } from "react-icons/tb";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";


const RecipeCard = (props) => {
    return (
        <div className="recipe-card">
            <img src={props.recipe.image_url} alt={props.recipe.title} className="recipe-image" />
            <h2 className="recipe-title">{props.recipe.title}</h2>
            {props.index !== 0 ? 
                <div className="recipe-overlay">
                    <p>
                        <HiOutlineUserGroup className="recipe-item-logo" />
                        {props.recipe.persons}
                    </p>
                    <p>
                        <TbBowlSpoon className="recipe-item-logo"/>
                        {props.recipe.prep_time}
                    </p>
                    <p>
                        <TbCooker className="recipe-item-logo"/>
                        {props.recipe.cook_time}
                    </p>
                    <p>
                        <RiFridgeLine className="recipe-item-logo"/>
                        {props.recipe.rest_time}
                    </p>
                </div>
                :
                <div className="recipe-overlay">
                    < TbSquareRoundedPlusFilled className="recipe-item-add" />             </div>
            }
        </div>
    );
};

export default RecipeCard;
