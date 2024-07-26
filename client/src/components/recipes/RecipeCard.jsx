// RecipeCard.js
import React from 'react';
import './RecipeCard.css'; // Custom CSS for styling
import { TbCooker } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiFridgeLine } from "react-icons/ri";
import { TbBowlSpoon } from "react-icons/tb";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";


const RecipeCard = (props) => {

    const modalForm = props.index === 0 ? "addRecipe" : "viewRecipe";

    return (
        <div className="recipe-card" onClick={() =>{ props.toggleClick(modalForm) ; props.handleCardClick(props.index)}}>
            <img src={props.userRecipe.image_url} alt={props.userRecipe.title} className="recipe-image" />
            <h2 className="recipe-title">{props.userRecipe.title}</h2>
            {props.index !== 0 ? 
                <div className="recipe-overlay">
                    <p>
                        <HiOutlineUserGroup className="recipe-item-logo" />
                        {props.userRecipe.persons}
                    </p>
                    <p>
                        <TbBowlSpoon className="recipe-item-logo"/>
                        {props.userRecipe.prep_time}
                    </p>
                    <p>
                        <TbCooker className="recipe-item-logo"/>
                        {props.userRecipe.cook_time}
                    </p>
                    <p>
                        <RiFridgeLine className="recipe-item-logo"/>
                        {props.userRecipe.rest_time}
                    </p>
                </div>
                :
                <div className="recipe-overlay">
                    < TbSquareRoundedPlusFilled className="recipe-item-modify" />             </div>
            }
        </div>
    );
};

export default RecipeCard;
