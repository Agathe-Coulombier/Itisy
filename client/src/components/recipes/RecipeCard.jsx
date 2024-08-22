// RecipeCard.js
import React, {useState, memo, useCallback, useEffect} from 'react';
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
import { useTranslation } from 'react-i18next';
import { PiCurrencyKztFill } from 'react-icons/pi';

const RecipeCard = memo((props) => {
    const { t } = useTranslation();
    const modalForm = props.index === 0 ? "fetchRecipe" : "recipeContent";
    const [ticked, setTicked] = useState(false); 
    
    useEffect(() => {
        if (props.trackMode === 'modify-folder') {
            if (props.userRecipe.folders && props.userRecipe.folders.includes(props.currentFolder)) {
                setTicked(true);
            } else {
                setTicked(false);
            }} else {
                setTicked(false);
            }
    }, [props.userRecipe.folders, props.currentFolder]); 

    // Add recipe to user cookbook
    const handleDeleteRecipe = async (e) => {
        
        try {
            await axios.delete('http://localhost:4000/recipes/deleteRecipe',{
                params: {
                    recipe_id: props.userRecipe.recipe_id, 
                    user_id: props.user.id,
                    folder_name: props.currentFolder
            }});
            props.fetchUserRecipes();
        } catch (error) {
            // console.error('Error submitting newRecipe:', error)
            // setMessage([false, ' ', true, error.response.data.message]);
        }
    };

    console.log(props.userRecipe)
    return (
        <div className= {ticked ? "recipe-card ticked" : "recipe-card"} onClick={() => props.setSelectedRecipeIndex(props.index)}>
            <img src={props.userRecipe?.image_url || 'https://iili.io/doeXZZB.png'} alt={props.userRecipe.title} className="recipe-image"/>
            <h2 className="recipe-title">{props.userRecipe?.title || t('Add a recipe')}</h2>
            <div className= {props.trackMode ==='create-folder' || props.trackMode ==='modify-folder' ? 'create-folder' : 'recipe-overlay'}>
                {props.trackMode === 'create-folder' || props.trackMode === 'modify-folder' ? 
                    <input type="checkbox" checked={ticked} className="plus-minus" onChange={(e) => {props.toggleRecipeItem(props.userRecipe.recipe_id); setTicked(!ticked)}} />
                    :
                    (props.index !== 0 ? 
                    <div>
                    <div className="recipe-resume" onClick={(e) =>{ props.toggleClick(modalForm) ; props.handleCardClick(props.index, e)}}>
                        <p className="recipe-title">
                            {props.userRecipe.title}
                        </p>
                        <div className='meta-info'>
                        <span>
                            <HiOutlineUserGroup className="recipe-item-logo" />
                            {props.userRecipe.persons}
                        </span>
                        {!(props.userRecipe.prep_time==='' || props.userRecipe.prep_time ==='-') &&
                            <span>
                                <TbBowlSpoon className="recipe-item-logo"/>
                                {props.userRecipe.prep_time}
                            </span>}
                        {!(props.userRecipe.cook_time==='' || props.userRecipe.cook_time ==='-') &&
                            <span>
                                <TbCooker className="recipe-item-logo"/>
                                {props.userRecipe.cook_time}
                            </span>}
                        {!(props.userRecipe.rest_time==='' || props.userRecipe.rest_time ==='-') &&
                            <span>
                                <RiFridgeLine className="recipe-item-logo"/>
                                {props.userRecipe.rest_time}
                            </span>}
                        </div>
                    </div>
                    <div className='recipe-actions'>
                        <FaRegEye className='recipe-actions-icon' onClick={(e) =>{ props.toggleClick(modalForm) ; props.handleCardClick(props.index, e) ; props.setEditRecipe(false)}}/>
                        <BiEditAlt className='recipe-actions-icon' onClick={(e) =>{ props.toggleClick(modalForm) ; props.handleCardClick(props.index, e) ; props.setEditRecipe(true)}}/>
                        <MdOutlineLocalPrintshop className='recipe-actions-icon' onClick={() => props.handlePrint(props.userRecipes[props.index])}/>
                        <AiOutlineDelete className='recipe-actions-icon' onClick={(e) => handleDeleteRecipe(e)}/>
                    </div>
                    </div>
                    :
                    <div className="recipe-resume" onClick={(e) =>{ props.toggleClick(modalForm) ; props.handleCardClick(props.index, e)}}>
                        < TbSquareRoundedPlusFilled className="recipe-item-modify" />
                    </div>)
                }
            </div>
        </div>
    );
});

export default RecipeCard;
