// RecipeList.js
import React, { useEffect, memo, useCallback, useState } from 'react';
import RecipeCard from './RecipeCard';

const RecipeList = memo((props) => {

    console.log('recipelist', props.currentFolder)
    useEffect(() => {
        if (props.trackMode === 'view') {
            props.setRecipesToDisplay([props.userRecipes[0], ...props.userRecipes.filter(e => e.folders && e.folders.includes(props.currentFolder))]);
        } else if (props.trackMode === 'create-folder' || props.trackMode === 'modify-folder') {
            props.setRecipesToDisplay(props.userRecipes.slice(1)); 
        }
    }, [props.trackMode, props.userRecipes, props.currentFolder]);
    
    
    return (
        <div className="recipe-list">
            {props.recipesToDisplay.map((userRecipe, index) => (
                <RecipeCard recipesToDisplay={props.recipesToDisplay} currentFolder={props.currentFolder} trackMode={props.trackMode} ticked={props.ticked} setTicked={props.setTicked} createFolder={props.createFolder} editRecipe={props.editRecipe} setEditRecipe={props.setEditRecipe} key={index} index={index} userRecipe={userRecipe} user={props.user} fetchUserRecipes={props.fetchUserRecipes} toggleClick={props.toggleClick} handleCardClick={props.handleCardClick} toggleRecipeItem={props.toggleRecipeItem}/>
            ))}
        </div>
    );
});

export default RecipeList;
