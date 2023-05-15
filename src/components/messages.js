import React, {useState} from 'react';
import MessageOptions from "./messageOptions";


function Messages({message, date, sender}) {
    const dateObj = new Date(date);
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const formattedHour = (hour < 10 ? "0" : "") + hour;
    const formattedMinute = (minute < 10 ? "0" : "") + minute;
    const time = [formattedHour,' : ', formattedMinute]
    const [showOptions, setShowOptions] = useState(false)


    const handleClick = () => {
        setShowOptions(!showOptions)
        console.log(true)
    }

    return (
        <div>
            {(sender === 'me') &&
                <div className={'chat-right'} onMouseLeave={() => {
                    setShowOptions(false)
                    console.log(false)
                }}>
                    <MessageOptions show={showOptions} setShow={setShowOptions} sender={sender} />
                    <div className={'testt'}>
                        <div className={`chat-bubble${message.length < 25 ? '' : '-long'} ${showOptions ? 'selected-message' : ''}`}
                             onClick={handleClick}
                        >
                            {message.includes('http') && message.includes('firebase')
                                ? <img src={message} alt={message}/>
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
                    <MessageOptions show={showOptions} setShow={setShowOptions} sender={sender}/>
                    <div className={'testt'}>
                        <div className={`chat-bubble${message.length < 25 ? '' : '-long'} ${showOptions ? 'selected-message' : ''}`}
                             onClick={handleClick}
                        >
                            {message.includes('http') && message.includes('firebase')
                                ? <img src={message} alt={message}/>
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

export default Messages;