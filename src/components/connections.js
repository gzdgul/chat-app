import React, {useEffect, useState} from 'react';
import '../CSS/connection.css';
import useSelectUser from "../stores/useSelectUser";
import {getUnreadMessages, getUserData, setUnreadMessages} from "../firebase";
import LatestMessages from "./latestMessages";
import useNotificationList from "../stores/useNotificationList";

function Connections({userId, userData}) {
    const [userDetail, setUserDetail] = useState(null);
    const [LatestMessageUser, setLatestMessageUser] = useState('');
    const [unreadMessagesList, setUnreadMessagesList] = useState([]);
    const [unreadConnection, setUnreadConnection] = useState(false);
    const setSelectedUser = useSelectUser(state => state.setUser);
    const selectedUser = useSelectUser(state => state.user);
    const addUserToNotificationList = useNotificationList(state => state.addNotificationList);
    const removeUserToNotificationList = useNotificationList(state => state.removeNotificationList);
    const notificationList = useNotificationList(state => state.notificationList);

    // const fetchUnreadMessages = async () => {
    //     return await getUnreadMessages()
    // }


    useEffect(() => {
        getUserData(userId).then((res) => { // current user ın connections arrayindeki her bir UID nin full datası
            setUserDetail(res);
        })

    }, [])

    useEffect(() => {
        getUnreadMessages().then((res) => {
            setUnreadMessagesList(res)
            setUnreadConnection(res.find((x) => x.recieverID === userDetail?.userID)) //user unreadMes datasında ki bu kişiyi bul

        })
    },[LatestMessageUser])
    const createNotification = async (LatestConnection) => {
        setLatestMessageUser(LatestConnection)
        if (selectedUser.userID === userDetail.userID) {
            setUnreadConnection(false)
            await setUnreadMessages(userDetail.userID,null,'delete')
        }
    }

    const handleClick = async () => {
        setSelectedUser(userDetail);
        if (unreadConnection) {
            await setUnreadMessages(userDetail.userID,null,'delete')
        }

    }

    // console.log('notificationList',notificationList)
    if (!userDetail) return null;

    return (
        <div id={userDetail.userID} onClick={handleClick}>
            <div className={!(unreadConnection) ? 'connectionBanner' : 'connectionBanner notification'}>
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
                    { unreadConnection &&
                        <div className={'notification-alert'}></div>
                    }</div>
            </div>
        </div>
    );
}

export default Connections;