import React, { useContext, useState, useEffect, useCallback, memo } from 'react'; // Import necessary hooks and components
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../hooks/authContext';
import NavBar from '../NavBar/Navbar'; // Import Navbar component
import Footer from '../Footer/Footer'; // Import Footer component;
import Modal from '../Modal/Modal';
import { useModal } from '../Modal/modalConfig';
import "./Dashboard.css"; // Import CSS for Homepage styling
import RecipeList from '../recipes/RecipesList';
import { ProtectedRoute } from "../../hooks/protectedRoute";
import Loader from '../Loader/Loader';
import { RiAddBoxLine } from "react-icons/ri";

const Dashboard = memo((props) => {
    const { t } = useTranslation();

    const { setIsAuthenticated, logout, user} = useContext(AuthContext); // Destructure setIsAuthenticated from context
    const [ userRecipes, setUserRecipes ] = useState(
        {
        title:t("Add a recipe"),
        image_url: "https://iili.io/doeXZZB.png",
    });

    // State variables to manage modal visibility and form type
    const {
        showModal,
        modalRef,
        formType,
        setForm,
        toggleClick,
        handleClickCloseIcon,
    } = useModal("", {});

    const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0)
    // Callback function to handle data from the child
    const handleCardClick = useCallback((index, e) => {
        console.log("clicked")
        setSelectedRecipeIndex(index);
    });

    const [loading, setLoading] = useState(true);

    const [editRecipe, setEditRecipe] = useState(false)
    const [createFolder, setCreateFolder] = useState(true)

    const fetchUserRecipes = useCallback (async () => {
        try {
            if (!user) return;
            const res = await axios.get("http://localhost:4000/recipes/userRecipes", {
                params: { userId: user.id }, 
                withCredentials: true
            });

            if (res.status === 200) {
                setUserRecipes([userRecipes, ...res.data.recipes]);
            }

        } catch (error) {
            console.error("Error response:", error.response); // Log error response if request fails
            console.error("Error message:", error.message); // Log error message
            console.error("Error code:", error.code); // Log error code if available
        } finally {
            setLoading(false);
        }
    });

    useCallback(useEffect(() => {
        if (user) {
            fetchUserRecipes();
        }
    }, [user]));

    const navigate = useNavigate();

    const logoutClick = async (authType) => {
        if (authType==="logout") {
            setIsAuthenticated(false);
            await logout();
            }
    };

    const [folderItems, setFolderItems] = useState([]);

    const toggleRecipeItem = useCallback((recipeId) => {
        setFolderItems(prevItems => {
            if (prevItems.includes(recipeId)) {
                return prevItems.filter(item => item !== recipeId);
            } else {
                return [...prevItems, recipeId];
            }
        });
        
    });

    // Define the buttons to display in the NavBar
    const buttonItems = [
        { id: "planner", className: "planner", label: t("Planner") },
        { id: "userProfile", className: "user-profile", label: t("Me") },
        { id: "logout", className: "logout", label: t("Logout") }
    ];

    const handleFolderCreation = () => {
        setCreateFolder(false);

        
    }
    

    // Render JSX
    return (
        <div id="main">
            <NavBar toggleClick={logoutClick} buttonItems={buttonItems}/> {/* Render NavBar component with toggleClick function */}
            {showModal && <ProtectedRoute><Modal editRecipe={editRecipe} setEditRecipe={setEditRecipe} ref={modalRef} formType={formType} setForm={setForm} closeIcon={handleClickCloseIcon} userRecipes={userRecipes} user={user} selectedRecipeIndex={selectedRecipeIndex} fetchUserRecipes={fetchUserRecipes}/></ProtectedRoute>}
                <div className="main_content" id="contentBody">
                    <div className="recipesBoard">
                        <h1>{t('My recipes')}</h1>
                            {!createFolder &&
                            <div className='recipe-folders'>
                            <span className='selected'>
                                <p>{t("All my recipes")}</p>
                            </span>
                            <span>
                                <p>{t("Filter")}</p>
                            </span>
                            <span className='create-folder' onClick={() => setCreateFolder(true)}>
                                < RiAddBoxLine/>
                                <p>{t("Folder")}</p>
                            </span>
                        </div>}
                        {createFolder &&
                        <div className="create-folder">
                            <input type="text" placeholder={t("Folder's name")}/>
                            <button onClick={handleFolderCreation}> 
                                click me
                            </button>
                        </div>}
                        < hr />
                            {loading ? <div className="loader-container"> < Loader/> </div> : <RecipeList createFolder={createFolder} editRecipe={editRecipe} setEditRecipe={setEditRecipe} userRecipes={userRecipes} toggleClick={toggleClick} handleCardClick={handleCardClick} user={user} fetchUserRecipes={fetchUserRecipes} toggleRecipeItem={props.toggleRecipeItem}/>}
                        </div>
                </div>


            <Footer /> {/* Render Footer component */}
        </div>
    );
});

export default Dashboard; // Export Dashboard component
