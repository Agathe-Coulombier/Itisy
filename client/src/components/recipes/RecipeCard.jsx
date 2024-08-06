// RecipeCard.js
import React from 'react';
import axios from 'axios';
import './RecipeCard.css'; // Custom CSS for styling
import { TbCooker } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiFridgeLine } from "react-icons/ri";
import { TbBowlSpoon } from "react-icons/tb";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineLocalPrintshop } from "react-icons/md";


const RecipeCard = (props) => {

    const modalForm = props.index === 0 ? "fetchRecipe" : "recipeContent";

    // Add recipe to user cookbook
    const handleDeleteRecipe = async (e) => {
        
        try {
            await axios.delete('http://localhost:4000/recipes/deleteRecipe',{
                params: {
                    recipe_id: props.userRecipe.recipe_id, 
                    user_id: props.user.id
            }});
            props.fetchUserRecipes();
        } catch (error) {
            // console.error('Error submitting newRecipe:', error)
            // setMessage([false, ' ', true, error.response.data.message]);
        }
    };

    return (
        <div className="recipe-card">
            <img src={props.userRecipe?.image_url || 'https://iili.io/doeXZZB.png'} alt={props.userRecipe.title} className="recipe-image"/>
            <h2 className="recipe-title">{props.userRecipe?.title || 'Add a recipe'}</h2>
            <div className='recipe-overlay'>
                {props.index !== 0 ? 
                    <div>
                    <div className="recipe-resume" onClick={(e) =>{ props.toggleClick(modalForm) ; props.handleCardClick(props.index, e)}}>
                        <p className="recipe-title">
                            {props.userRecipe.title}
                        </p>
                        <p>
                            <HiOutlineUserGroup className="recipe-item-logo" />
                            {props.userRecipe.persons}
                        </p>
                        {!(props.userRecipe.prep_time==='' || props.userRecipe.prep_time ==='-') &&
                            <p>
                                <TbBowlSpoon className="recipe-item-logo"/>
                                {props.userRecipe.prep_time}
                            </p>}
                        {!(props.userRecipe.cook_time==='' || props.userRecipe.cook_time ==='-') &&
                            <p>
                                <TbCooker className="recipe-item-logo"/>
                                {props.userRecipe.cook_time}
                            </p>}
                        {!(props.userRecipe.rest_time==='' || props.userRecipe.rest_time ==='-') &&
                            <p>
                                <RiFridgeLine className="recipe-item-logo"/>
                                {props.userRecipe.rest_time}
                            </p>}
                    </div>
                    <div className='recipe-actions'>
                        <FaRegEye className='recipe-actions-icon' onClick={(e) =>{ props.toggleClick(modalForm) ; props.handleCardClick(props.index, e)}}/>
                        <BiEditAlt className='recipe-actions-icon'/>
                        <MdOutlineLocalPrintshop className='recipe-actions-icon'/>
                        <AiOutlineDelete className='recipe-actions-icon' onClick={(e) => handleDeleteRecipe(e)}/>
                    </div>
                    </div>
                    :
                    <div className="recipe-resume" onClick={(e) =>{ props.toggleClick(modalForm) ; props.handleCardClick(props.index, e)}}>
                        < TbSquareRoundedPlusFilled className="recipe-item-modify" />
                    </div>
                }
            </div>
        </div>
    );
};

export default RecipeCard;
