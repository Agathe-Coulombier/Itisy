import React, { useContext, useState, useEffect, useCallback, memo, useRef } from 'react'; 
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../hooks/authContext';

import NavBar from '../NavBar/Navbar'; 
import Footer from '../Footer/Footer'; 
import RecipeList from '../recipes/RecipesList';
import Modal from '../Modal/Modal';
import Loader from '../Loader/Loader';
import SelectFolder from './SelectFolder';
import CreateFolder from './CreateFolder';
import ModifyFolder from './ModifyFolder';
import { ProtectedRoute } from "../../hooks/protectedRoute";
import { useModal } from '../Modal/modalConfig';
import { handlePrint } from '../Print/printRecipe';

import "./Dashboard.css";

const Dashboard = memo((props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { setIsAuthenticated, logout, user} = useContext(AuthContext); // Destructure setIsAuthenticated from context
    const [ userRecipes, setUserRecipes ] = useState(
        {
        title:t("Add a recipe"),
        image_url: "https://iili.io/doeXZZB.png",
        });
    const[ userFolders, setUserFolders ] = useState({folders:[], selectedFolder: "All my recipes"});
    const [showFolders, setShowFolders] = useState(false);
    const {
        showModal,
        modalRef,
        formType,
        setForm,
        toggleClick,
        handleClickCloseIcon,
    } = useModal("", {});
    const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0)
    const [loading, setLoading] = useState(true);
    const [editRecipe, setEditRecipe] = useState(false)
    const [folderItems, setFolderItems] = useState([]);
    const [recipesToDisplay, setRecipesToDisplay] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(() => {
        return localStorage.getItem('currentFolder') || "All my recipes";
    });
    const [trackMode, setTrackMode] = useState(props.mode);

    const handleCardClick = useCallback((index, e) => {
        setSelectedRecipeIndex(index);
    });

    const fetchUserRecipes = useCallback(async () => {
        if (!user) return;

        try {
            const res = await axios.get("http://localhost:4000/recipes/userRecipes", {
                params: { userId: user.id, folder: "All my recipes" },
                withCredentials: true
            });

            if (res.status === 200) {
                setLoading(true);
                const { recipes, folders } = res.data.data;
                setUserRecipes([userRecipes, ...recipes]);
                setUserFolders(prev => ({
                    ...prev,
                    folders 
                }));
            }
        } catch (error) {
            console.error("Error response:", error.response);
            console.error("Error message:", error.message);
            console.error("Error code:", error.code);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const navbarClick = async (buttonId) => {
        if (buttonId==="logout") {
            setIsAuthenticated(false);
            await logout();
            } else if(buttonId==="myrecipes") {
                setCurrentFolder("All my recipes");
                navigate('/dashboard/view');
            }
    }

    const toggleRecipeItem = useCallback((recipeId) => {
        setShowFolders(false)
        setFolderItems(prevItems => {
            if (prevItems.includes(recipeId)) {
                return prevItems.filter(item => item !== recipeId);
            } else {
                return [...prevItems, recipeId];
            }
        });
        
    });

    const buttonItems = [
        { id: "myrecipes", className: "myrecipes", label: t("My recipes"), active:true },
        { id: "logout", className: "logout", label: t("Logout") }
    ];

    const deleteFolder = async() => {
        try {
            const res = await axios.patch("http://localhost:4000/recipes/deleteFolder", {
                userId: user.id,
                folderName: currentFolder
            }, { withCredentials: true });

            if (res.status === 200) {
                setCurrentFolder("All my recipes");
                // fetchUserRecipes();
                navigate('/dashboard/view');
            }

        } catch (error) {
            console.error("Error response:", error.response);
            console.error("Error message:", error.message);
            console.error("Error code:", error.code);
        }
    }

    const handleFolderSelection = (folder) => {
        fetchUserRecipes();
        setCurrentFolder(folder);
        setShowFolders(false);
    };
    
    useEffect(() => {
        fetchUserRecipes();
    }, [user, currentFolder]);

    const location = useLocation();
    
    useEffect(() => {
        if (location.pathname === '/dashboard/view') {
            setTrackMode('view');
        } else if (location.pathname === '/dashboard/create-folder') {
            setTrackMode('create-folder');
        } else if (location.pathname === '/dashboard/modify-folder') {
            setTrackMode('modify-folder');
        }
        fetchUserRecipes()
    }, [location]);

    useEffect(() => {
        if (currentFolder) {
            localStorage.setItem('currentFolder', currentFolder);
        }
    }, [currentFolder]);

    // Render JSX
    return (
        <div id="main">
            <NavBar toggleClick={navbarClick} buttonItems={buttonItems}/>
            {showModal && <ProtectedRoute><Modal onPrint={handlePrint} editRecipe={editRecipe} setEditRecipe={setEditRecipe} ref={modalRef} formType={formType} setForm={setForm} closeIcon={handleClickCloseIcon} userRecipes={userRecipes} user={user} selectedRecipeIndex={selectedRecipeIndex} fetchUserRecipes={() => fetchUserRecipes()} currentFolder={currentFolder}/></ProtectedRoute>}
                <div className="main_content" id="contentBody">
                    <div className="recipesBoard">
                        {trackMode === 'view' && <SelectFolder deleteFolder={deleteFolder} fetchUserRecipes={fetchUserRecipes} setCurrentFolder={setCurrentFolder} setTrackMode={setTrackMode} setFolderItems={setFolderItems} handleFolderSelection={handleFolderSelection} currentFolders={currentFolder} userFolders={userFolders} currentFolder={currentFolder} showFolders={showFolders} setShowFolders={setShowFolders} />}
                        {trackMode === 'create-folder' && < CreateFolder currentFolder={currentFolder} setCurrentFolder={setCurrentFolder} trackMode={trackMode} setTrackMode={setTrackMode} user={user} folderItems={folderItems} setFolderItems={setFolderItems} setUserFolders={setUserFolders} />}
                        {trackMode === 'modify-folder' && < ModifyFolder deleteFolder={deleteFolder} setCurrentFolder={setCurrentFolder} currentFolder={currentFolder} trackMode={trackMode} setTrackMode={setTrackMode} user={user} folderItems={folderItems} setFolderItems={setFolderItems} setUserFolders={setUserFolders} />}
                        < hr />
                            {loading ? <div className="loader-container"> < Loader/> </div> : <RecipeList selectedRecipeIndex={selectedRecipeIndex} setSelectedRecipeIndex={setSelectedRecipeIndex} onPrint={handlePrint} currentFolder={currentFolder} recipesToDisplay={recipesToDisplay} setRecipesToDisplay={setRecipesToDisplay} trackMode={trackMode} editRecipe={editRecipe} setEditRecipe={setEditRecipe} userRecipes={userRecipes} toggleClick={toggleClick} handleCardClick={handleCardClick} user={user} fetchUserRecipes={() => fetchUserRecipes()} toggleRecipeItem={toggleRecipeItem}/>}
                        </div>
                </div>
            <Footer /> 
        </div>
    );
});

export default Dashboard;



















