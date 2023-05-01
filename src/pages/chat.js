import React, {useEffect, useRef, useState} from 'react';
import '../CSS/chat.css';
import Connections from "../components/connections";
import {
    getAllUserData, getLatestMessages,
    getUserData,
    listenMessage,
    sendMessage, setLatestConnection, setLatestMessages,
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

function Chat(props) {
    const [otoMessageCounter, setOtoMessageCounter] = useState(['1'])
    const [showInfoContainer, setShowInfoContainer] = useState(false)
    const [showCurrInfoContainer, setShowCurrInfoContainer] = useState(false)
    const [showSearchContainer, setShowSearchContainer] = useState(false)
    const [currentMessage, setCurrentMessage] = useState('')
    const [connectionSearchInput, setConnectionSearchInput] = useState('')
    const [allUserData, setAllUserData] = useState([])
    const [currentUserData, setCurrentUserData] = useState([])
    const [filteredUserData, setFilteredUserData] = useState([])
    const [searching, setSearching] = useState(false)
    const selectedUser = useSelectUser(state => state.user);
    const setSelectedUser = useSelectUser(state => state.setUser);
    const connections_ = useConnections(state => state.connections_);
    const setConnections = useConnections(state => state.setConnections);
    const setLatestMessage = useLatestMessage(state => state.setMessage);
    const setReporterBird = reporter(state => state.setReporter); //HABERCİ KUŞ
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
        if (selectedUser !== null) {
            listenMessage((snapshot) => {
                let result = snapshotToArray(snapshot);
                if (result) {
                    result = result.filter(x =>
                        (x.senderUserId === getAuth().currentUser.uid && x.recieverUserId === selectedUser.userID) ||
                        (x.recieverUserId === getAuth().currentUser.uid && x.senderUserId === selectedUser.userID)
                    )
                }
                setReporterBird();
                setChat(result);
            });
        }
        else {
            listenMessage((snapshot) => { ///////////////!!!!!!!!!
                snapshotToArray(snapshot);
            });
            setReporterBird();
        }

    }, [selectedUser])

    const handleSearchSubmit = (e) => {
        e.preventDefault();

    }

    useEffect(() => {
        chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
    }, [chat])

    const handleMessageSubmit = async (e) => { ////////////////// SEND MESSAGE
        e.preventDefault();
        if (currentMessage.length > 0 && selectedUser !== null) {
            sendMessage(selectedUser.userID, currentMessage)
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
            setCurrentMessage('')
            await setLatestMessages(selectedUser.userID,currentMessage)
            updateLatestConnection(selectedUser.userID)
            setReporterBird()
        }
        if (selectedUser === null && otoMessageCounter.length < 10) {
            setOtoMessageCounter([...otoMessageCounter, '2'])
        }

    }

    const userInfoToggle = () => {
        (showSearchContainer === true) && setShowSearchContainer(!showSearchContainer)
        setShowInfoContainer(!showInfoContainer)
    }
    const currUserInfoToggle = () => {
        setShowCurrInfoContainer(!showCurrInfoContainer)
    }
    const searchMessageToggle = () => {
        (showInfoContainer === true) && setShowInfoContainer(!showInfoContainer)
        setShowSearchContainer(!showSearchContainer)
    }

    // const sabitlenenElemanRef = useRef(null);
    // const sabitlenenElemanPozisyon = useRef(null);
    //
    // useEffect(() => {
    //     if (sabitlenenElemanRef.current) {
    //         sabitlenenElemanPozisyon.current = sabitlenenElemanRef.current.getBoundingClientRect();
    //     }
    // }, [sabitlenenElemanRef.current]);
    //
    //
    // useEffect(() => {
    //     function handleScroll() {
    //         if (sabitlenenElemanRef.current) {
    //             const pozisyon = sabitlenenElemanRef.current.getBoundingClientRect();
    //             if (pozisyon.top >= 0 && pozisyon.bottom <= window.innerHeight) {
    //                 sabitlenenElemanRef.current.style.position = "sticky";
    //                 sabitlenenElemanRef.current.style.top = "0";
    //             } else {
    //                 sabitlenenElemanRef.current.style.position = "static";
    //             }
    //         }
    //     }
    //     // chatDiv.addEventListener("scroll", handleScroll);
    //     // return () => chatDiv.removeEventListener("scroll", handleScroll);
    // }, []);

    const checkDate = (curr, prev) => {
        const curr_date = new Date(curr.date);
        const prev_date = new Date(prev.date);
        const today_date = new Date()
        const diffTime = Math.abs(today_date - curr_date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (curr_date.toLocaleDateString() !== prev_date.toLocaleDateString()) {
            return (
                <div className={'date-bar-container'} >
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
                   <CurrentUserInfoContainer showCurrUserInf={showCurrInfoContainer} setShowCurrUserInf={setShowCurrInfoContainer} user={currentUserData}/>
                   {
                       <>
                           <div className={'connection-search'}>
                               <div className={'connection-search-bar'}>
                                   <div className={'connection-search-icon'}><i className="fa fa-search"></i></div>
                                   <form className={'search-form'} onSubmit={handleSearchSubmit}>
                                       <input className={'connection-search-input'} type="text"
                                              placeholder={'Aratın veya yeni bir sohbet başlatın'}
                                              onChange={(e) => {
                                                  (e.target.value.length > 0) ? setSearching(true) : setSearching(false)
                                                  setConnectionSearchInput(e.target.value)
                                                  setFilteredUserData(allUserData.filter((x) => x.displayName.includes(e.target.value) || x.email.includes(e.target.value)))
                                              } }
                                       />

                                   </form>
                               </div>

                           </div>
                           <div className={'connections'}>
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
                       </>
                   }
               </div>
               <div className={'chat-area-container'}>
                   <div className={'header-chat-area'}>
                       <div className={'header-chat-user-index'} onClick={userInfoToggle}>
                           {selectedUser &&
                               <div className={'friend-logo'}><img src={selectedUser?.avatarLink} alt="avatar"/></div>
                           }
                           <div className={'friend-name'}>{selectedUser?.displayName}</div>
                       </div>

                       <div className={'chat-options'}>
                           <div className={'chat-search-icon'} onClick={searchMessageToggle} ><i className="fa fa-search"></i></div>
                           <div className={'chat-options-icon'}>︙</div>
                       </div>
                   </div>
                   <div className={'chat-area'} ref={chatDiv}>
                       <div className={'chat-start'}></div>
                       {
                          (selectedUser === null ) &&
                           otoMessageCounter.map((x) => {
                               return  <Messages message ={x} date={new Date()} sender='oto' />
                           })
                       }

                       {
                           chat.map((messageObj, index) => {
                               return (
                                   <>

                                       { (index === 0) && checkDate(messageObj, new Date()) }
                                       { (index !== 0) && checkDate(messageObj, chat[index - 1]) }
                                       {
                                           (messageObj.senderUserId === getAuth().currentUser.uid)
                                               ? <Messages message ={messageObj.message} date={messageObj.date} sender='me' />
                                               : <Messages message ={messageObj.message} date={messageObj.date} sender='friend' />
                                       }
                                   </>
                               )
                           })
                       }
                   </div>
                   <div className={'footer-chat-area'}>
                       <div className={'message-area'}>
                           <form className={'testtt'} onSubmit={handleMessageSubmit}>
                               <input className={'message-input'} type="text" placeholder={'Bir mesaj yazın.'}
                                      value={currentMessage}
                                      onChange={(e) => setCurrentMessage(e.target.value) }
                               />
                           </form>
                       </div>
                       <div className={'upload-photo-icon'}>📎</div>
                       <div className={'send-button'} onClick={handleMessageSubmit}>Send</div>
                   </div>
               </div>
               <SearchMessageContainer showSrc={showSearchContainer} setShowSrc={setShowSearchContainer} user={selectedUser} />
               <InfoContainer showInf={showInfoContainer} setShowInf={setShowInfoContainer} user={selectedUser}/>
           </div>
        </div>
    );
}

export default Chat;