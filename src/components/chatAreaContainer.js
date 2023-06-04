import React, {useEffect, useRef, useState} from 'react';
import ProgressBar from "./progressBar";
import Messages from "./messages";
import RepliedMessageContainer from "./repliedMessageContainer";
import useToggleReplyMode from "../stores/useToggleReplyMode";
import useTypingUsers from "../stores/useTypingUsers";
import useFileProgress from "../stores/useFileProgress";
import useSelectMessage from "../stores/useSelectMessage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import useShowChat from "../stores/useShowChat";
import usePhScreenSize from "../stores/usePhScreenSize";
import useSelectUser from "../stores/useSelectUser";

function ChatAreaContainer({selectedUser, chat, currentUserData, currentMessage, setCurrentMessage, userInfoToggle, searchMessageToggle, handleMessageSubmit, handleFileSubmit}) {
    const replyMode = useToggleReplyMode(state => state.replyMode);
    const typingUsers = useTypingUsers(state => state.typingUsers);
    const [isTyping, setIsTyping] = useState(false)
    const fileProgress = useFileProgress(state => state.fileProgress);
    const selectedMessage = useSelectMessage(state => state.selectedMessage);
    const setSelectedUser = useSelectUser(state => state.setUser);
    const setShowChat = useShowChat(state => state.setShowChat);
    const showChat = useShowChat(state => state.showChat);
    const phScreen = usePhScreenSize(state => state.phScreen);
    const chatDiv = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (replyMode) {
            inputRef.current.focus();
        }
    },[replyMode])
    useEffect(() => {  ///CHATTEKİ TYPING YAZISI İÇİN
        const user = typingUsers?.find((y) => y.typerID === selectedUser?.userID)
        setIsTyping(user?.status)
    },[typingUsers])

    useEffect(() => {
        chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
        setTimeout(() => {
            chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
        },10)
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
    const handleClickBackPH = () => {
        setShowChat(false)
        setSelectedUser(null)
    }
    return (
        <div className={`${showChat && 'show-chat-area'} chat-area-container`}>
            <div className={'header-chat-area'}>
                <div className={'header-chat-user-index'} onClick={userInfoToggle}>
                    <div className={'ph-back-arrow'}
                        onClick={handleClickBackPH}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
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
                                    (messageObj.senderUserId === currentUserData.userID)
                                        ? <Messages message ={messageObj.message} date={messageObj.date} sender='me' repliedStatus={messageObj.replied} repliedMessageKey={messageObj.repliedMessageKey} currentMessageKey={messageObj.key} />
                                        : <Messages message ={messageObj.message} date={messageObj.date} sender='friend' repliedStatus={messageObj.replied} repliedMessageKey={messageObj.repliedMessageKey} currentMessageKey={messageObj.key}/>
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
                        <input className={'message-input'} type="text" placeholder={'Bir mesaj yazın.'} ref={inputRef}
                               value={currentMessage}
                               onChange={(e) => {
                                   setCurrentMessage(e.target.value)
                               }
                               }
                        />
                        <form className={'upload-file'} >
                            <input type="file" id="myFile" style={{display: "none"}} onChange={handleFileSubmit}/>
                            <label htmlFor="myFile">
                                <div className={'upload-file-icon'}>📎</div>
                            </label>
                        </form>
                    </form>

                </div>


                <div className={'send-button'} onClick={handleMessageSubmit}>
                    {!phScreen ? 'Gönder' : <FontAwesomeIcon icon={faPaperPlane} /> }</div>
            </div>
        </div>
    );
}

export default ChatAreaContainer;