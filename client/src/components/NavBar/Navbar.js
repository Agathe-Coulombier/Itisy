import React from 'react';
import "./navbar.css";
import logoTab from "../../Resources/logoTab.png";

const NavBar = (props) => {

    return (
        <nav className="navbar">
            <div className="items">
                <div className="left subItems">
                    <img src={logoTab} alt="Chef hat logo"/>
                    <h1 className="text" >itisy</h1>
                </div>
                <div className="right subItems">
                    <h2 className="main text" href="auth/register">register</h2>
                    <h2 className="text" href="auth/login" onClick={props.openModal}>login</h2>
                    <h2 className="text" href="#contact">contact</h2>
                </div>
            </div>
            < hr />
        </nav> 
    )
}

export default NavBar;