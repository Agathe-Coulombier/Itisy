import React, {useState, useEffect, useRef} from 'react';
import NavBar from '../NavBar/Navbar';
import Modal from '../Modal/Modal';
import Footer from '../Footer/Footer';
import "./ResetPassword.css"
import bread from "../../Resources/firstpage/Bread.jpg";
import pasta from "../../Resources/firstpage/Pasta.jpg";
import fruitSalad from "../../Resources/firstpage/FruitSalad.jpg";


const HomePage = () => {

    return (
        <div id="main">
            < NavBar toggleClick={toggleClick}/>
            <div className="ResetPassword">
                <p>Coucou</p>
            </div>
            <Footer />
        </div>
    );
    }

export default HomePage;