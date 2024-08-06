import React, { useState, useEffect } from 'react'; // Import necessary hooks and components
import axios from "axios"; // Import axios for HTTP requests
import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";
import './RecipeContent.css'
import { TbCooker } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiFridgeLine } from "react-icons/ri";
import { TbBowlSpoon } from "react-icons/tb";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import { PiUploadSimpleBold } from "react-icons/pi";
import { BiEditAlt } from "react-icons/bi";
import { GrValidate } from "react-icons/gr";



const RecipeContent = (props) => {

    const [recipe, setRecipe] = useState(() => {
        if (props.newRecipe){
            return props.newRecipe
        } else if (props.selectedRecipeIndex === 0) {
            return {
                title: '',
                image_url: 'https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png',
                prep_time: '',
                cook_time: '',
                rest_time: '',
                persons: '',
                ingredients: ['Add a first ingredient'],
                steps: ['Add a first step'],
                source: ''
            };
        } else if (props.selectedRecipeIndex >= 0 && props.userRecipes[props.selectedRecipeIndex]) {
            return props.userRecipes[props.selectedRecipeIndex];
        } else {
            return {}; // Fallback state
        }
    });

    const { t } = useTranslation(); 
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [modifyList, setModifyList] = useState({ingredients:false, steps:false});
    const [originalValue, setOriginalValue] = useState({});
    const [message, setMessage] = useState([false, ' ', false, ' ']);
    const [editRecipe, setEditRecipe] = useState(false)
    
    const handleFocus = (e) => {
        // Store the original value when the input gains focus
        const { name, value } = e.target;
        setOriginalValue((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    // Automatically adjust the height of text areas
    function adjustHeight(e, textarea) {

        console.log(e.target.scrollHeight)
        if (textarea){
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        } else {
            e.target.style.height = 'auto'; // Reset height to auto to recalculate
            e.target.style.height = e.target.scrollHeight + 'px'; // Set height to scrollHeight
        }
    };


    // Handle input field modifications
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecipe({
            ...recipe,
            [name]: value
        });
        adjustHeight(e);
    };

    const handleKeyPress = (e) => {
        // Validating inputs modifications on keyboard/enter press (except list items)
        if (e.key === 'Enter') {
            if (e.target.name !== 'ingredients' && e.target.name !== 'steps'){
                e.preventDefault();
                e.target.blur();
        // Restoring the initial value and blur the input field on escape press
        }} else if (e.key === 'Escape') {
        // Revert to original value on Escape key press
        const { name } = e.target;
        setRecipe((prev) => ({
            ...prev,
            [name]: originalValue[name] || '',
        }));
            e.target.blur();
            }
    };

    // Accessing the list items editor mode
    const accessList = (eltType, e) => {

        // Turning the list of elements into a unique string made of one line per element
        if (recipe[eltType].length > 0 && !modifyList[eltType]){
            recipe[eltType] = recipe[eltType].join('\n');
        }

        // Allow modifications by the user
        setModifyList(prevState => ({
            ...prevState,
            [eltType]: true
        }));

        setTimeout(() => {
            let textarea = document.querySelector(`textarea[name=${eltType}]`);
            if (textarea) {

                // Going to editor mode after clicking on the list items
                textarea.focus({preventScroll:false});
                
                // Place the cursor at the end of the text already entered
                textarea.setSelectionRange(textarea.value.length,textarea.value.length);

                adjustHeight(e, textarea);
                
            }
        }, 0);

        // Make the input empty if nothing added yet
        if (recipe[eltType] ==='Add a first ingredient' || recipe[eltType] === 'Add a first step') {
            recipe[eltType] = '';
        }
    };

    // Validating the list items edition
    const editList = (eltType, event) => {
        event.preventDefault();

        // Turning the string into a list of items
        if (recipe[eltType].length > 0 && modifyList[eltType]){
            recipe[eltType] = recipe[eltType].split('\n');
            console.log(recipe[eltType].type)

        // If nothing written by user, putting back the default values
        } else {
            if (eltType==='ingredients'){
                recipe[eltType] = ['Add a first ingredient'];
                } else if (eltType==='steps') {
                    recipe[eltType] = ['Add a first step'];
                }};

        // Quitting the editing mode
        setTimeout(() => {
            setModifyList(prevState => ({
                ...prevState,
                [eltType]: false
            }));
        }, 100);
    }

    // Plotting list items
    const renderList = (eltType) => {
        
        if (recipe[eltType].length > 1){
            return recipe[eltType].map((elt, index) => (
                <li key={index}>{elt}</li>
            ));
        } else{
            return <li> {recipe[eltType]}</li>
        }
    };

    // Trigger image input click
    const handleImageClick = () => {
        document.getElementById('imageInput').click(); 
        };

    // Upload an image for the recipe
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
            setRecipe({
                ...recipe,
                ['image_url']: reader.result
            });
            };
        reader.readAsDataURL(file); 
        }};

        
    // Edit recipe in user cookbook
    const confirmRecipeEdition = async () => {
        try {
            console.log("youhou")
            await axios.put('http://localhost:4000/recipes/editRecipe', {
                recipe: recipe, 
                user_id: props.user.id,
                recipe_id: props.selectedRecipeIndex
            });
            setEditRecipe(false);
        } catch (error) {
            console.error('Error submitting newRecipe:', error)
            setMessage([false, ' ', true, error.response.data.message]);
        }
    };

    // Render JSX
    return (
        <div className={editRecipe ? "recipe-container recipe-edit" : "recipe-container" }>
            {!editRecipe ? < BiEditAlt className="edit-recipe-icon" onClick={() => setEditRecipe(true)}/> : <GrValidate className="edit-recipe-icon" style={{fontSize:"2rem"}} onClick={confirmRecipeEdition}/>}
            <form onKeyDown={handleKeyPress} onFocus={handleFocus}>
                    <div className="recipe-content">
                        <div className="left-column">
                            <div className="recipe-header">
                                <textarea rows="4" readOnly={!editRecipe} type="text" id="recipe-title-addRecipeForm " className="recipe-title" name="title" placeholder={t("add a title")} value={recipe.title} onChange={handleInputChange} />
                                <div className="recipe-meta">
                                    <span className="meta-item " style={{ display: editRecipe ? "flex" : !(recipe.persons==='' || recipe.persons ==='-') ? "flex" : "none" }}>
                                        <HiOutlineUserGroup className="recipe-item-logo" />
                                        <input readOnly={!editRecipe} type="text" name="persons" placeholder={t("Servings")} value={recipe.persons} onChange={handleInputChange} />
                                    </span>
                                    <span className="meta-item " style={{ display: editRecipe ? "flex" : !(recipe.prep_time==='' || recipe.prep_time ==='-') ? "flex" : "none" }}>
                                        <TbBowlSpoon className="recipe-item-logo" />
                                        <input readOnly={!editRecipe} type="text" name="prep_time" placeholder={t("Preparation time")} value={recipe.prep_time} onChange={handleInputChange} />
                                    </span>
                                    <span className="meta-item " style={{ display: editRecipe ? "flex" : !(recipe.cook_time==='' || recipe.cook_time ==='-') ? "flex" : "none" }}>
                                        <TbCooker className="recipe-item-logo" />
                                        <input readOnly={!editRecipe} type="text" name="cook_time" placeholder={t("Cooking time")} value={recipe.cook_time} onChange={handleInputChange} />
                                    </span>
                                    <span className="meta-item " style={{ display: editRecipe ? "flex" : !(recipe.rest_time==='' || recipe.rest_time ==='-') ? "flex" : "none" }}>
                                        <RiFridgeLine className="recipe-item-logo" />
                                        <input readOnly={!editRecipe} type="text" name="rest_time" placeholder={t("Resting time")} value={recipe.rest_time} onChange={handleInputChange} />
                                    </span>
                                </div>
                            </div>
                            
                            <div className='recipe-image-container ' onClick={editRecipe ? handleImageClick : ()=> {}}>
                                <img 
                                    src={recipe.image_url} 
                                    alt={recipe.title}
                                    className="recipe-image" 
                                />
                                <input
                                    readOnly={!editRecipe}
                                    type="file"
                                    name="imageInput" 
                                    id="imageInput"
                                    style={({display: 'none'})}
                                    accept="image/"
                                    onChange= {handleImageChange}
                                    />
                                {editRecipe &&
                                    <div className="recipe-image-overlay">
                                        <PiUploadSimpleBold className="recipe-item-modify"/>
                                        <p>Upload a recipe cover</p>
                                    </div>
                                }
                            </div>
                            <input readOnly={!editRecipe} className="recipe-source" type="text" name="source" placeholder={t("www.Recipe-Source.com")} value={recipe.source} onChange={handleInputChange} />
                        </div>
                        <div className="right-column">
                            <h2>{t("Ingredients")}</h2>
                            <div className="recipe-ingredients " onClick={(e) => editRecipe && accessList('ingredients', e)}>
                                {modifyList["ingredients"] ?
                                <div>
                                    <textarea
                                        readOnly={!editRecipe}
                                        name="ingredients"
                                        placeholder={t("Add a first ingredient")}
                                        value={recipe.ingredients}
                                        onChange={handleInputChange}
                                        rows="5"
                                    ></textarea>
                                    {modifyList["ingredients"] && <button type="submit" className="secondary" onClick={(e) => editList('ingredients', e)}>ok</button>}
                                </div>
                                :
                                <ul>
                                    {renderList('ingredients')}
                                </ul>
                                }
                            </div>
                                <h2>{t("Steps")}</h2>
                                <div className="recipe-steps " onClick={(e) => editRecipe && accessList('steps', e)}>
                                {modifyList["steps"] ?
                                <div>
                                    <textarea
                                        readOnly={!editRecipe}
                                        name="steps"
                                        placeholder={t("Add a first step")}
                                        value={recipe.steps}
                                        onChange={handleInputChange}
                                        rows="5"
                                    ></textarea>
                                    {modifyList["steps"] && <button type="submit" className="secondary" onClick={(e) => editList('steps', e)}>ok</button>}
                                </div>
                                :
                                <ul>
                                    {renderList('steps')}
                                </ul>
                                }
                            </div>
                            
                            
                        </div>
                    
                    </div>
                
                
            </form>
        </div>
    );
};

export default RecipeContent; 