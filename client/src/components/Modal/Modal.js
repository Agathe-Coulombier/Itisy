import React, {forwardRef} from "react";
import Login from "../Login/Login";
import Register from "../Register/Register"
import SendLink from "../SendLink/SendLink";
import "./Modal.css";

const Modal = forwardRef((props, ref) => {

    if (props.formType === "login"){
        return (
                <div className="modal" ref={ref}>
                    <Login setForm={props.setForm}/>
                </div>
        );
    } else if (props.formType === "register") {
        return (
            <div className="modal" ref={ref}>
                <Register setForm={props.setForm}/>
            </div>
        );
    } else if (props.formType === "SendLink") {
        return (
            <div className="modal" ref={ref}>
                <SendLink setForm={props.setForm}/>
            </div>
        );
    }

});

export default Modal;