import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./CreateFolder.css"; 

const ModifyFolder = (props) => {
    const [folderInput, setFolderInput] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleInputChange = (e) => {
        setFolderInput(e.target.value);
    };

    const handleFolderModif = async () => {
        setError("");
        try {
            const res = await axios.patch("http://localhost:4000/recipes/modifyFolder", {
                userId: props.user.id, 
                recipesId: props.folderItems, 
                newFolderName: folderInput,
                oldFolderName: props.currentFolder
            }, { withCredentials: true });

            if (res.status === 200) {
                props.setCurrentFolder(folderInput === "" ? props.currentFolder : folderInput);
                navigate('/dashboard/view');
            }

        } catch (error) {
            console.error("Error response:", error.response);
            console.error("Error message:", error.message);
            console.error("Error code:", error.code);
            setError(error.response.data.message);
        }
    };

    return (
    <div className= {props.trackMode==="modify-folder" && "create-folder"}>
        <input 
        type="text" 
        value={folderInput}
        onChange={handleInputChange} 
        placeholder={props.currentFolder}/>
        <button  className="primary" onClick={handleFolderModif}> 
            {t('Modify folder')}
        </button>
        {error && <p>{error}</p>}
    </div>
    );
};

export default ModifyFolder;
