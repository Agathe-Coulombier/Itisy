import React, {forwardRef} from "react";
import Login from "../Login/Login";
import Register from "../Register/Register"
import "./Modal.css";

const Modal = forwardRef((props, ref) => {

    if (props.setForm === "login"){
        return (
                <div className="modal" ref={ref}>
                    <Login />
                </div>
        );
    } else if (props.setForm === "register") {
        return (
            <div className="modal" ref={ref}>
                <Register />
            </div>
        );
    }

});

export default Modal;