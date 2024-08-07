import React, { useContext, useState, useEffect } from 'react'; // Import necessary hooks and components
import axios from 'axios';
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

const Dashboard = () => {
    const { setIsAuthenticated, logout, user} = useContext(AuthContext); // Destructure setIsAuthenticated from context
    const [ userRecipes, setUserRecipes ] = useState(
        {
        title:"Add a recipe",
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
    const handleCardClick = (index, e) => {
        console.log("clicked")
        setSelectedRecipeIndex(index);
    };

    const [loading, setLoading] = useState(true);

    const [editRecipe, setEditRecipe] = useState(false)
    

    const fetchUserRecipes = async () => {
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
    };

    useEffect(() => {
        if (user) {
            fetchUserRecipes();
        }
    }, [user]);

    const navigate = useNavigate();

    const logoutClick = async (authType) => {
        if (authType==="logout") {
            setIsAuthenticated(false);
            await logout();
            }
    };

    // Define the buttons to display in the NavBar
    const buttonItems = [
        { id: "planner", className: "planner", label: "Planner" },
        { id: "userProfile", className: "user-profile", label: "Me" },
        { id: "logout", className: "logout", label: "Logout" }
    ];

    // Render JSX
    return (
        <div id="main">
            <NavBar toggleClick={logoutClick} buttonItems={buttonItems}/> {/* Render NavBar component with toggleClick function */}
            {showModal && <ProtectedRoute><Modal editRecipe={editRecipe} setEditRecipe={setEditRecipe} ref={modalRef} formType={formType} setForm={setForm} closeIcon={handleClickCloseIcon} userRecipes={userRecipes} user={user} selectedRecipeIndex={selectedRecipeIndex} fetchUserRecipes={fetchUserRecipes}/></ProtectedRoute>}

                <div className="main_content" id="contentBody">
                    <div className="recipesBoard">
                        <h1>My recipes</h1>
                        < hr />
                            {loading ? <div className="loader-container"> < Loader/> </div> : <RecipeList editRecipe={editRecipe} setEditRecipe={setEditRecipe} userRecipes={userRecipes} toggleClick={toggleClick} handleCardClick={handleCardClick} user={user} fetchUserRecipes={fetchUserRecipes}/>}
                        </div>
                </div>


            <Footer /> {/* Render Footer component */}
        </div>
    );
}

export default Dashboard; // Export Dashboard component
