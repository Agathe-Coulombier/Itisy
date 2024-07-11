import React, { useState } from 'react';
import "./navbar.css";

const NavBar = (props) => {
    const [hambActive, setHambActive] = useState(false);

    // Toggle hamburger menu visibility
    const handleHamburgerClick = () => {
        setHambActive(!hambActive);
    };

    return (
        <nav id="navbar">
            <div className="items">
                {/* Left side of the navbar */}
                <div className="left subItems">
                    <img src={'/images/logoTab.png'} alt="Chef hat logo" />
                    <h1 className="text">itisy</h1>
                </div>

                {/* Right side of the navbar */}
                <div className="right subItems">
                    {/* Navigation menu links */}
                    <ul className={`nav-menu ${hambActive ? 'active' : ''}`}>
                        {props.buttonItems.map((item, index) => (
                            <li key={index}>
                                <h2 
                                    id={item.id} 
                                    className={`text ${item.className}`}
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
                    <div className="hamburger" onClick={handleHamburgerClick}>
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
