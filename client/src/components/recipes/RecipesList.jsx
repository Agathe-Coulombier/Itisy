// RecipeList.js
import React, { useEffect } from 'react';
import RecipeCard from './RecipeCard';
import './RecipesList.css'; // Custom CSS for styling

const RecipeList = (props) => {

    return (
        <div className="recipe-list">
            {props.userRecipes.map((userRecipe, index) => (
                <RecipeCard key={index} index={index} userRecipe={userRecipe} user={props.user} toggleClick={props.toggleClick} handleCardClick={props.handleCardClick}/>
            ))}
        </div>
    );
};

export default RecipeList;
