import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TbCooker } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiFridgeLine } from "react-icons/ri";
import { TbBowlSpoon } from "react-icons/tb";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import './addRecipe.css'; // Ensure you create this CSS file with the styles

const AddRecipe = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [url, setUrl] = useState('https://www.elle.fr/Elle-a-Table/Recettes-de-cuisine/Besboussa-3890919');
    const [newRecipe, setNewRecipe] = useState({
        title: '',
        imageUrl: '',
        prepTime: '',
        cookTime: '',
        restTime: '',
        persons: '',
        ingredients: ['Add a first ingredient'],
        steps: ['Add a first step'],
        source: ''
    });

    const [modifyList, setModifyList] = useState({ingredients:false, steps:false});

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const handleFetchRecipe = async () => {
        try {
            console.log("URL: ", url)
            const response = await axios.get("http://localhost:4000/recipes/scrap", { params: { url } } );
            console.log(response.data.newRecipe);
            setNewRecipe(response.data.newRecipe);
            setModifyList({ingredients:false, steps:false});
        } catch (error) {
            console.error('Error fetching newRecipe:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecipe({
            ...newRecipe,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/newRecipes', newRecipe);
            navigate('/newRecipes');
        } catch (error) {
            console.error('Error submitting newRecipe:', error);
        }
    };

    const accessList = (eltType) => {
        console.log("accessList", newRecipe[eltType]);
        if (newRecipe[eltType].length > 0){
            newRecipe[eltType] = newRecipe[eltType].join('\n');
        }
        setModifyList(prevState => ({
            ...prevState,
            [eltType]: true
        }));
        console.log(modifyList)
    };

    const editList = (eltType) => {
        console.log("editList", newRecipe[eltType])
        if (newRecipe[eltType].length > 0){
            console.log("editList -", newRecipe[eltType])
            newRecipe[eltType] = newRecipe[eltType].split('\n');
        }
        setModifyList(prevState => ({
            ...prevState,
            [eltType]: false
        }));   
    }

    const renderList = (eltType) => {
        console.log("renderIngredients", newRecipe[eltType])
        if (newRecipe[eltType].length > 0){
            return newRecipe[eltType].map((elt, index) => (
                <li key={index}>{elt}</li>
            ));
        } else{
            return <li> </li>
        }
    };

    console.log("modify ing", modifyList["ingredients"])

    return (
        <div className="add-newRecipe modal-content">
            <h3>{t("ADD RECIPE")}</h3>
            <br/>
            <form onSubmit={handleSubmit}>
                <p>{t('Start by pasting below the url of the recipe you want')}</p>
                <div className="scrapRecipe">
                                        <input type="text" value={url} placeholder={t("Recipe URL")} onChange={handleUrlChange} />
                    <button type="button" className="secondary" onClick={handleFetchRecipe}>{t("Fetch Recipe")}</button>
                </div>
                <p>{t("Do you want to add it manually?")}</p>
                <span>{t("Click here")}</span>
                <div className="recipe-content">
                    <div className="left-column">
                        <div className="recipe-header">
                            <input type="text" className="recipe-title" name="title" placeholder={t("Title")} value={newRecipe.title} onChange={handleInputChange} />
                            <div className="recipe-meta">
                                <span className="meta-item">
                                    <HiOutlineUserGroup className="recipe-item-logo" />
                                    <input type="text" name="persons" placeholder={t("Persons")} value={newRecipe.persons} onChange={handleInputChange} />
                                </span>
                                <span className="meta-item">
                                    <TbBowlSpoon className="recipe-item-logo" />
                                    <input type="text" name="prepTime" placeholder={t("Prep Time")} value={newRecipe.prepTime} onChange={handleInputChange} />
                                </span>
                                <span className="meta-item">
                                    <TbCooker className="recipe-item-logo" />
                                    <input type="text" name="cookTime" placeholder={t("Cook Time")} value={newRecipe.cookTime} onChange={handleInputChange} />
                                </span>
                                <span className="meta-item">
                                    <RiFridgeLine className="recipe-item-logo" />
                                    <input type="text" name="restTime" placeholder={t("Rest Time")} value={newRecipe.restTime} onChange={handleInputChange} />
                                </span>
                            </div>
                        </div>
                        <input type="text" name="image" placeholder={t("Image URL")} value={newRecipe.imageUrl} onChange={handleInputChange} className="recipe-image-input" />
                        <img src={newRecipe.imageUrl} alt={newRecipe.title} className="recipe-image" />
                    </div>
                    <div className="right-column">
                        <div className="recipe-ingredients">
                            <h2>{t("Ingredients")}</h2>
                            {modifyList["ingredients"] && <button type="submit" className="secondary" onClick={() => editList('ingredients')}>ok</button>}
                            {modifyList["ingredients"] ?
                            <div>
                                <textarea
                                    name="ingredients"
                                    placeholder={t("Ingredients")}
                                    value={newRecipe.ingredients}
                                    onChange={handleInputChange}
                                    rows="5"
                                ></textarea>
                            </div>
                            :
                            <ul onClick={() => accessList('ingredients')}>
                                {renderList('ingredients')}
                            </ul>
                            }
                        </div>
                        {/* <div className="recipe-steps">
                            <h2>{t("Steps")}</h2>
                            <textarea name="steps" placeholder={t("Steps")} value={newRecipe.steps} onChange={handleInputChange}></textarea>
                        </div> */}
                            <div className="recipe-steps">
                            <h2>{t("Steps")}</h2>
                            {modifyList["steps"] && <button type="submit" className="secondary" onClick={() => editList('steps')}>ok</button>}
                            {modifyList["steps"] ?
                            <div>
                                <textarea
                                    name="steps"
                                    placeholder={t("Steps")}
                                    value={newRecipe.steps}
                                    onChange={handleInputChange}
                                    rows="5"
                                ></textarea>
                            </div>
                            :
                            <ul onClick={() => accessList('steps')}>
                                {renderList('steps')}
                            </ul>
                            }
                        </div>
                    </div>
                </div>
                <button className="primary" type="submit">{t("Add Recipe")}</button>
            </form>
        </div>
    );
};

export default AddRecipe;
