import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeContent from './RecipeContent';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TbCooker } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiFridgeLine } from "react-icons/ri";
import { TbBowlSpoon } from "react-icons/tb";
import { PiUploadSimpleBold } from "react-icons/pi";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import Loader from '../Loader/Loader'
import './fetchRecipe.css';

const FetchRecipe = (props) => {
    const { t } = useTranslation(); // Translations
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [newRecipe, setNewRecipe] = useState({
        title: '',
        image_url: 'https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png',
        prep_time: '',
        cook_time: '',
        rest_time: '',
        persons: '',
        ingredients: [t('Add a first ingredient')],
        steps: [t('Add a first step')],
        source: ''
    });

    const [loading, setLoading] = useState(false);
    const [addRecipeField, setAddRecipeField] = useState(false);
    const [modifyList, setModifyList] = useState({ingredients:false, steps:false});
    const [originalValue, setOriginalValue] = useState({});
    const [message, setMessage] = useState([false, ' ', false, 'Add recipe']);

    // Handle url field modifications
    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    // Fetch the recipe based on the url pasted by the user
    const handleFetchRecipe = async () => {
        try {
            setLoading(true);
            setAddRecipeField(false);
            setMessage([false, '']);
            const response = await axios.get("http://localhost:4000/recipes/scrap", { params: { url } } );
            setNewRecipe(response.data.newRecipe);
            setModifyList({ingredients:false, steps:false});
            setLoading(false);
            setAddRecipeField(true);
            props.setEditRecipe(true);
            setMessage([true, "Your recipe is scraped! Modify info if needed, then validate it.", false, ''])
            document.getElementById("fetching-status").style.color = "darkgreen";
            console.log(newRecipe)
        } catch (error) {
            setLoading(false);
            console.error('Error fetching newRecipe:', error.response.data.message);
            setMessage([true, error.response.data.message, false, ' ']);
        }
    };

    // Add recipe to user cookbook
    const handleAddRecipe = async (e, newRecipe) => {
        e.stopPropagation();
        try {
            console.log('add', newRecipe)
            await axios.post('http://localhost:4000/recipes/addRecipe', {
                newRecipe: newRecipe, 
                user_id: props.user.id
            });
            props.closeModal();
            props.fetchUserRecipes();
        } catch (error) {
            console.error('Error submitting newRecipe:', error)
            setMessage([false, ' ', true, error.response.data.message]);
        }
    };


    return (
        <div className="add-newRecipe modal-content">
            <h3>{t("Add a recipe to your cook book")}</h3>
            <br/>
            <form 
                onSubmit={handleFetchRecipe}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                    e.preventDefault();
                    handleFetchRecipe();
                    }
                }}>
                <div>
                    {addRecipeField ? 
                        <p className="fetch-a-recipe">
                        {t("Do you want to fetch a recipe?")}
                        <a style={{cursor:"pointer"}} onClick={() => setAddRecipeField(false)}>{t("Click here")}</a>
                        </p>
                        :
                        <div className="scrapRecipe">
                            <input type="text" value={url} placeholder={t("Start by pasting the URL address of the recipe you spotted")} onChange={handleUrlChange} />
                            <button type="button" className="secondary" onClick={handleFetchRecipe}>{t("Fetch Recipe")}</button>
                        </div>
                    }
                                    </div>
                {!addRecipeField && !loading ? 
                <p className="start-from-scratch">
                    {t("Do you want to start from scratch?")}
                    <a style={{cursor:"pointer"}} onClick={() => setAddRecipeField(true)}>{t("Click here")}</a>
                </p>:
                <p>{t(" ")}</p>
                }
                </form>
                
                {loading &&
                <div className="loader-container">
                    <p>{t('Your recipe content is loading, this may take a few minutes ...')}</p>
                    <Loader />
                    
                </div>
                }
                <p className="fetching-status" id="fetching-status">{message[0] && t(message[1])}</p>
                {addRecipeField && 
                <div>
                < RecipeContent mode={'add'} message={[message[2], message[3]]} handleAddRecipe={handleAddRecipe} editRecipe={props.editRecipe} setEditRecipe={props.setEditRecipe} newRecipe={newRecipe} userRecipes={props.userRecipes} selectedRecipeIndex={props.selectedRecipeIndex} />
                </div>
                }
        </div>
    );
};

export default FetchRecipe;
