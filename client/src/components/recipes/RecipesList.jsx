// RecipeList.js
import React from 'react';
import RecipeCard from './RecipeCard';
import './RecipesList.css'; // Custom CSS for styling

const RecipeList = (props) => {
    
    console.log("hello")
    console.log(props)
    return (
        <div className="recipe-list">
            {props.recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
            ))}
        </div>
    );
};

export default RecipeList;
