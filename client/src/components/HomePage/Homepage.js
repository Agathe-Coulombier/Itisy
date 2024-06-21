import React, {useState} from 'react';
import NavBar from '../NavBar/Navbar';
import ModalLogin from '../ModalLogin/ModalLogin';
import Footer from '../Footer/Footer';
import "./Homepage.css"
import bread from "../../Resources/firstpage/Bread.jpg";
import pasta from "../../Resources/firstpage/Pasta.jpg";
import fruitSalad from "../../Resources/firstpage/FruitSalad.jpg";


const HomePage = () => {
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    
    return (
        <div id="main">
            < NavBar openModal={()=> setIsOpenLogin(true)}/>

            <div className="HomePage_body">
                <div className="banner">
                    <h1 className="get">Get.</h1>
                    <h1 className="plan">Plan.</h1>
                    <h1 className="print">Eat.</h1>
                </div>

                <div className="presentation">
                    <div className="speech">
                        <p>Welcome to your recipe gathering website! Easily collect recipes from various sources, plan your meals, find inspiration, and print your favorite ones in a consistent format. Sign up now to unlock a world of culinary possibilities!</p>
                        <button className="startNow">Start now</button>
                    </div>
                    <div className="pictures">
                        <img src={pasta} alt="pasta"/>
                        <img src={bread} alt="bread" />
                        <img src={fruitSalad} alt="yogurt and strawberries" />
                    </div>
                </div>
            </div>
            {/* {isOpenLogin && <ModalLogin closeModal={()=> setIsOpenLogin(false)}/>} */}
            <ModalLogin />
            <Footer />
        </div>
    );
    }

export default HomePage;