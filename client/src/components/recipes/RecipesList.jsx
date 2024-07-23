// RecipeList.js
import React from 'react';
import RecipeCard from './RecipeCard';
import './RecipesList.css'; // Custom CSS for styling

const RecipeList = (props) => {
    
    return (
        <div className="recipe-list">
            {props.recipes.map((recipe, index) => (
                <RecipeCard key={index} index={index} recipe={recipe} toggleClick={props.toggleClick} handleCardClick={props.handleCardClick}/>
            ))}
        </div>
    );
};

export default RecipeList;
