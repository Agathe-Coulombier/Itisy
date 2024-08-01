// RecipeList.js
import React from 'react';
import RecipeCard from './RecipeCard';
import './RecipesList.css'; // Custom CSS for styling

const RecipeList = (props) => {

    const reversedUserRecipes = [props.userRecipes[0], ...props.userRecipes.slice(1).reverse()];
    return (
        <div className="recipe-list">
            {reversedUserRecipes.map((userRecipe, index) => (
                <RecipeCard key={index} index={index} userRecipe={userRecipe} user={props.user} toggleClick={props.toggleClick} handleCardClick={props.handleCardClick}/>
            ))}
        </div>
    );
};

export default RecipeList;
