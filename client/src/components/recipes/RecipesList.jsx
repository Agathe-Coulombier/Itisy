// RecipeList.js
import React, { useEffect, memo, useCallback, useState } from 'react';
import RecipeCard from './RecipeCard';
import './RecipesList.css'; // Custom CSS for styling

const RecipeList = memo((props) => {

    let recipesToPlot = [];
    if (props.createFolder){
        recipesToPlot =  props.userRecipes.slice(1);
    } else {
        recipesToPlot =  props.userRecipes;
    }



    return (
        <div className="recipe-list">
            {recipesToPlot.map((userRecipe, index) => (
                <RecipeCard createFolder={props.createFolder} editRecipe={props.editRecipe} setEditRecipe={props.setEditRecipe} key={index} index={index} userRecipe={userRecipe} user={props.user} fetchUserRecipes={props.fetchUserRecipes} toggleClick={props.toggleClick} handleCardClick={props.handleCardClick} toggleRecipeItem={props.toggleRecipeItem}/>
            ))}
        </div>
    );
});

export default RecipeList;
