import React from 'react';
import '../CSS/modal-avatar.css';
import useSelectAvatar from "../stores/useSelectAvatar";
import useToggleAvatarMenu from "../stores/useToggleAvatarMenu";

function ModalAvatar({avatarLink}) {
    const setAvatarLink = useSelectAvatar(state => state.setAvatarLink);
    const setAvatarMenu = useToggleAvatarMenu(state => state.setAvatarMenu);

    const handleClick = (e) => {
        setAvatarLink(e.target.alt)
        setAvatarMenu(false)
    }
    return (
        <div>
            <div className={'avatar-picture'} onClick={handleClick}>
                <img src={avatarLink} alt={avatarLink}/>
            </div>

        </div>
    );
}

export default ModalAvatar;