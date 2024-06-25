import React, {useState} from 'react';
import "./navbar.css";
import logoTab from "../../Resources/logoTab.png";
import ModalLogin from '../Modal/Modal';

const NavBar = (props) => {

    const[hambActive, setHambActive] = useState(false);
    const handleHamburgerClick = () => {
        setHambActive(!hambActive);
        console.log(hambActive);
    };

    // window.onscroll = function() {scrollFunction()};

    return (
        <nav id="navbar">
            <div className="items">
                <div className="left subItems">
                    <img src={logoTab} alt="Chef hat logo"/>
                    <h1 className="text" >itisy</h1>
                </div>
                <div className="right subItems">
                    <ul 
                    className={`nav-menu ${hambActive ? 'active' : ''}`}>
                        <li><h2 id="register" className="main text" href="auth/register" onClick={() => props.onClick("register")}>register</h2></li>
                        <li><h2 id="login" className="text" href="auth/login" onClick={() => props.onClick("login")}>login</h2></li>
                        <li><h2 className="text" href="#contact">contact</h2></li>
                    </ul>
                    <div 
                    className="hamburger" 
                    onClick={handleHamburgerClick}
                    >
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </div>

            </div>
            < hr />
        </nav> 

        
    ) 
}



// function scrollFunction() {
//     console.log(document.body.scrollTop, document.documentElement.scrollTop)
//     if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
//         document.getElementById("navbar").style.top = "0";
//     } else {
//         document.getElementById("navbar").style.top = "0";
//     }
// }


export default NavBar;