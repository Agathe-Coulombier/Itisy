import React, { useState, useEffect, useRef } from 'react'; // Import necessary hooks and components
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import NavBar from '../../NavBar/Navbar'; // Import Navbar component
import Modal from '../Modal/Modal'; // Import Modal component
import Footer from '../../Footer/Footer'; // Import Footer component
import "./Homepage.css"; // Import CSS for Homepage styling

const HomePage = () => {

    const { t } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        console.log(lng)
    }

    // State variables to manage modal visibility and form type
    const [showModal, setShowModal] = useState(false); // State to toggle modal visibility
    const modalRef = useRef(null); // Reference for modal DOM element
    const [formType, setForm] = useState(""); // State to track modal form type
    const [user, setUser] = useState({ // Define state variables using useState hook
        "email": "test123@gmail.com", 
        "password": "Test123*", 
        "confirmPassword": "", 
        "firstName": "", 
        "lastName": ""
    });

    // Function to toggle the modal visibility and set the form type
    const toggleClick = (authType) => {
        setShowModal(prev => !prev); // Toggle modal visibility
        setForm(authType); // Set form type to the passed authType
        
        // Apply background blur effect based on modal visibility
        handleBlurry(showModal);
    };

    // useEffect hook to handle clicks outside the modal
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Check if modal exists and clicked target is outside the modal and not related to current formType
            if (modalRef.current && !modalRef.current.contains(e.target) && e.target.id !== formType) {
                setShowModal(false); // Hide the modal
                setForm(""); // Reset the form type
                setUser({ // Reset user auth forms
                    "email": "", 
                    "password": "", 
                    "confirmPassword": "", 
                    "firstName": "", 
                    "lastName": ""
                })
                // Apply background blur effect based on modal visibility
                handleBlurry(showModal);
            }
        }
        
        // Add event listener for 'mousedown' event to detect clicks outside the modal
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup function to remove the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [formType]); // Dependency array includes formType to run effect when it changes

    // Function to handle clicks on the modal close icon
    const handleClickCloseIcon = () => {
        setShowModal(false); // Hide the modal
        setForm(""); // Reset the form type
        setUser({ // Reset user auth forms
            "email": "", 
            "password": "", 
            "confirmPassword": "", 
            "firstName": "", 
            "lastName": ""
        })
        // Apply background blur effect based on modal visibility
        handleBlurry(showModal);
    }

    // Function to apply or remove blur effect based on the modal visibility
    const handleBlurry = (showModal) => {
        // Update CSS styles based on modal visibility
        document.getElementById("homePage_Presentation").style.filter = showModal ? "blur(0px)" : "blur(5px)";
        document.getElementById("navbar").style.filter = showModal ? "blur(0px)" : "blur(5px)";
        document.getElementById("footer").style.filter = showModal ? "blur(0px)" : "blur(5px)";
    }

    // Define the buttons to display in the NavBar
    const buttonItems = [
        { id: "register", className: "register", label: t("register") },
        { id: "login", className: "login", label: t("login") },
        { id: "contact", className: "contact", label: t("contact") }
    ];

    // Render JSX
    return (
        <div id="main">
            <NavBar changeLanguage={changeLanguage} toggleClick={toggleClick} buttonItems={buttonItems}/> {/* Render NavBar component with toggleClick function */}
            
            <div className="main_content">
                {showModal && <Modal ref={modalRef} user={user} setUser={setUser} formType={formType} setForm={setForm} closeIcon={handleClickCloseIcon} />} {/* Render Modal component conditionally based on showModal state */}
                
                <div id="homePage_Presentation">
                    <div className="banner">
                        <h1 className="get">{t('Get.')}</h1>
                        <h1 className="plan">{t('Plan.')}</h1>
                        <h1 className="eat">{t('Eat.')}</h1>
                    </div>

                    <div className="presentation">
                        <div className="speech">
                            <p>{t('Welcome to your recipe gathering website! Easily collect recipes from various sources, plan your meals, find inspiration, and print your favorite ones in a consistent format. Sign up now to unlock a world of culinary possibilities!')}</p>
                            <button
                                id="register"
                                className="primary startNow"
                                onClick={() => toggleClick("register")}>
                                {t('start now')}
                            </button>
                        </div>
                        <div className="pictures">
                            <img src={'/images/auth/firstPage/Pasta.jpg'} alt="pasta" loading="lazy" />
                            <img src={'/images/auth/firstPage/Bread.jpg'} alt="bread" loading="lazy" />
                            <img src={'/images/auth/firstPage/FruitSalad.jpg'} alt="yogurt and strawberries" loading="lazy"/>
                        </div>
                    </div>
                </div>
            </div>

            <Footer /> {/* Render Footer component */}
        </div>
    );
}

export default HomePage; // Export HomePage component
