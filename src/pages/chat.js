import React, {useEffect, useRef, useState} from 'react';
import '../CSS/chat.css';
import Connections from "../components/connections";
import {getAllUserData, listenMessage, sendMessage, snapshotToArray} from "../firebase";
import Messages from "../components/messages";
import {getAuth} from "firebase/auth";
import useSelectUser from "../stores/useSelectUser";

function Chat(props) {
    const [currentMessage, setCurrentMessage] = useState('')
    const [messageList, setMessageList] = useState([])
    const [recieveMessageList, setRecieveMessageList] = useState([])
    const [data, setData] = useState([])
    const [connections, setConnections] = useState([])

    const selectedUser = useSelectUser(state => state.user);
    const [chat, setChat] = useState([]);
    const chatDiv = useRef(null);

    useEffect(() => {
        getAllUserData().then((response) => {
            setConnections(response.filter(x => x.userID !== getAuth().currentUser.uid));
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
                setChat(result);
            });
        }
    }, [selectedUser])

    useEffect(() => {
        // chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
    }, [chat])

    // console.log('DATA',data)
    // console.log('recieveMessageList',recieveMessageList)

    // result.map((x) => setMessageList([...messageList, x.message])

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        sendMessage(selectedUser.userID, currentMessage)
        // setMessageList([...messageList, currentMessage])
        setCurrentMessage('')
        // alert(currentMessage)
    }
    return (
        <div className={'screen screenChat'}>
           <div className={'chatContainer'}>
               <div className={'connections-container'}>
                   <div className={'header-connections'}>
                      <div className={'user-info'}>
                          <div className={'user-photo'}></div>
                          <div className={'user-display-name'}>{getAuth().currentUser?.displayName}</div>
                      </div>
                       <div className={'chat-logo'}></div>
                   </div>
                   <div className={'connection-search'}>
                       <div className={'connection-search-bar'}>
                           <div className={'connection-search-icon'}><i className="fa fa-search"></i></div>
                           <input className={'connection-search-input'} type="text" placeholder={'Aratın veya yeni bir sohbet başlatın'}/>
                       </div>

                   </div>
                   <div className={'connections'}>
                       {
                           connections.map((x) => {
                               return <Connections key={'COMP_CONNECTION_' + x.userID} user={x} />
                           })
                       }

                   </div>
               </div>
               <div className={'chat-area-container'}>
                   <div className={'header-chat-area'}>
                       <div className={'header-chat-user-index'}>
                           <div className={'friend-logo'}></div>
                           <div className={'friend-name'}>{selectedUser?.email}</div>
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
                           chat.map((messageObj) => {
                               if (messageObj.senderUserId === getAuth().currentUser.uid) {
                                   return <Messages message ={messageObj.message} sender='me' />
                               } else {
                                   return <Messages message ={messageObj.message} sender='friend' />
                               }
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
                       <div className={'send-button'}>Send</div>
                   </div>
               </div>
               {/*<div className={'chat-user-info-and-search-container'}>*/}
               {/*    <div className={'header-user-info'}>*/}
               {/*        <button className={'cancel-button'}></button>*/}
               {/*        <p>Kişi Bilgisi</p>*/}
               {/*    </div>*/}
               {/*    <div className={'user-photo-index'}>*/}
               {/*        <div className={'user-photo-xl'}></div>*/}
               {/*        <p>John Tester</p>*/}
               {/*    </div>*/}
               {/*</div>*/}
           </div>
        </div>
    );
}

export default Chat;