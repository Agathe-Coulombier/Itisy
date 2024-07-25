import React, { useState, useEffect, useRef } from 'react'; // Import necessary hooks and components
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import NavBar from '../../NavBar/Navbar'; // Import Navbar component
import Modal from '../../Modal/Modal'; // Import Modal component
import { useModal } from '../../Modal/modalConfig';
import Footer from '../../Footer/Footer'; // Import Footer component
import "./Homepage.css"; // Import CSS for Homepage styling


const HomePage = () => {

    const { t } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }

    // State variables to manage modal visibility and form type
    const {
        showModal,
        modalRef,
        formType,
        setForm,
        toggleClick,
        handleClickCloseIcon,
        user,
        setUser
    } = useModal("", { email: "test123@gmail.com", password: "Test123*", confirmPassword: "", firstName: "", lastName: "" });

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
                
                <div id="contentBody">
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
