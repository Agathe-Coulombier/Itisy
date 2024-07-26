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
import './addRecipe.css'; // Ensure you create this CSS file with the styles

const AddRecipe = () => {
    const { t } = useTranslation();
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

    const[loading, setLoading] = useState(false);
    const [addRecipeField, setAddRecipeField] = useState(false);
    const [modifyList, setModifyList] = useState({ingredients:false, steps:false});

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const handleFetchRecipe = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:4000/recipes/scrap", { params: { url } } );
            setNewRecipe(response.data.newRecipe);
            setModifyList({ingredients:false, steps:false});
            setLoading(false);
            setAddRecipeField(true);
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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (e.target.type !== 'textarea'){
                e.preventDefault();
                e.target.blur();
            }
        }
    };

    const accessList = (eltType) => {
        if (newRecipe[eltType].length > 0 && !modifyList[eltType]){
            newRecipe[eltType] = newRecipe[eltType].join('\n');
        }
        setModifyList(prevState => ({
            ...prevState,
            [eltType]: true
        }));

        setTimeout(() => {
            const textarea = document.querySelector(`textarea[name=${eltType}]`);
            if (textarea) {
                textarea.focus();
            }
        }, 0);
        console.log("accessList", modifyList)
    };

    // useEffect(() => {
    // }, [modifyList]);

    const editList = (eltType, event) => {
        event.preventDefault();
        if (newRecipe[eltType].length > 0 && !modifyList[eltType]){
            newRecipe[eltType] = newRecipe[eltType].split('\n');
        }


        setTimeout(() => {
            setModifyList(prevState => ({
                ...prevState,
                [eltType]: false
            }));
          }, 100); // Adjust the delay as needed



        console.log("editList", modifyList)
    }

    

    const renderList = (eltType) => {
        if (newRecipe[eltType].length > 0){
            return newRecipe[eltType].map((elt, index) => (
                <li key={index}>{elt}</li>
            ));
        } else{
            return <li> </li>
        }
        console.log("renderList")
    };

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
        console.log("handle image change ", newRecipe['imageUrl'])
        }
        };

    const handleImageClick = () => {
        document.getElementById('imageInput').click(); // Trigger file input click
        };

    return (
        <div className="add-newRecipe modal-content">
            <h3>{t("Add a recipe to your cook book")}</h3>
            <br/>
            <form onSubmit={handleSubmit} onKeyDown={handleKeyPress}>
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
                <p>Loading ...</p>
                }
                {addRecipeField &&
                    <div className="recipe-content">
                        <div className="left-column">
                            <div className="recipe-header">
                                <input type="text" className="recipe-title" name="title" placeholder={t("add a title")} value={newRecipe.title} onChange={handleInputChange} />
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
                            <div className="recipe-ingredients" onClick={() => accessList('ingredients')}>
                                <h2>{t("Ingredients")}</h2>
                                {modifyList["ingredients"] ?
                                <div>
                                    <textarea
                                        name="ingredients"
                                        placeholder={t("Ingredients")}
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
                                <div className="recipe-steps" onClick={() => accessList('steps')}>
                                <h2>{t("Steps")}</h2>
                                {modifyList["steps"] ?
                                <div>
                                    <textarea
                                        name="steps"
                                        placeholder={t("Steps")}
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
