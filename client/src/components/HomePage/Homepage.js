import React, {useState} from 'react';
import NavBar from '../NavBar/Navbar';
import ModalLogin from '../ModalLogin/ModalLogin';
import "./Homepage.css"

const HomePage = () => {
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    
    return (
        <div>
        <div id="main">
            <header>
                < NavBar openModal={()=> setIsOpenLogin(true)}/>
            </header>
            <main>
                
                <div className="banner">
                    <h1>Gather.</h1>
                    <h1>Print.</h1>
                    <h1>Plan.</h1>
                </div>

                <p>Welcome to my simple React home page! This is a basic example of a project.</p>
                {isOpenLogin && <ModalLogin closeModal={()=> setIsOpenLogin(false)}/>}
            </main>
            </div>
        </div>
    );
    }

export default HomePage;