// RecipeCard.js
import React from 'react';
import './RecipeCard.css'; // Custom CSS for styling

const RecipeCard = (props) => {
    console.log("", props.recipe)
    return (
        <div className="recipe-card">
            <img src={props.recipe.image_url} alt={props.recipe.title} className="recipe-image" />
            <div className="recipe-info">
                <h2 className="recipe-title">{props.recipe.title}</h2>
                <p>Persons: {props.recipe.persons}</p>
                <p>Prep Time: {props.recipe.prep_time}</p>
                <p>Cook Time: {props.recipe.cook_time}</p>
                <p>Rest Time: {props.recipe.rest_time}</p>
            </div>
        </div>
    );
};

export default RecipeCard;
