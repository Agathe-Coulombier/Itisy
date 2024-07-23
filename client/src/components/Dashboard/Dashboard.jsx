import React, { useContext, useState, useEffect } from 'react'; // Import necessary hooks and components
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../hooks/authContext';
import NavBar from '../NavBar/Navbar'; // Import Navbar component
import Footer from '../Footer/Footer'; // Import Footer component
import "./Dashboard.css"; // Import CSS for Homepage styling
import RecipeList from '../recipes/RecipesList';

const Dashboard = () => {

    const { setIsAuthenticated, logout, user } = useContext(AuthContext); // Destructure setIsAuthenticated from context
    const [ userRecipes, setUserRecipes ] = useState(
        {
        title:"Add a recipe",
        image_url: "https://iili.io/doeXZZB.png",
    });
    const [loading, setLoading] = useState(true);

    const fetchUserRecipes = async () => {
        try {
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
        fetchUserRecipes();
    }, []);

    const navigate = useNavigate();

    const toggleClick = async (authType) => {
        if (authType==="logout") {
            setIsAuthenticated(false);
            await logout();
            navigate('/'); // Redirect to the dashboard
        }
    };

    console.log(userRecipes)

    // Define the buttons to display in the NavBar
    const buttonItems = [
        { id: "register", className: "register", label: "Register" },
        { id: "logout", className: "logout", label: "Logout" },
        { id: "contact", className: "contact", label: "Contact" }
    ];


    // Render JSX
    return (
        <div id="main">
            <NavBar toggleClick={toggleClick} buttonItems={buttonItems}/> {/* Render NavBar component with toggleClick function */}
            
            <div className="main_content">
                <div className="recipesBoard">
                    <h1>My recipes</h1>
                        {loading ? <p>Loading...</p> : <RecipeList recipes={userRecipes} />}
                    </div>
            </div>

            <Footer /> {/* Render Footer component */}
        </div>
    );
}

export default Dashboard; // Export Dashboard component
