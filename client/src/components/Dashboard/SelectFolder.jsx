import React, {useState} from 'react';
import "./SelectFolder.css"; 
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RiArrowDropDownLine } from "react-icons/ri";
import { PiFolderSimplePlus } from "react-icons/pi";
import { LuFolderEdit } from "react-icons/lu";
import { AiOutlineDelete } from "react-icons/ai";

const DisplayRecipes = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const createFolderClick = () => {
        props.setCurrentFolder("All my recipes");
        props.setFolderItems([]);
        navigate('/dashboard/create-folder');
    };

    const modifyFolderClick = async () => {
        navigate('/dashboard/modify-folder');
    };

    return (
        <div className='recipe-folders'>
            <span onClick={() => props.setShowFolders(!props.showFolders)}>
                <p>{t(props.currentFolder)}</p>
                <RiArrowDropDownLine />
            </span>
            <div className= {props.showFolders? 'dropdown open' : 'dropdown'}>
                {props.userFolders.folders.length === 1 ? 
                    <span onClick={() => createFolderClick()}>
                        <p>{t('No folder yet...')}</p>
                        < PiFolderSimplePlus />
                    </span>
                    :
                    props.userFolders.folders.map( (folder, index) => (
                        folder !== props.currentFolder && 
                        <span key={index} onClick={() => props.handleFolderSelection(folder)}>
                            <p>{t(folder)}</p>
                        </span>
                    ))}
            </div>
            {props.currentFolder === "All my recipes" ?
            <div className='create-folder' onClick={() => createFolderClick()}>
                < PiFolderSimplePlus />
            </div>
            :
            <div>
            <div className='modify-folder' onClick={() => modifyFolderClick()}>
                <LuFolderEdit />
            </div>
            <div className='delete-folder' onClick={() => props.deleteFolder()}>
                <AiOutlineDelete />
            </div>
            </div>
            }

            

        </div>
    );
};

export default DisplayRecipes;
