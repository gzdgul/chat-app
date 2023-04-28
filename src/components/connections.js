import React, {useEffect, useState} from 'react';
import '../CSS/connection.css';
import useSelectUser from "../stores/useSelectUser";
import { getUserData } from "../firebase";
import useConnections from "../stores/useConnections";
import LatestMessages from "./latestMessages";

function Connections({userId, userData}) {
    const [userDetail, setUserDetail] = useState(null);
    const [notification, setNotification] = useState(false);
    const [test, setTest] = useState('');
    const connections = useConnections(state => state.connections_)
    const setConnections = useConnections(state => state.setConnections)
    const setSelectedUser = useSelectUser(state => state.setUser);
    const selectedUser = useSelectUser(state => state.user);

    useEffect(() => {
        getUserData(userId).then((res) => { // current user ın connections arrayindeki her bir UID nin full datası
            setUserDetail(res);
        })
    }, [])

    const createNotification = (LatestConnection) => {
        setTest(LatestConnection.message)
        if (LatestConnection.message !== test && LatestConnection.recieverID === userId) {
            if (LatestConnection.sender !== 'me' && LatestConnection.recieverID !== selectedUser.userID ) {
                setNotification(true)
            }
        }
    }

    const handleClick = () => {
        setSelectedUser(userDetail);
        setNotification(false)
    }


    if (!userDetail) return null;

    return (
        <div id={userDetail.userID} onClick={handleClick}>
            <div className={(!notification) ? 'connectionBanner' : 'connectionBanner notification'}>
                <div className={'connection-photo'}><img src={userDetail.avatarLink} alt="avatar"/></div>
                <div className={'connection-info'}>
                    <div className={'connection-title'}>
                        {userDetail.displayName}
                        <span style={{color: '#ef3933'}}> {userData ? `(${userData.email})` : ''}</span>
                    </div>
                    <div className={'connection-index'}>
                        {<LatestMessages UID = {userDetail.userID} place = {'index'} createNotification = {createNotification}/>}</div>
                </div>

                <div className={'connection-date'}>{<LatestMessages UID = {userDetail.userID} place = {'date'} createNotification = {createNotification}/>}
                    { notification &&
                        <div className={'notification-alert'}></div>
                    }</div>
            </div>
        </div>
    );
}

export default Connections;