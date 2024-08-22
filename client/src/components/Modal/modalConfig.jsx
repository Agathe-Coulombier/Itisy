import { useState, useEffect, useRef } from 'react';

export const useModal = (initialFormType = "", initialUser = {}) => {
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef(null);
    const [formType, setForm] = useState(initialFormType);
    const [user, setUser] = useState(initialUser);
    const [allowOpen, setAllowOpen] = useState(true);

    const toggleClick = (authType, event) => {
        if(allowOpen){
            setShowModal(true);
            setForm(authType);
            document.body.classList.add("modal-open");
        }
    };

    const handleClickCloseIcon = () => {
        setShowModal(false);
        setForm("");
        setUser(initialUser);
        document.body.classList.remove("modal-open");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            
            if (modalRef.current && !modalRef.current.contains(e.target) && e.target.id !== formType) {
                setShowModal(false);
                setForm("");
                setUser(initialUser);
                document.body.classList.remove("modal-open");
                
                setAllowOpen(false);
                setTimeout(() => {
                    setAllowOpen(true); // Allow reopening after delay
                  }, 100); // Adjust the delay as needed
            }
            
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [formType, initialUser]);
    
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
