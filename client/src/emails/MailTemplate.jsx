import React, {useState, useEffect, useRef} from 'react';
import logoTab from "../Resources/logoTab.png";
// import "./MailTemplate.css";

const MailTemplate = (props) => {

    



        return (
            <div 
                id="mailTemplate"
                style={{
                    margin:0,
                    padding:0,
                    height: "100%",
                    top: 0,
                    left: 0,
                }}>
                <header
                    style={{
                        "height":"15%",
                        "padding": "0 10%",
                        "display": "flex",
                        "align-items": "center",
                        "justify-content": "left",
                        "margin": "10px 0",
                    }}>
                    <img 
                        src={logoTab}
                        alt="Chef hat logo"
                        style={{
                            "height":"4.4em",
                            "margin-bottom": "2.1em",
                            "cursor":"pointer",
                        }}/>
                    <h1 
                        className="text" 
                        style={{
                            "text-transform": "uppercase",
                            "font-size": "3em",
                            "margin": "0 10px",
                            "cursor":"pointer",
                        }}>itisy</h1>
                </header>

                <body
                    style={{
                        "height":"50%",
                        "padding": "20px 25%",
                        "background-color": "white",
                        "display": "flex",
                        "flex-direction": "column",
                        "justify-content": "center",
                    }}>
                    <h2 
                        className="text" 
                        style={{
                            "font-size": "2em"
                        }}>Hi {props.firstName},</h2>
                    <img 
                        src="https://0ec63ca6b7.imgdist.com/pub/bfra/84ybnnzb/v41/on1/t3f/image_2024-06-27_081531960.png" 
                        alt="Lock"
                        style={{
                            "width":"20%",
                            "position":"relative",
                            "left": "50%",
                            "transform": "translateX(-50%)",
                        }}/>
                    <br />
                    <br />
                    <p
                        style={{
                            "font-size": "1em"
                        }}>To reset your password, please click this link:</p>
                    <br />
                    <a 
                        href={props.url}
                        style={{
                            "font-size": "1em",
                            "width": "90%",
                            "text-align": "center",
                            "position":"relative",
                            "left": "50%",
                            "transform": "translateX(-50%)",
                        }}>{props.url}</a>
                </body>

                <footer
                    style={{
                        "height":"25%",
                        "padding": "20px 25%",
                        "font-size": "1em",
                        "display": "flex",
                        "flex-direction": "column",
                        "justify-content": "center",
                    }}>
                    <p>
                        Template still in development.
                        Thank you for taking a look at my work,
                    </p>
                    <br />
                    <p>Agathe.</p>
                </footer>
            </div>
    )
}

export default MailTemplate;