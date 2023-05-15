import React, {useEffect, useState} from 'react';
import '../CSS/replied-message.css';
import useToggleReplyMode from "../stores/useToggleReplyMode";
import useSelectUser from "../stores/useSelectUser";

function RepliedMessageContainer({currentUser}) {
    const selectedUser = useSelectUser(state => state.user);
    const setReplyMode = useToggleReplyMode(state => state.setReplyMode);
    const repliedMessage = useToggleReplyMode(state => state.repliedMessage);
    const [sender, setSender] = useState()
    const [message, setMessage] = useState()
   useEffect(() => {
       if (repliedMessage.sender === 'me') {
           setSender(currentUser.displayName)
           console.log(repliedMessage.sender)
       }
       else
           setSender(selectedUser.displayName)

       // if (repliedMessage.message.includes('http')) {
       //     setMessage()
       // }
   },[repliedMessage])

    const info = `${sender}, ${new Date(repliedMessage.date).toLocaleString().slice(0,-3)}`

    return (
        <div className={'replied-message-container'}>
            <div className={'replied-icon'}><i className="fa fa-reply"></i></div>
            <div className={'replied-message'}>
                <div className={'message'}>{
                    repliedMessage.message.includes('http')
                        ? <img style={{
                            width: '250px'
                        }} src={repliedMessage.message} alt={repliedMessage.message}/>
                        : `“ ${repliedMessage.message} ”`
                }</div>
                <div className={'info'}>{info}</div>
            </div>
            <div className={'cancel-button'} onClick={() => setReplyMode(false)}>✖</div>
        </div>
    );
}

export default RepliedMessageContainer;