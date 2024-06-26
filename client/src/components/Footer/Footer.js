import React from 'react';
import "./Footer.css";
import logoTab from "../../Resources/logoTab.png";

const Footer = (props) => {

    return (
    <footer id="footer">
        <hr />
        <br />
        
        <body className="footer_body">

            <div className="footer_logo">
            <img src={logoTab} alt="Chef hat logo"/>
                <h1 className="logo">Itisy</h1>
            </div>

            <div className="footer_contact">
                <h2>Contact</h2>
                <ul>
                    <li>
                    <p href="#">Saint-Brieuc, Bretagne, France.</p>
                    </li>
                    
                    <li>
                    <a href="agathe.coulombier@gmail.com">Email Us</a>
                    </li>
                </ul>
                </div>

                <div className="footer_legal">
                <h2>Legal</h2>
                <ul>
                    <li>
                    <a href="#/">Privacy Policy</a>
                    </li>
                    
                    <li>
                    <a href="#/">Terms of Use</a>
                    </li>
                </ul>
                </div>
            </body>
            <div className="copyright">
                <p>&copy; {new Date().getFullYear()} Itisy. All rights reserved.</p>
            </div>
    </footer>
    )
}


export default Footer;