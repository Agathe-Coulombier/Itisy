import { useState, useEffect, useRef } from 'react';

export const useModal = (initialFormType = "", initialUser = {}) => {
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef(null);
    const [formType, setForm] = useState(initialFormType);
    const [user, setUser] = useState(initialUser);

    const toggleClick = (authType) => {
        setShowModal(prev => !prev);
        setForm(authType);
        handleBlurry(!showModal); 
    };

    const handleClickCloseIcon = () => {
        setShowModal(false);
        setForm("");
        setUser(initialUser);
        handleBlurry(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target) && e.target.id !== formType) {
                setShowModal(false);
                setForm("");
                setUser(initialUser);
                handleBlurry(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [formType]);

    const handleBlurry = (show) => {
        document.getElementById("homePage_Presentation").style.filter = show ? "blur(5px)" : "blur(0px)";
        document.getElementById("navbar").style.filter = show ? "blur(5px)" : "blur(0px)";
        document.getElementById("footer").style.filter = show ? "blur(5px)" : "blur(0px)";
    };

    return {
        showModal,
        modalRef,
        formType,
        toggleClick,
        handleClickCloseIcon,
        setShowModal,
        setForm,
        user,
        setUser
    };
};
