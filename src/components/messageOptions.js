import React, {useEffect, useRef, useState} from 'react';
import useToggleReplyMode from "../stores/useToggleReplyMode";

function MessageOptions({show, setShow, sender, message, date}) {
    const setRepliedMessage = useToggleReplyMode(state => state.setRepliedMessage);
    const setReplyMode = useToggleReplyMode(state => state.setReplyMode);
    const optionsRef = useRef(null)
    useEffect(() => {
        if (show) {
            optionsRef.current?.classList.add('showOpt');
        } else {
            optionsRef.current?.classList.remove('showOpt');
        }
    }, [show]);

    const handleReplyClick = () => {
        setReplyMode(true)
        setRepliedMessage(message,date,sender)
        console.log(message,date,sender)

    }
    //onMouseLeave={() => setShow(false)}
    return (
        <div className={`options-container ${sender}`}
             ref={optionsRef} >
            <ul >
                <li onClick={handleReplyClick}>Cevapla</li>
                <li>İlet</li>
                <li>Sil</li>
                <li>İfade Bırak</li>
            </ul>

        </div>
    );
}

export default MessageOptions;