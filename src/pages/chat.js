import React, {useEffect, useRef, useState} from 'react';
import '../CSS/chat.css';
import Connections from "../components/connections";
import {
    getAllUserData, getLatestMessages,
    getUserData,
    listenMessage,
    sendMessage, setLatestMessages,
    snapshotToArray,
    updateUserConnections
} from "../firebase";
import Messages from "../components/messages";
import {getAuth} from "firebase/auth";
import useSelectUser from "../stores/useSelectUser";
import useConnections from "../stores/useConnections";
import useLatestMessage from "../stores/useLatestMessage";
import reporter from "../stores/reporter";

function Chat(props) {
    const [currentMessage, setCurrentMessage] = useState('')
    const [connectionSearchInput, setConnectionSearchInput] = useState('')
    const [allUserData, setAllUserData] = useState([])
    const [currentUserData, setCurrentUserData] = useState([])
    const [filteredUserData, setFilteredUserData] = useState([])
    const [searching, setSearching] = useState(false)
    const selectedUser = useSelectUser(state => state.user);
    const connections_ = useConnections(state => state.connections_);
    const setConnections = useConnections(state => state.setConnections);
    const setLatestMessage = useLatestMessage(state => state.setMessage);
    const setReporterBird = reporter(state => state.setReporter); //HABERCİ KUŞ

    const [chat, setChat] = useState([]);
    const chatDiv = useRef(null);

    useEffect(() => {
        getAllUserData().then((response) => {
            setConnections(response.find(x => x.userID === getAuth().currentUser.uid).connections);
            setCurrentUserData(response.find(x => x.userID === getAuth().currentUser.uid));
            setAllUserData(response.filter(x => x.userID !== getAuth().currentUser.uid));
        });
    },[]);

    useEffect(() => {
        if (selectedUser) {
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
                console.log('chatTEST',chat)
            });
        }
        else {

        }

    }, [selectedUser])

    const handleSearchSubmit = (e) => {
        e.preventDefault();

    }

    useEffect(() => {
        chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
    }, [chat])

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (currentMessage.length > 0) {
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
                updateUserConnections(selectedUser.userID, getAuth().currentUser.uid)
            }
            setCurrentMessage('')
            setLatestMessages(selectedUser.userID,currentMessage)
            setReporterBird()
        }

    }

    const checkDate = (curr, prev) => {
        const curr_date = new Date(curr.date);
        const prev_date = new Date(prev.date);
        if (curr_date.toLocaleDateString() !== prev_date.toLocaleDateString()) {
            return (
                <div style={{width: "100%", textAlign: "center", backgroundColor: "green"}}>
                    {curr_date.toDateString()}
                </div>
            )
        }
    }
    return (
        <div className={'screen screenChat'}>
           <div className={'chatContainer'}>
               <div className={'connections-container'}>
                   <div className={'header-connections'}>
                      <div className={'user-info'}>
                          <div className={'user-photo'}><img src={currentUserData.avatarLink} alt="avatar"/></div>
                          <div className={'user-display-name'}>{getAuth().currentUser?.displayName}</div>
                      </div>
                       <div className={'chat-logo'}></div>
                   </div>
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
               </div>
               <div className={'chat-area-container'}>
                   <div className={'header-chat-area'}>
                       <div className={'header-chat-user-index'}>
                           {selectedUser &&
                               <div className={'friend-logo'}><img src={selectedUser?.avatarLink} alt="avatar"/></div>
                           }
                           <div className={'friend-name'}>{selectedUser?.displayName}</div>
                       </div>

                       <div className={'chat-options'}>
                           <div className={'chat-search-icon'}><i className="fa fa-search"></i></div>
                           <div className={'chat-options-icon'}>︙</div>
                       </div>
                   </div>
                   <div className={'chat-area'} ref={chatDiv}>
                       <div className={'chat-start'}>
                           <div className={'chat-bubble'}>CHAT START</div>
                       </div>
                       {
                           chat.map((messageObj, index) => {
                               return (
                                   <>
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
               <div className={'chat-user-info-and-search-container'}>
                   <div className={'header-user-info'}>
                       <div>Kişi Bilgisi</div>
                       <button className={'cancel-button'}>✖</button>

                   </div>
                   <div className={'user-photo-index'}>
                       <div className={'user-photo-xl'}></div>
                       <p className={'user-info-name'}>John Tester</p>
                       <p className={'user-info-mail'}>john@test.com</p>
                   </div>
                   <div className={'user-info-media-container'}>
                       <div className={'user-info-media-header'}>
                           <p>Medyalar, bağlantılar ve belgeler</p>
                           <div className={'user-info-media-arrow'}>›</div>
                       </div>
                       <div className={'user-info-media-footer-container'}>
                           <div className={'user-info-media'}></div>
                           <div className={'user-info-media'}></div>
                           <div className={'user-info-media'}></div>
                           <div className={'user-info-media'}></div>
                           <div className={'user-info-media'}></div>
                           <div className={'user-info-media'}></div>
                       </div>

                   </div>
                   <div className={'user-info-action-container'}>
                       <div className={'user-info-star-message'}><div className={'star-icon'}></div> Yıldızlı Mesajlar</div>
                       <div className={'user-info-block'}> <div className={'block-icon'}></div> John Tester kişisini engelle</div>
                       <div className={'user-info-report'}> <div className={'report-icon'}></div> John Tester kişisini şikayet et</div>
                       <div className={'user-info-delete'}> <div className={'delete-icon'}></div> John Tester kişisini sil</div>
                       <div className={'user-info-delete-messages'}> <div className={'delete-messages-icon'}></div> Tüm mesajları sil</div>
                   </div>
               </div>
           </div>
        </div>
    );
}

export default Chat;