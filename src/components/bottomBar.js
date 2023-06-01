import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments, faEarthAmericas, faGears, faPhone, faUser} from "@fortawesome/free-solid-svg-icons";

function BottomBar(props) {
    return (
        <div className={'bottom-bar'}>
            <div className={'bar-icon'}>
                <FontAwesomeIcon icon={faEarthAmericas} />
                <span className={'bar-texts'}>Global</span>
            </div>
            <div className={'bar-icon'}>
                <FontAwesomeIcon icon={faPhone} />
                <span className={'bar-texts'}>Aramalar</span>
            </div>
            <div className={'bar-icon'}>
                <FontAwesomeIcon icon={faUser} />
                <span className={'bar-texts'}>Profilim</span>
            </div>
            <div className={'bar-icon'}>
                <FontAwesomeIcon icon={faComments} />
                <span className={'bar-texts'}>Mesajlar</span>
            </div>
            <div className={'bar-icon'}>
                <FontAwesomeIcon icon={faGears} />
                <span className={'bar-texts'}>Ayarlar</span>
            </div>
        </div>
    );
}

export default BottomBar;