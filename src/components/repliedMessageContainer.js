import React, {useEffect, useState} from 'react';
import '../CSS/replied-message.css';
import useToggleReplyMode from "../stores/useToggleReplyMode";
import useSelectUser from "../stores/useSelectUser";
import {getUserData, listenMessage, snapshotToArray} from "../firebase";
import {faReply, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function RepliedMessageContainer({currentUser, repliedStatus, repliedMessageKey}) {
    const selectedUser = useSelectUser(state => state.user);
    const setReplyMode = useToggleReplyMode(state => state.setReplyMode);
    const repliedMessage = useToggleReplyMode(state => state.repliedMessage);
    const [sender, setSender] = useState()
    const [sender_, setSender_] = useState()
    const [repliedMessage_, setRepliedMessage_] = useState(null)

   useEffect(() => {
       if (repliedMessage.sender === 'me') {
           console.log('currentUser',currentUser)
           setSender(currentUser?.displayName)
           console.log(repliedMessage.sender)
       }
       else
           setSender(selectedUser.displayName)

   },[repliedMessage])

    useEffect(() => {
        if (repliedStatus) {
            listenMessage(async (snapshot) => {
                let result = snapshotToArray(snapshot);
                let replied = result.find((x) => x.key === repliedMessageKey)
                console.log('replied****************',replied)
                console.log(replied)
                setRepliedMessage_(replied)
                await getUserData(replied.senderUserId).then((x) => setSender_(x.displayName))
            });
        }

    },[repliedMessageKey])

    const info = `${sender}, ${new Date(repliedMessage.date).toLocaleString().slice(0,-3)}`

    return (
                repliedStatus && repliedMessage_
                    ?
                    <div className={'replied-message-container messages'}>
                        <div className={'replied-icon'}><FontAwesomeIcon icon={faReply} /></div>
                <div className={'replied-message'}>
                    <div className={'message'}>{
                        repliedMessage_?.message.url
                            ? <img className={'img-message'} style={{
                                width: '100px'
                            }} src={repliedMessage_?.message.url} alt={repliedMessage_?.message.url}/>
                            : `“ ${repliedMessage_?.message} ”`
                    }</div>
                    <div className={'info'}>{
                        `${sender_}, ${new Date(repliedMessage_?.date).toLocaleString().slice(0,-3)}`
                    }</div>
                </div>
                    </div>
                    :
                <div className={'replied-message-container'}>
                    <div className={'replied-icon'}><i className="fa fa-reply"></i></div>
                    <div className={'replied-message'}>
                        <div className={'message'}>{
                            repliedMessage?.message.url
                                ? <img className={'img-message'} style={{
                                    width: '100px'
                                }} src={repliedMessage.message.url} alt={repliedMessage?.message.url}/>
                                : `“ ${repliedMessage.message} ”`
                        }</div>
                        <div className={'info'}>{info}</div>
                    </div>
                    <div className={'cancel-button'} onClick={() => setReplyMode(false)}>
                        <FontAwesomeIcon icon={faXmark} /></div>
                </div>



    );
}

export default RepliedMessageContainer;