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
import { RiArrowDropDownLine } from "react-icons/ri";

import { PiFolderSimplePlus } from "react-icons/pi";
import { RiAddBoxLine } from "react-icons/ri";

const Dashboard = memo((props) => {
    const { t } = useTranslation();

    const { setIsAuthenticated, logout, user} = useContext(AuthContext); // Destructure setIsAuthenticated from context
    const [ userRecipes, setUserRecipes ] = useState(
        {
        title:t("Add a recipe"),
        image_url: "https://iili.io/doeXZZB.png",
    });
    const[ userFolders, setUserFolders ] = useState({folders:[], selectedFolder: "All my recipes"});

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
    const [createFolder, setCreateFolder] = useState(false)
    const [showFolders, setShowFolders] = useState(false);

    const fetchUserRecipes = useCallback(async () => {
        if (!user) return;
        
        try {
            const res = await axios.get("http://localhost:4000/recipes/userRecipes", {
                params: { userId: user.id, folder: userFolders.selectedFolder },
                withCredentials: true
            });

            if (res.status === 200) {
                const { recipes, folders } = res.data.data;
                setUserRecipes([userRecipes, ...recipes]); // Only update recipes
                setUserFolders(prev => ({
                    ...prev,
                    folders // Only update folders if needed
                }));
            }
        } catch (error) {
            console.error("Error response:", error.response);
            console.error("Error message:", error.message);
            console.error("Error code:", error.code);
        } finally {
            setLoading(false);
        }
    }, [user, userFolders.selectedFolder]);

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
        { id: "myrecipes", className: "myrecipes", label: t("My recipes"), active:true },
        { id: "logout", className: "logout", label: t("Logout") }
    ];

    const handleFolderCreation = () => {
        setCreateFolder(false);
    }

    const handleFolderSelection = (folder) => {
        setUserFolders(prevUserFolders => ({
            ...prevUserFolders,
            selectedFolder: folder
        }));
        setShowFolders(false);
    };
    
    useEffect(() => {
        fetchUserRecipes();
    }, [user, userFolders.selectedFolder]);

    // Render JSX
    return (
        <div id="main">
            <NavBar toggleClick={logoutClick} buttonItems={buttonItems}/> {/* Render NavBar component with toggleClick function */}
            {showModal && <ProtectedRoute><Modal editRecipe={editRecipe} setEditRecipe={setEditRecipe} ref={modalRef} formType={formType} setForm={setForm} closeIcon={handleClickCloseIcon} userRecipes={userRecipes} user={user} selectedRecipeIndex={selectedRecipeIndex} fetchUserRecipes={fetchUserRecipes}/></ProtectedRoute>}
                <div className="main_content" id="contentBody">
                    <div className="recipesBoard">
                            {!createFolder &&
                            <div className='recipe-folders'>
                            <span onClick={() => setShowFolders(!showFolders)}>
                                <p>{userFolders.selectedFolder}</p>
                                <RiArrowDropDownLine />
                            </span>
                            <div className= {showFolders? 'dropdown open' : 'dropdown'}>
                                {userFolders.folders.length === 1 ? 
                                    <span onClick={() => setCreateFolder(true)}>
                                        <p>No folder yet...</p>
                                        < PiFolderSimplePlus />
                                    </span>
                                    :
                                    userFolders.folders.map( (folder, index) => (
                                        folder !== userFolders.selectedFolder && 
                                        <span onClick={() => handleFolderSelection(folder)}>
                                            <p>{folder}</p>
                                        </span>
                                    ))}
                            </div>
                            <div className='create-folder' onClick={() => setCreateFolder(true)}>
                                < PiFolderSimplePlus />
                            </div>
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
