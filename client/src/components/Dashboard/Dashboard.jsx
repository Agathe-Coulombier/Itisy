import React, { useState, useEffect, useRef } from 'react'; // Import necessary hooks and components
import NavBar from '../NavBar/Navbar'; // Import Navbar component
import Modal from '../authenticate/Modal/Modal'; // Import Modal component
import Footer from '../Footer/Footer'; // Import Footer component
import "./Dashboard.css"; // Import CSS for Homepage styling

const Dashboard = () => {

    // Define the buttons to display in the NavBar
    const buttonItems = [
        { id: "register", className: "register", label: "Register" },
        { id: "login", className: "login", label: "Login" },
        { id: "contact", className: "contact", label: "Contact" }
    ];

    // Render JSX
    return (
        <div id="main">
            <NavBar buttonItems={buttonItems}/> {/* Render NavBar component with toggleClick function */}
            
            <div className="main_content">
                <p>Coucou ceci est une page secrète</p>
            </div>

            <Footer /> {/* Render Footer component */}
        </div>
    );
}

export default Dashboard; // Export Dashboard component
