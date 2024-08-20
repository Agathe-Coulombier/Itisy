import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./CreateFolder.css"; 

const CreateFolder = (props) => {
    const [folderInput, setFolderInput] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleInputChange = (e) => {
        setFolderInput(e.target.value);
    };

    const handleFolderCreation = async () => {
        setError("");
        try {
            const res = await axios.patch("http://localhost:4000/recipes/createFolder", {
                userId: props.user.id, 
                recipesId: props.folderItems, 
                folderName: folderInput 
            }, { withCredentials: true });

            if (res.status === 200) {
                props.setCurrentFolder(folderInput);
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
    <div className= {props.trackMode==="create-folder" && "create-folder"}>
        <input 
        type="text" 
        value={folderInput}
        onChange={handleInputChange} 
        placeholder={t("Folder's name")}/>
        <button  className="primary" onClick={handleFolderCreation}> 
            create folder
        </button>
        {error && <p>{error}</p>}
    </div>
    );
};

export default CreateFolder;
