import React, { useState, useEffect } from 'react';
import "./navbar.css";
import { TfiWorld } from "react-icons/tfi";
import i18n from "../../i18n";


const NavBar = (props) => {
    const [hambActive, setHambActive] = useState(false);
    const [langActive, setLangActive] = useState(false);

    // Toggle hamburger menu visibility
    const handleHamburgerClick = () => {
        setHambActive(!hambActive);
    };

    // Toggle languages menu visibility
    const handleLanguagesClick = () => {
        setLangActive(prev => !prev);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        handleLanguagesClick();
    }
    

    // Handle clicks outside of the language menu or hamburger menu
    useEffect(() => {
    const handleClickOutside = (e) => {

        if (langActive && e.target.id!=="languagesIcon" && e.target.parentElement.parentElement.id !=="langMenu") {
            setLangActive(false);
        }

        if (hambActive && e.target.id!=="hambIcon" && e.target.parentElement.parentElement.id !=="hambMenu") {
            setHambActive(false);
        }
    };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [langActive, hambActive]);

    return (
        <nav id="navbar">
            <div className="items">
                {/* Left side of the navbar */}
                <div className="left subItems" onClick={() => {window.location.href = '/'}}>
                    <img src={'/images/logoTab.png'} alt="Chef hat logo" />
                    <h1 className="text">itisy</h1>
                </div>

                {/* Right side of the navbar */}
                <div className="right subItems">
                    
                    {/* < div id="lang"> */}
                        <TfiWorld id="languagesIcon" className='text' onClick ={handleLanguagesClick}/>
                        <ul id="langMenu" className={`lang-menu ${langActive ? 'active' : ''}`}>
                            <li key="en">
                                <h2 
                                    className={`text`}
                                    onClick={() => changeLanguage("en")}
                                >
                                    English
                                </h2>
                            </li>
                            <li key="fr">
                            <h2 
                                className={`text`}
                                onClick={() => changeLanguage("fr")}
                            >
                                Français
                            </h2>
                        </li>
                        </ul>
                    {/* </div> */}


                    {/* Navigation menu links */}
                    <ul id="hambMenu" className={`nav-menu ${hambActive ? 'active' : ''}`}>
                        {props.buttonItems.map((item, index) => (
                            <li key={index}>
                                <h2 
                                    id={item.id} 
                                    className={item.active ? `text ${item.className} active` : `text ${item.className}`}
                                    onClick={() => {
                                        props.toggleClick(item.id);
                                        hambActive && handleHamburgerClick();
                                    }}
                                >
                                    {item.label}
                                </h2>
                            </li>
                        ))}
                    </ul>

                    {/* Hamburger menu icon */}
                    <div id="hambIcon" className="hamburger" onClick={handleHamburgerClick}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </div>
            </div>

            {/* Horizontal line separator */}
            <hr />
        </nav>
    );
}

export default NavBar;
