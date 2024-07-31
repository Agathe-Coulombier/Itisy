import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TbCooker } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiFridgeLine } from "react-icons/ri";
import { TbBowlSpoon } from "react-icons/tb";
import { PiUploadSimpleBold } from "react-icons/pi";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
import Loader from '../Loader/Loader'
import './addRecipe.css';

const AddRecipe = (props) => {
    const { t } = useTranslation(); // Translations
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [newRecipe, setNewRecipe] = useState({
        title: '',
        imageUrl: 'https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png',
        prepTime: '',
        cookTime: '',
        restTime: '',
        persons: '',
        ingredients: ['Add a first ingredient'],
        steps: ['Add a first step'],
        source: ''
    });

    const [loading, setLoading] = useState(false);
    const [addRecipeField, setAddRecipeField] = useState(false);
    const [modifyList, setModifyList] = useState({ingredients:false, steps:false});
    const [originalValue, setOriginalValue] = useState({});
    const [message, setMessage] = useState([false, '']);

    const handleFocus = (e) => {
        // Store the original value when the input gains focus
        const { name, value } = e.target;
        setOriginalValue((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

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
            setMessage([true, "Your recipe is scraped! You can modify it at your convenience before adding it to your cookbook."])
        } catch (error) {
            setLoading(false);
            console.error('Error fetching newRecipe:', error.response.data.message);
            setMessage([false, error.response.data.message]);
        }
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
        setNewRecipe({
            ...newRecipe,
            [name]: value
        });
        adjustHeight(e);
    };

    // Add recipe to user cookbook
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/recipes/addRecipe', {
                newRecipe: newRecipe, 
                user_id: props.user.id
            });
            
            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting newRecipe:', error);
        }
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
        setNewRecipe((prev) => ({
            ...prev,
            [name]: originalValue[name] || '',
        }));
            e.target.blur();
            }
    };

    // Accessing the list items editor mode
    const accessList = (eltType, e) => {

        // Turning the list of elements into a unique string made of one line per element
        if (newRecipe[eltType].length > 0 && !modifyList[eltType]){
            newRecipe[eltType] = newRecipe[eltType].join('\n');
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
        if (newRecipe[eltType] ==='Add a first ingredient' || newRecipe[eltType] === 'Add a first step') {
            newRecipe[eltType] = '';
        }
    };

    // Validating the list items edition
    const editList = (eltType, event) => {
        event.preventDefault();

        // Turning the string into a list of items
        if (newRecipe[eltType].length > 0 && modifyList[eltType]){
            newRecipe[eltType] = newRecipe[eltType].split('\n');
            
        // If nothing written by user, putting back the default values
        } else {
            if (eltType==='ingredients'){
                newRecipe[eltType] = ['Add a first ingredient'];
                } else if (eltType==='steps') {
                    newRecipe[eltType] = ['Add a first step'];
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
        
        if (newRecipe[eltType].length > 1){
            return newRecipe[eltType].map((elt, index) => (
                <li key={index}>{elt}</li>
            ));
        } else{
            return <li> {newRecipe[eltType]}</li>
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
            setNewRecipe({
                ...newRecipe,
                ['imageUrl']: reader.result
            });
            };
        reader.readAsDataURL(file); 
        }};

    return (
        <div className="add-newRecipe modal-content">
            <h3>{t("Add a recipe to your cook book")}</h3>
            <br/>
            <form onSubmit={handleSubmit} onKeyDown={handleKeyPress} onFocus={handleFocus}>
                <div className="scrapRecipe">
                    <input type="text" value={url} placeholder={t("Start by pasting the URL address of the recipe you spotted")} onChange={handleUrlChange} />
                    <button type="button" className="secondary" onClick={handleFetchRecipe}>{t("Fetch Recipe")}</button>
                </div>
                {!addRecipeField && !loading ? 
                <p>
                    {t("Do you want to start from scratch? ")}
                    <a style={{cursor:"pointer"}} onClick={() => setAddRecipeField(true)}>{t("Click here")}</a>
                </p>:
                <p>{t(" ")}</p>
                }
                
                {loading &&
                <div className="loader-container">
                    <p>Your recipe content is loading, this may take a few minutes ...</p>
                    <Loader />
                    
                </div>
                }
                <p className="fetching-status">{message[1] && t(message[1])}</p>
                {addRecipeField &&
                    <div className="recipe-content">
                        <div className="left-column">
                            <div className="recipe-header">
                                <textarea type="text" id="recipe-title-addRecipeForm" className="recipe-title" name="title" placeholder={t("add a title")} value={newRecipe.title} onChange={handleInputChange} />
                                <div className="recipe-meta">
                                    <span className="meta-item">
                                        <HiOutlineUserGroup className="recipe-item-logo" />
                                        <input type="text" name="persons" placeholder={t("Servings")} value={newRecipe.persons} onChange={handleInputChange} />
                                    </span>
                                    <span className="meta-item">
                                        <TbBowlSpoon className="recipe-item-logo" />
                                        <input type="text" name="prepTime" placeholder={t("Preparation time")} value={newRecipe.prepTime} onChange={handleInputChange} />
                                    </span>
                                    <span className="meta-item">
                                        <TbCooker className="recipe-item-logo" />
                                        <input type="text" name="cookTime" placeholder={t("Cooking time")} value={newRecipe.cookTime} onChange={handleInputChange} />
                                    </span>
                                    <span className="meta-item">
                                        <RiFridgeLine className="recipe-item-logo" />
                                        <input type="text" name="restTime" placeholder={t("Resting time")} value={newRecipe.restTime} onChange={handleInputChange} />
                                    </span>
                                </div>
                            </div>
                            
                            <div className='recipe-image-container' onClick={handleImageClick} style={{cursor : 'pointer'}}>
                                <img 
                                    src={newRecipe.imageUrl} 
                                    alt={newRecipe.title}
                                    className="recipe-image" 
                                />
                                <input
                                    type="file"
                                    name="imageInput" 
                                    id="imageInput"
                                    style={({display: 'none'})}
                                    accept="image/"
                                    onChange= {handleImageChange}
                                    />
                                <div className="recipe-image-overlay">
                                    <PiUploadSimpleBold className="recipe-item-modify"/>
                                    <p>Upload a recipe cover</p>
                                </div>
                            </div>
                            <input className="recipe-source" type="text" name="source" placeholder={t("www.Recipe-Source.com")} value={newRecipe.source} onChange={handleInputChange} />
                        </div>
                        <div className="right-column">
                            <h2>{t("Ingredients")}</h2>
                            <div className="recipe-ingredients" onClick={(e) => accessList('ingredients', e)}>
                                {modifyList["ingredients"] ?
                                <div>
                                    <textarea
                                        name="ingredients"
                                        placeholder={t("Add a first ingredient")}
                                        value={newRecipe.ingredients}
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
                                <div className="recipe-steps" onClick={(e) => accessList('steps', e)}>
                                {modifyList["steps"] ?
                                <div>
                                    <textarea
                                        name="steps"
                                        placeholder={t("Add a first step")}
                                        value={newRecipe.steps}
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
                            <button className="primary" type="submit">{t("Add to my recipes")}</button>
                        </div>
                    
                    </div>
                }
                
            </form>
        </div>
    );
};

export default AddRecipe;
