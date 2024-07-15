import React, { useContext } from 'react'; // Import necessary hooks and components
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../hooks/authContext';
import NavBar from '../NavBar/Navbar'; // Import Navbar component
import Modal from '../authenticate/Modal/Modal'; // Import Modal component
import Footer from '../Footer/Footer'; // Import Footer component
import "./Dashboard.css"; // Import CSS for Homepage styling

const Dashboard = () => {

    const { setIsAuthenticated, logout } = useContext(AuthContext); // Destructure setIsAuthenticated from context

    const navigate = useNavigate();

    const toggleClick = async (authType) => {
        if (authType==="logout") {
            setIsAuthenticated(false);
            await logout();
            navigate('/'); // Redirect to the dashboard
        }
    };

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
                <p>Coucou ceci est une page secrète</p>
            </div>

            <Footer /> {/* Render Footer component */}
        </div>
    );
}

export default Dashboard; // Export Dashboard component
