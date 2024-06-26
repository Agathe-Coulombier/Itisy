import React, {useState, useEffect, useRef} from 'react';
import NavBar from '../NavBar/Navbar';
import Modal from '../Modal/Modal';
import Footer from '../Footer/Footer';
import "./Homepage.css"
import bread from "../../Resources/firstpage/Bread.jpg";
import pasta from "../../Resources/firstpage/Pasta.jpg";
import fruitSalad from "../../Resources/firstpage/FruitSalad.jpg";


const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [formType, setForm] = useState("");
    let modalRef = useRef("");

    useEffect(() => {
        let handler = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target) && e.target.id !== formType) {
                setShowModal(false);
                setForm("");
            }
        }
        document.addEventListener("mousedown", handler);
        
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    });

    const toggleClick = (authType) => {
            setShowModal(!showModal);
            setForm(authType);
    };

    return (
        <div id="main">
            < NavBar toggleClick={toggleClick}/>
            <div className="HomePage_body">
                {showModal && <Modal ref={modalRef} formType={formType} setForm={setForm}/>}
                <div className="banner">
                    <h1 className="get">Get.</h1>
                    <h1 className="plan">Plan.</h1>
                    <h1 className="print">Eat.</h1>
                </div>

                <div className="presentation">
                    <div className="speech">
                        <p>Welcome to your recipe gathering website! Easily collect recipes from various sources, plan your meals, find inspiration, and print your favorite ones in a consistent format. Sign up now to unlock a world of culinary possibilities!</p>
                        <button 
                        id = "register"
                        className="primary startNow"
                        onClick={() => toggleClick("register")}>
                            Start now
                        </button>
                    </div>
                    <div className="pictures">
                        <img src={pasta} alt="pasta"/>
                        <img src={bread} alt="bread" />
                        <img src={fruitSalad} alt="yogurt and strawberries" />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
    }

export default HomePage;