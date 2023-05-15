import React, {useEffect, useRef, useState} from 'react';
import '../CSS/chat.css';
import Connections from "../components/connections";
import {
    getAllUserData, getLatestMessages,
    getUserData,
    listenMessage, listenTyping, listImages, sendBOTMessage, sendFiles,
    sendMessage, setBOTMessageLTS, setLatestConnection, setLatestMessages, setTyping, setUnreadMessages,
    snapshotToArray, updateLatestConnection,
    updateUserConnections
} from "../firebase";
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
    const [isTyping, setIsTyping] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const selectedUser = useSelectUser(state => state.user);
    const selectedMessage = useSelectMessage(state => state.selectedMessage);
    const setSelectedUser = useSelectUser(state => state.setUser);
    const connections_ = useConnections(state => state.connections_);
    const setConnections = useConnections(state => state.setConnections);
    const setLatestMessage = useLatestMessage(state => state.setMessage);
    const setTypingUsers = useTypingUsers(state => state.setTypingUsers);
    const typingUsers = useTypingUsers(state => state.typingUsers);
    const fileProgress = useFileProgress(state => state.fileProgress);
    const setFileProgress = useFileProgress(state => state.setFileProgress);
    const replyMode = useToggleReplyMode(state => state.replyMode);
    const setReplyMode = useToggleReplyMode(state => state.setReplyMode);
    const setReporterBird = reporter(state => state.setReporter); //HABERCİ KUŞ
    const [chatOrj, setChatOrj] = useState([]);
    const [chat, setChat] = useState([]);
    const chatDiv = useRef(null);

    useEffect(() => {
        getAllUserData().then((response) => {
            setAllUserData(response.filter(x => x.userID !== getAuth().currentUser.uid));
            setConnections(response.find(x => x.userID === getAuth().currentUser.uid).connections);
            setCurrentUserData(response.find(x => x.userID === getAuth().currentUser.uid));
            const latestConnID = response.find(x => x.userID === getAuth().currentUser.uid).latestConnection;
            (latestConnID !== null) && getUserData(latestConnID).then((response) => setSelectedUser(response))

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
        setReplyMode(false)
    },[selectedUser])

    useEffect(() => {  ///CHATTEKİ TYPING YAZISI İÇİN
        const user = typingUsers?.find((y) => y.typerID === selectedUser?.userID)
        setIsTyping(user?.status)
    },[typingUsers])

    const handleSearchSubmit = (e) => {
        e.preventDefault();

    }

    useEffect(() => {
        chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
        setTimeout(() => {
            chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
        },1000)
    }, [chat])

    useEffect(() => {
        if (selectedMessage) {
            const messageElems = chatDiv.current.querySelectorAll('.chat-bubble, .chat-bubble-long');
            messageElems.forEach((elem) => {
                if (elem.textContent.includes(selectedMessage)) {
                    elem.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }, [selectedMessage]);

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
            sendMessage(selectedUser.userID, currentMessage)
            setCurrentMessage('')
            setReporterBird()
            setTimeout(() => {
                // sendBOTMessage(selectedUser.userID,'KATCHA-BOT')
                // setBOTMessageLTS(selectedUser.userID, 'KATCHA-BOT')
            },500)

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

    const checkDate = (curr, prev) => {
        const curr_date = new Date(curr.date);
        const prev_date = new Date(prev.date);
        const today_date = new Date()
        const diffTime = Math.abs(today_date - curr_date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (curr_date.toLocaleDateString() !== prev_date.toLocaleDateString()) {
            return (
                <div className={'date-bar-container'} key={curr.id} >
                    <div className={'date-bar'}>
                        {
                            (today_date.toLocaleDateString() === curr_date.toLocaleDateString())
                                ? 'Bugün'
                                : (diffDays < 8) ?
                                    (diffDays === 1)
                                    ? 'Dün'
                                    : curr_date.toLocaleDateString('default', { weekday: 'long' })
                                                :  (diffDays < 365)
                                                    ? curr_date.toLocaleDateString('default', { day: 'numeric', month: 'long', weekday: 'short' })
                                                    : curr_date.toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })
                        }
                    </div>
                </div>
            )
        }
    }
    return (
        <div className={'screen screenChat'}>

           <div className={'chatContainer'}>
               <div className={'connections-container'}>
                   <div className={'header-connections'}>
                      <div className={'user-info'} onClick={currUserInfoToggle}>
                          <div className={'user-photo'}><img src={currentUserData.avatarLink} alt="avatar"/></div>
                          <div className={'user-display-name'}>{getAuth().currentUser?.displayName}</div>
                      </div>
                       <div className={'chat-logo'}></div>
                   </div>
                   {
                       showInfoContainerMedium &&
                       <InfoContainer showInf={showInfoContainerMedium} setShowInf={setShowInfoContainerMedium} user={selectedUser}/>
                       // <CurrentUserInfoContainer showCurrUserInf={showInfoContainerMedium} setShowCurrUserInf={setShowInfoContainerMedium} user={selectedUser}/>

                   }
                   { showSearchContainerMedium &&
                       <SearchMessageContainer showSrc={showSearchContainerMedium} setShowSrc={setShowSearchContainerMedium} chat={chatOrj} user={selectedUser} />

                   }
                   <CurrentUserInfoContainer showCurrUserInf={showCurrInfoContainer} setShowCurrUserInf={setShowCurrInfoContainer} user={currentUserData}/>
                   <label className={'chat-label'}>Chat</label>
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
               <div className={'chat-area-container'}>
                   <div className={'header-chat-area'}>
                       <div className={'header-chat-user-index'} onClick={userInfoToggle}>
                           {selectedUser &&
                               <div className={'friend-logo'}><img src={selectedUser?.avatarLink} alt="avatar"/></div>
                           }
                           <div className={'friend-name'}>{selectedUser?.displayName}
                               {
                                   isTyping
                                       ? <span className={'typing'}>yazıyor...</span>
                                       : <span className={'online'}>online</span>
                               }
                           </div>
                       </div>

                       <div className={'chat-options'}>
                           <div className={'chat-search-icon'} onClick={searchMessageToggle} ><i className="fa fa-search"></i></div>
                           <div className={'chat-options-icon'}>︙</div>
                       </div>
                   </div>
                   <ProgressBar progress={fileProgress}/>
                   <div className={'chat-area'} ref={chatDiv}>
                       <div className={'chat-start'}></div>
                       {/*{*/}
                       {/*   (selectedUser === null ) &&*/}
                       {/*    otoMessageCounter.map((x,i) => {*/}
                       {/*        return  <Messages message ={x} date={new Date()} sender='oto' key={'OTO_' + i} />*/}
                       {/*    })*/}
                       {/*}*/}

                       {
                           chat.map((messageObj, index) => {
                               return (
                                   <>

                                       { (index === 0) && checkDate(messageObj, new Date()) }
                                       { (index !== 0) && checkDate(messageObj, chat[index - 1]) }
                                       {
                                           (messageObj.senderUserId === getAuth().currentUser.uid)
                                               ? <Messages message ={messageObj.message} date={messageObj.date} sender='me' key={messageObj.key} />
                                               : <Messages message ={messageObj.message} date={messageObj.date} sender='friend' key={messageObj.key}/>
                                       }
                                   </>
                               )
                           })
                       }
                   </div>
                   <div className={'footer-chat-area'}>
                       <div className={replyMode ? 'message-area-reply-mode' : 'message-area'}>
                           {/*<div className={'replied-message-container'}></div>*/}
                           {replyMode &&
                               <RepliedMessageContainer selectedUser={selectedUser} currentUser={currentUserData}/>
                           }
                           <form className={'testtt'} onSubmit={handleMessageSubmit}>
                               <input className={'message-input'} type="text" placeholder={'Bir mesaj yazın.'}
                                      value={currentMessage}
                                      onChange={(e) => {
                                          setCurrentMessage(e.target.value)


                                      }
                               }
                               />
                           </form>
                       </div>
                       <form className={'upload-file'} >
                           {/*<div className={'upload-file-icon'}>📎</div>*/}
                           <input type="file" id="myFile" style={{display: "none"}} onChange={handleFileSubmit}/>
                           <label htmlFor="myFile">
                               <div className={'upload-file-icon'}>📎</div>
                           </label>
                       </form>

                       <div className={'send-button'} onClick={handleMessageSubmit}>Gönder</div>
                   </div>
               </div>
               <SearchMessageContainer showSrc={showSearchContainer} setShowSrc={setShowSearchContainer} chat={chatOrj} user={selectedUser} />
               <InfoContainer showInf={showInfoContainer} setShowInf={setShowInfoContainer} user={selectedUser}/>
               <button className={'dark-mode-button'} onClick={darkModeToggle}>dark mode</button>
           </div>
        </div>
    );

}

export default Chat;