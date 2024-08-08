import React from 'react';
import "./Footer.css";
import { useTranslation } from 'react-i18next';
// import logoTab from "../../../public/Images/logoTab.png"

const Footer = (props) => {
    const { t } = useTranslation();

    return (
        <footer id="footer">
            <hr />
            <br />
            
            <div className="footer_body">
                <div className="footer_logo" onClick={() => {window.location.href = '/'}}>
                    <img src={'/images/logoTab.png'} alt="Chef hat logo"/>
                    <h1 className="logo">Itisy</h1>
                </div>

                <div className="footer_contact">
                    <h2>Contact</h2>
                    <ul>
                        <li>
                            <p>Saint-Brieuc, Bretagne, France.</p>
                        </li>
                        <li>
                            <a href="mailto:agathe.coulombier@gmail.com">{t('Email me')}</a>
                        </li>
                    </ul>
                </div>

                <div className="footer_legal">
                    <h2>{t('Legal')}</h2>
                    <ul>
                        <li>
                            <a href="#/">{t('Privacy Policy')}</a>
                        </li>
                        <li>
                            <a href="#/">{t('Terms of Use')}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="copyright">
                <p>&copy; {new Date().getFullYear()} {t('Itisy. All rights reserved.')}</p>
            </div>
        </footer>
    );
}

export default Footer;
