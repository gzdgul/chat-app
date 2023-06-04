import React, {useEffect, useState} from 'react';
import MessageOptions from "./messageOptions";
import RepliedMessageContainer from "./repliedMessageContainer";
import usePhScreenSize from "../stores/usePhScreenSize";
// import useToggleReplyMode from "../stores/useToggleReplyMode";
import { LazyLoadImage, trackWindowScroll  } from "react-lazy-load-image-component";




function Messages({message, date, sender, repliedStatus, repliedMessageKey, currentMessageKey}) {
    // const setRepliedMessage = useToggleReplyMode(state => state.setRepliedMessage);
    const dateObj = new Date(date);
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const formattedHour = (hour < 10 ? "0" : "") + hour;
    const formattedMinute = (minute < 10 ? "0" : "") + minute;
    const time = [formattedHour,' : ', formattedMinute]
    const [showOptions, setShowOptions] = useState(false)
    const [isPressing, setIsPressing] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const phScreen = usePhScreenSize(state => state.phScreen);


    useEffect(() => {
        let pressTimer;
        const startPress = () => {
            pressTimer = setTimeout(() => {
                setShowOptions(true)
            }, 800); // 800 milisaniye basılı tutma süresi
        };

        const endPress = () => {
            clearTimeout(pressTimer);
            setShowOptions(false)
        };

        if (isPressing) {
            startPress();
        } else {
            endPress();
        }

        return () => {
            endPress();
        };
    }, [isPressing]);
    const handleClick = (e) => {
        setShowOptions(!showOptions)
        console.log(currentMessageKey)
        console.log(message)
    }


    return (
        <div>
            {(sender === 'me') &&
                <div className={'chat-right'} onMouseLeave={() => {
                    // phScreen
                    //     ? setIsPressing(false) :
                         setShowOptions(false)
                }}>
                    <MessageOptions show={showOptions} setShow={setShowOptions} sender={sender} message={message} date={date} currentMessageKey={currentMessageKey} />
                    <div className={'testt'}>
                        { repliedStatus &&
                            <RepliedMessageContainer repliedStatus={repliedStatus} repliedMessageKey={repliedMessageKey}/>
                        }
                        <div className={`chat-bubble${message.length < 25 ? '' : '-long'} ${showOptions ? 'selected-message' : ''}`}
                             onClick={handleClick}
                             // onMouseDown={phScreen ? () => setIsPressing(true) : handleClick }
                             // onMouseUp={ !showOptions ?
                             //     () => setIsPressing(false) : null
                             // }

                        >
                            { (message.url)
                                ? <LazyLoadImage className={'img-message'}
                                                 src={message.url}
                                                 // key={message.placeholderUrl}
                                                 // placeholderSrc={message.placeholderUrl}
                                                 // alt={message.placeholderUrl}
                                                 // afterLoad={() => {setLoaded(true)}}
                                                 // effect={!loaded && 'blur'}
                                                 width={message.width} height={message.height}

                                />
                                : message
                            }
                            <span className={'message-date'}>{time}</span>
                        </div>

                    </div>
                </div>
            }
            {(sender === 'friend') &&
                <div className={'chat-left'} onMouseLeave={() => {
                    setShowOptions(false)
                    console.log(false)
                }}>
                    <MessageOptions show={showOptions} setShow={setShowOptions} sender={sender} message={message} date={date} currentMessageKey={currentMessageKey} />
                    <div className={'testt'}>
                        { repliedStatus &&
                            <RepliedMessageContainer repliedStatus={repliedStatus} repliedMessageKey={repliedMessageKey}/>
                        }
                        <div className={`chat-bubble${message.length < 25 ? '' : '-long'} ${showOptions ? 'selected-message' : ''}`}
                             onClick={handleClick}
                        >
                            {(message.url)
                                ? <LazyLoadImage className={'img-message'}
                                                src={message.url}
                                                width={message.width} height={message.height}
                                                // afterLoad={() => {setLoaded(true)}}
                                                // effect={!loaded && 'blur'}
                                    // placeholderSrc={message.url}
                                />
                                : message
                            }
                            <span className={'message-date'}>{time}</span>
                    </div>
                    </div>
                </div>
            }
            { (sender === 'oto') &&
                <div className={'chat-left'}>

                    <div className={'chat-bubble-long'}>
                        { (message === '1')
                            ? 'Merhaba! Katcha\'ya hoş geldiniz. Katcha, arkadaşlarınızla, ailenizle veya iş arkadaşlarınızla anında bağlantı kurmanızı sağlayan harika bir chat uygulamasıdır. Katcha\'nın kullanımı çok kolay ve anlaşılır bir arayüze sahip. Sol taraftaki arama çubuğunu kullanarak anında mesajlaşmaya başlayabilirsiniz.   '
                            : ' Bir sohbet başlatmak için lütfen sol taraftaki arama çubuğunu kullanın.'
                        }
                        <span className={'message-date'}>{time}</span></div>
                </div>
            }
        </div>
    );
}

export default  Messages ;