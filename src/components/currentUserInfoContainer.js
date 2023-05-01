import React, {useEffect, useRef, useState} from 'react';
import '../CSS/currentUserInfo.css';
import {updateDisplayName} from "../firebase";

function CurrentUserInfoContainer({showCurrUserInf, setShowCurrUserInf, user}) {
    const currentUserInfoContainerRef = useRef(null);
    const [editMode, setEditMode] = useState(false)
    const [displayName, setDisplayName] = useState(user.displayName)

    useEffect(() => {
        if (showCurrUserInf) {
            currentUserInfoContainerRef.current?.classList.add('showCurrUserInf');
        } else {
            currentUserInfoContainerRef.current?.classList.remove('showCurrUserInf');
        }
    }, [showCurrUserInf]);

    const handleSubmit = async (e) => {
        // e.preventDefault()
        try {
            const userDisplayName = await updateDisplayName(displayName)
            console.log(userDisplayName)
        }catch (err) {
            console.log(err)

        }
    }
    const handleEditDisplayName = async () => {
        if (editMode === true) {

        }
        setEditMode(!editMode)
    }
    return (
        <>
            <div className={'current-user-info-container'} ref={currentUserInfoContainerRef}>
                <div className={'current-user-info-header'}><p className={'my-profile'}>Profilim</p></div>
                <div className={'current-user-info'}>
                    <div className={'avatar-xl'}><img src={user?.avatarLink} alt="avatar"/> </div>
                    <label>Kullanıcı Adı:</label>
                    <div className={'display-name-container'}>
                        {
                            editMode
                                ?  <>
                                        <form className={'display-name-edit-form'} onSubmit={handleSubmit}>
                                            <input type="text" className={'display-name-edit-input'} value={displayName} autoFocus={true}
                                            onChange={(e) => setDisplayName(e.target.value) }
                                            />
                                        </form>
                                        <div className={'display-name-edit-icon'} onClick={handleEditDisplayName}><i
                                            className="fa fa-check" aria-hidden="true"></i>
                                        </div>
                                    </>
                                :   <>
                                        <div className={'display-name'}><p>{user?.displayName}</p></div>
                                        <div className={'display-name-edit-icon'} onClick={handleEditDisplayName}><i className="fa fa-pencil" aria-hidden="true"></i></div>
                                    </>

                        }

                    </div>
                    <label>Hakkımda:</label>
                    <div className={'about-me-container'}>
                        <div className={'about-me'}> <p>Müsait</p> </div>
                        <div className={'about-me-edit-icon'}><i className="fa fa-pencil" aria-hidden="true"></i></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CurrentUserInfoContainer;