import React, {useEffect, useRef, useState} from 'react';
import '../CSS/chat.css';
import '../CSS/chat-ph.css';
import Connections from "../components/connections";
import {
    getAllUserData, getLatestMessages,
    getUserData,
    listenMessage, listenTyping, listImages, sendBOTMessage, sendFiles,
    sendMessage, setBOTMessageLTS, setLatestConnection, setLatestMessages, setTyping, setUnreadMessages,
    snapshotToArray, updateLatestConnection,
    updateUserConnections
} from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Messages from "../components/messages";
import {getAuth} from "firebase/auth";
import useSelectUser from "../stores/useSelectUser";
import useConnections from "../stores/useConnections";
import useLatestMessage from "../stores/useLatestMessage";
import reporter from "../stores/reporter";
import InfoContainer from "../components/infoContainer";
import SearchMessageContainer from "../components/searchMessageContainer";
import CurrentUserInfoContainer from "../components/currentUserInfoContainer";
import useSelectMessage from "../stores/useSelectMessage";
import useTypingUsers from "../stores/useTypingUsers";
import ProgressBar from "../components/progressBar";
import useFileProgress from "../stores/useFileProgress";
import useToggleReplyMode from "../stores/useToggleReplyMode";
import RepliedMessageContainer from "../components/repliedMessageContainer";
import {faComments, faEarthAmericas, faGears, faPhone, faUser} from "@fortawesome/free-solid-svg-icons";
import ChatAreaContainer from "../components/chatAreaContainer";
import useShowChat from "../stores/useShowChat";
import usePhScreenSize from "../stores/usePhScreenSize";

