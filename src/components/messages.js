import React, {useEffect, useState} from 'react';
import useLatestMessage from "../stores/useLatestMessage";
import usePrevMessageSendedDay from "../stores/usePrevMessageSendedDay";

function Messages({message, date, sender}) {
    const prevMessageSendedDay_ = usePrevMessageSendedDay(state => state.prevMessageSendedDay);
    const setPrevMessageSendedDay_ = usePrevMessageSendedDay(state => state.setPrevMessageSendedDay);
    const dateObj = new Date(date);
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const formattedHour = (hour < 10 ? "0" : "") + hour;
    const formattedMinute = (minute < 10 ? "0" : "") + minute;
    const time = [formattedHour,' : ', formattedMinute]
    const [dateBar, setDateBar] = useState(false)
    const [prevMessageSendedDay, setPrevMessageSendedDay] = useState(null)
    // const [messageSendedDay, setMessageSendedDay] = useState(null)


    /*
           { dateBar &&
                <div className={'date-bar'}>fgfdg</div>
            }

     */

    return (
        <div>
            { (sender === 'me') &&
                <div className={'chat-right'}>
                    <div className={(message.length < 25) ? 'chat-bubble' : 'chat-bubble-long'}>{message} <span className={'message-date'}>{time}</span></div>
                    <svg className={'svg-right'} width="20" height="20">
                        <path className={'tail'} d="M 2,18
                                                   L 2,2
                                                   L 18,18
                                                   L 2,18
                                                   z"
                              fill="#3d3d3d"/>
                    </svg>
            </div>
            }
            { (sender === 'friend') &&
                <div className={'chat-left'}>
                    <svg className={'svg-left'} width="20" height="20">
                        <path className={'tail'} d="M 2,18
                                       L 2,2
                                       L 18,18
                                       L 2,18
                                       z"
                              transform="rotate(270 10 10)"
                              fill="#ef3933" />
                    </svg>
                <div className={(message.length < 25) ? 'chat-bubble' : 'chat-bubble-long'}>{message} <span className={'message-date'}>{time}</span></div>
            </div>
            }
        </div>
    );
}

export default Messages;