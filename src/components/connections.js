import React, {useState} from 'react';
import '../CSS/connection.css';
import useSelectUser from "../stores/useSelectUser";

function Connections({user}) {
    const [userDetail, setUserDetail] = useState({...user});
    const setUser = useSelectUser(state => state.setUser);

    const handleClick = () => {
        setUser(userDetail);
    }
    return (
        <div id={userDetail.userID} onClick={handleClick}>
            <div className={'connectionBanner'}>
                <div className={'connection-photo'}></div>
                <div className={'connection-info'}>
                    <div className={'connection-title'}>{userDetail.displayName}</div>
                    <div className={'connection-index'}>{userDetail.email}</div>
                </div>
                <div className={'connection-date'}>13:46</div>
            </div>
        </div>
    );
}

export default Connections;