function Chat(props) {
    const [otoMessageCounter, setOtoMessageCounter] = useState(['1'])
    const [showInfoContainer, setShowInfoContainer] = useState(false)
    const [showInfoContainerMedium, setShowInfoContainerMedium] = useState(false)
    const [showCurrInfoContainer, setShowCurrInfoContainer] = useState(false)
    const [showSearchContainer, setShowSearchContainer] = useState(false)
    const [showSearchContainerMedium, setShowSearchContainerMedium] = useState(false)
    const [currentMessage, setCurrentMessage] = useState('')
    const [connectionSearchInput, setConnectionSearchInput] = useState('')
    const [allUserData, setAllUserData] = useState([])
    const [currentUserData, setCurrentUserData] = useState([])
    const [filteredUserData, setFilteredUserData] = useState([])
    const [searching, setSearching] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const selectedUser = useSelectUser(state => state.user);
    const selectedMessage = useSelectMessage(state => state.selectedMessage);
    const showChat = useShowChat(state => state.showChat);
    const setSelectedUser = useSelectUser(state => state.setUser);
    const connections_ = useConnections(state => state.connections_);
    const setConnections = useConnections(state => state.setConnections);
    const setLatestMessage = useLatestMessage(state => state.setMessage);
    const setTypingUsers = useTypingUsers(state => state.setTypingUsers);
    const typingUsers = useTypingUsers(state => state.typingUsers);
    const fileProgress = useFileProgress(state => state.fileProgress);
    const setFileProgress = useFileProgress(state => state.setFileProgress);
    const messageKey = useToggleReplyMode(state => state.messageKey);
    const replyMode = useToggleReplyMode(state => state.replyMode);
    const setReplyMode = useToggleReplyMode(state => state.setReplyMode);
    const setPhScreen = usePhScreenSize(state => state.setPhScreen);
    const setReporterBird = reporter(state => state.setReporter); //HABERCİ KUŞ
    const [chatOrj, setChatOrj] = useState([]);
    const [chat, setChat] = useState([]);
    const [screenWidth, setScreenWidth] = useState(undefined);

    useEffect(() => {
        setScreenWidth(window.innerWidth)
        if (window.innerWidth <= 900) {
            setPhScreen(true)
        }
        console.log('SCREEN',window.innerWidth)
    },[window.innerWidth])

    useEffect(() => {
        getAllUserData().then((response) => {
            setAllUserData(response.filter(x => x.userID !== getAuth().currentUser.uid));
            setConnections(response.find(x => x.userID === getAuth().currentUser.uid).connections);
            setCurrentUserData(response.find(x => x.userID === getAuth().currentUser.uid));
            const latestConnID = response.find(x => x.userID === getAuth().currentUser.uid).latestConnection;
            (latestConnID) && getUserData(latestConnID).then((response) => setSelectedUser(response)) // !== null

        });

    },[]);

    useEffect(() => {
        listenMessage((snapshot) => {
            let result = snapshotToArray(snapshot);
            if (result) {
                if (selectedUser && selectedUser.userID) {
                    result = result.filter(x =>
                        (x.senderUserId === getAuth().currentUser.uid && x.recieverUserId === selectedUser.userID) ||
                        (x.recieverUserId === getAuth().currentUser.uid && x.senderUserId === selectedUser.userID)
                    )
                    console.log('ALL', result)
                    setChat(result);
                    setChatOrj(result);
                } else {
                    // setChat(result);
                    setChatOrj(result);
                }
                setReporterBird();
            }
        });

    }, [selectedUser])

    useEffect(() => {
        listenTyping( (snapshot) => {
            let result = snapshotToArray(snapshot);
            console.log('result',result)
            result.forEach((x) => {
                setTypingUsers(x)
            })
        })

    },[])

    useEffect(() => {

    },[connections_])

    useEffect(() => {
        setReplyMode(false)
    },[selectedUser])



    const handleSearchSubmit = (e) => {
        e.preventDefault();

    }



    const handleMessageSubmit = async (e) => { ////////////////// SEND MESSAGE
        e.preventDefault();
        if (currentMessage.length > 0 && selectedUser !== null) {
            //////////////////////////mesaj atıldığında bağlantı oluştur CROSS
            if (!connections_.includes(selectedUser.userID)) {
                updateUserConnections(getAuth().currentUser.uid, selectedUser.userID).then(()  => {
                    getUserData(getAuth().currentUser.uid).then((res) => {
                        setConnections(res.connections);
                    })
                })
            }
            if (!selectedUser.connections.includes(getAuth().currentUser.uid)) {
                await updateUserConnections(selectedUser.userID, getAuth().currentUser.uid)
            }
            await setLatestMessages(selectedUser.userID,currentMessage)
             updateLatestConnection(selectedUser.userID)
             setUnreadMessages(selectedUser.userID,currentMessage)
            if (replyMode) {
                sendMessage(selectedUser.userID, currentMessage,true, messageKey)
            }
            else {
                sendMessage(selectedUser.userID, currentMessage)
            }
            setCurrentMessage('')
            setReporterBird()
            // setTimeout(() => {
            //     sendBOTMessage(selectedUser.userID,'KATCHA-BOT')
            //     setBOTMessageLTS(selectedUser.userID, 'KATCHA-BOT')
            // },500)

        }
        if (selectedUser === null && otoMessageCounter.length < 10) {
            setOtoMessageCounter([...otoMessageCounter, '2'])
        }

    }
// setTyping(selectedUser?.userID, true)
    useEffect(() => {
        if (selectedUser && selectedUser.userID) {
            setTyping(selectedUser.userID, true)
            const timeoutId = setTimeout(() => {
                setTyping(selectedUser.userID, false)
            }, 1000);
            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [currentMessage]);

    const userInfoToggle = () => {
        let screenWidth = window.innerWidth;

        if (screenWidth < 1300) {
            // ekran genişliği 1300'den küçük olduğunda
            (showCurrInfoContainer === true) && setShowCurrInfoContainer(!showCurrInfoContainer)
            setShowInfoContainerMedium(!showInfoContainerMedium)
            setShowCurrInfoContainer(false)
            setShowSearchContainer(false)

        } else {
            // ekran genişliği 1300 veya daha büyük olduğunda
            (showSearchContainer === true) && setShowSearchContainer(!showSearchContainer)
            setShowInfoContainer(!showInfoContainer)
        }

    }
    const currUserInfoToggle = () => {
        (showInfoContainerMedium === true) && setShowInfoContainerMedium(!showInfoContainerMedium)
        setShowCurrInfoContainer(!showCurrInfoContainer)
    }
    const searchMessageToggle = () => {
        let screenWidth = window.innerWidth;
        if (screenWidth < 1300) {
            // ekran genişliği 1300'den küçük olduğunda
            (showCurrInfoContainer === true) && setShowCurrInfoContainer(!showCurrInfoContainer)
            setShowSearchContainerMedium(!showSearchContainerMedium)
            setShowCurrInfoContainer(false)
            setShowSearchContainer(false)

        } else {
            // ekran genişliği 1300 veya daha büyük olduğunda
            (showInfoContainer === true) && setShowInfoContainer(!showInfoContainer)
            setShowSearchContainer(!showSearchContainer)
        }

    }

    const handleFileSubmit = async (event) => {
        event.preventDefault()
        try {
            await sendFiles(event.currentTarget, selectedUser.userID, handleProgress);
            console.log('Dosya yükleme tamamlandı! İlgili işlemleri yapabilirsiniz.');
            // İlgili işlemleri burada gerçekleştirin
        } catch (error) {
            console.log('Dosya yükleme sırasında bir hata oluştu:', error);
        }

        if (!connections_.includes(selectedUser.userID)) {
            updateUserConnections(getAuth().currentUser.uid, selectedUser.userID).then(()  => {
                getUserData(getAuth().currentUser.uid).then((res) => {
                    setConnections(res.connections);
                })
            })
        }
        if (!selectedUser.connections.includes(getAuth().currentUser.uid)) {
            await updateUserConnections(selectedUser.userID, getAuth().currentUser.uid)
        }
        await setLatestMessages(selectedUser.userID, '☇ dosya')
        updateLatestConnection(selectedUser.userID)
        setUnreadMessages(selectedUser.userID, '☇ dosya')
        setReporterBird()

    }
    const handleProgress = (progress) => {
        console.log('İlerleme durumu:', progress);
        setFileProgress(progress)
    };
    const darkModeToggle = () => {
        if (darkMode) {
            document.documentElement.style.setProperty('--purple', '#5d49e1');
            document.documentElement.style.setProperty('--pink', '#fd014f');
            document.documentElement.style.setProperty('--white', '#fdfdfd');
            document.documentElement.style.setProperty('--gray', '#eeedf3');
            document.documentElement.style.setProperty('--black', '#161617');
            setDarkMode(false);
        }
        else {
            document.documentElement.style.setProperty('--purple', '#b2b4ff');
            document.documentElement.style.setProperty('--pink', '#fd014f');
            document.documentElement.style.setProperty('--white', '#161526');
            document.documentElement.style.setProperty('--gray', '#0f0f15');
            document.documentElement.style.setProperty('--black', '#fdfdfd');
            setDarkMode(true);
        }
    }



    return (
        <div className={'screen screenChat'}>

           <div className={'chatContainer'}>
               { screenWidth <= 900 && !showChat &&
               <div className={'header-connections-ph'}>
                       <label className={'chat-label'}>Sohbetler</label>
               </div>
               }
               {
                   !showChat ?
                       <div className={'connections-container'}>
                           {
                               screenWidth > 900 &&
                               <div className={'header-connections'}>
                                   <div className={'user-info'} onClick={currUserInfoToggle}>
                                       <div className={'user-photo'}><img src={currentUserData.avatarLink} alt="avatar"/></div>
                                       <div className={'user-display-name'}>{getAuth().currentUser?.displayName}</div>
                                   </div>
                                   <div className={'chat-logo'}></div>
                               </div>
                           }

                           {
                               showInfoContainerMedium &&
                               <InfoContainer showInf={showInfoContainerMedium} setShowInf={setShowInfoContainerMedium} user={selectedUser}/>
                               // <CurrentUserInfoContainer showCurrUserInf={showInfoContainerMedium} setShowCurrUserInf={setShowInfoContainerMedium} user={selectedUser}/>

                           }
                           { showSearchContainerMedium &&
                               <SearchMessageContainer showSrc={showSearchContainerMedium} setShowSrc={setShowSearchContainerMedium} chat={chatOrj} user={selectedUser} />

                           }
                           {
                               screenWidth > 900 &&
                               <CurrentUserInfoContainer showCurrUserInf={showCurrInfoContainer} setShowCurrUserInf={setShowCurrInfoContainer} user={currentUserData}/>

                           }
                           {  screenWidth > 900 &&
                               <label className={'chat-label'}>Chat</label>
                           }
                           {
                               <div className={'connections'}>
                                   <div className={'search'}>
                                       <div className={'search-bar'}>
                                           <div className={'search-icon'}><i className="fa fa-search"></i></div>
                                           <form className={'search-form'} onSubmit={handleSearchSubmit}>
                                               <input className={'connection-search-input'} type="text"
                                                      placeholder={'Aratın veya yeni bir sohbet başlatın'}
                                                      onChange={(e) => {
                                                          (e.target.value.length > 0) ? setSearching(true) : setSearching(false)
                                                          setFilteredUserData(allUserData.filter((x) => x.displayName.includes(e.target.value) || x.email.includes(e.target.value)))
                                                      } }
                                               />

                                           </form>
                                       </div>
                                   </div>

                                   { searching &&
                                       filteredUserData.map((x) => {
                                           return <Connections key={'COMP_DATA_CONNECTION_' + x.userID} userId={x.userID} userData={x}  />
                                       })
                                   }
                                   { !searching &&
                                       connections_?.map((x) => {
                                           return <Connections key={'COMP_CONNECTION_' + x} userId={x}  />
                                       })
                                   }
                               </div>

                           }
                       </div>
                       :
                       <ChatAreaContainer selectedUser={selectedUser} chat={chat}
                                          currentUserData={currentUserData}
                                          currentMessage={currentMessage}
                                          setCurrentMessage={setCurrentMessage}
                                          userInfoToggle={userInfoToggle}
                                          searchMessageToggle={searchMessageToggle}
                                          handleMessageSubmit={handleMessageSubmit}
                                          handleFileSubmit={handleFileSubmit}
                       />

               }
               {
                   screenWidth > 900 &&
                   <ChatAreaContainer selectedUser={selectedUser} chat={chat}
                                      currentUserData={currentUserData}
                                      currentMessage={currentMessage}
                                      setCurrentMessage={setCurrentMessage}
                                      userInfoToggle={userInfoToggle}
                                      searchMessageToggle={searchMessageToggle}
                                      handleMessageSubmit={handleMessageSubmit}
                                      handleFileSubmit={handleFileSubmit}
                   />
               }


               <SearchMessageContainer showSrc={showSearchContainer} setShowSrc={setShowSearchContainer} chat={chatOrj} user={selectedUser} />
               <InfoContainer showInf={showInfoContainer} setShowInf={setShowInfoContainer} user={selectedUser}/>
               <button className={'dark-mode-button'} onClick={darkModeToggle}>dark mode</button>
               {
                   !showChat &&
                   <div className={'bottom-bar'}>
                       <div className={'bar-icon'}>
                           <FontAwesomeIcon icon={faEarthAmericas} />
                           <span className={'bar-texts'}>Aramalar</span>
                       </div>
                       <div className={'bar-icon'}>
                           <FontAwesomeIcon icon={faPhone} />
                           <span className={'bar-texts'}>Aramalar</span>
                       </div>
                       <div className={'bar-icon'}>
                           <FontAwesomeIcon icon={faUser} />
                           <span className={'bar-texts'}>Aramalar</span>
                       </div>
                       <div className={'bar-icon'}>
                           <FontAwesomeIcon icon={faComments} />
                           <span className={'bar-texts'}>Aramalar</span>
                       </div>
                       <div className={'bar-icon'}>
                           <FontAwesomeIcon icon={faGears} />
                           <span className={'bar-texts'}>Aramalar</span>
                       </div>
                   </div>

               }
           </div>
        </div>
    );

}

export default Chat;