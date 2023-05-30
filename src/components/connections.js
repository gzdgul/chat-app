import React, {useEffect, useRef, useState} from 'react';
import '../CSS/connection.css';
import useSelectUser from "../stores/useSelectUser";
import {getUnreadMessages, getUserData, listenTyping, setUnreadMessages, snapshotToArray} from "../firebase";
import LatestMessages from "./latestMessages";
import useNotificationList from "../stores/useNotificationList";
import reporter from "../stores/reporter";
import useTypingUsers from "../stores/useTypingUsers";
import useShowChat from "../stores/useShowChat";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Connections({userId, userData}) {
    const [userDetail, setUserDetail] = useState(null);
    const [LatestMessageUser, setLatestMessageUser] = useState('');
    const [unreadMessagesList, setUnreadMessagesList] = useState([]);
    const [unreadConnection, setUnreadConnection] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const setSelectedUser = useSelectUser(state => state.setUser);
    const selectedUser = useSelectUser(state => state.user);
    const addUserToNotificationList = useNotificationList(state => state.addNotificationList);
    const setShowChat = useShowChat(state => state.setShowChat);
    const removeUserToNotificationList = useNotificationList(state => state.removeNotificationList);
    const notificationList = useNotificationList(state => state.notificationList);
    const setReporterBird = reporter(state => state.setReporter); //HABERCİ KUŞ
    const typingUsers = useTypingUsers(state => state.typingUsers);
    const connectionContainerRef = useRef(null)


    useEffect(() => {
        getUserData(userId).then((res) => { // current user ın connections arrayindeki her bir UID nin full datası
            setUserDetail(res);
        })

    }, [])

    useEffect(() => {
        const user = typingUsers.find((x) => x.typerID === userId)
            setIsTyping(user?.status)
    }, [typingUsers])

    useEffect(() => {
        getUnreadMessages().then((res) => {
            setUnreadMessagesList(res)
            setUnreadConnection(res.find((x) => x.recieverID === userDetail?.userID)) //user unreadMes datasında ki bu kişiyi bul
        })

    },[LatestMessageUser])


    const createNotification = async (LatestConnection) => {
        setLatestMessageUser(LatestConnection)
        if (selectedUser?.userID === userDetail.userID) {
            setUnreadConnection(false)
            await setUnreadMessages(userDetail.userID,null,'delete')
        }
    }

    const handleClick = async () => {
        setSelectedUser(userDetail);
        let screenWidth = window.innerWidth;
        if (screenWidth < 900) {
            setShowChat(true)
        }
        const elements = document.querySelectorAll(".selected");
        elements.forEach((element) => {
            element.className = "connectionBanner";
        });
        connectionContainerRef.current.className = 'selected'
        if (unreadConnection) {
            await setUnreadMessages(userDetail.userID,null,'delete')
        }

    }

    // console.log('notificationList',notificationList)
    if (!userDetail) return null;

    return (
        <div id={userDetail.userID} onClick={handleClick}>
            <div className={!(unreadConnection) ? 'connectionBanner' : 'connectionBanner notification' } ref={connectionContainerRef}>

                <div className={'connection-photo'}><img src={userDetail.avatarLink} alt="avatar"/></div>
                <div className={'connection-info'}>
                    <div className={'connection-title'}>
                        {userDetail.displayName}
                        <span style={{color: 'var(--pink)'}}> {userData ? `(${userData.email})` : ''}</span>
                    </div>
                    <div className={'connection-index'}>
                        { isTyping
                            ? <span style={{
                                color: "red"
                            }}>yazıyor...</span>
                            : <LatestMessages key={'LAST_MESSAGE_' + userDetail.userID} UID = {userDetail.userID} place = {'index'} createNotification = {createNotification}/>}
                    </div>
                </div>

                <div className={'connection-date'}>{<LatestMessages  key={'LAST_MESSAGE_DATE_' + userDetail.userID} UID = {userDetail.userID} place = {'date'} createNotification = {createNotification}/>}
                    { unreadConnection &&
                        <div className={'notification-alert'}></div>
                    }</div>
            </div>
        </div>
    );
}

export default Connections;