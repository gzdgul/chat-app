import React from 'react';


function Messages({message, date, sender}) {
    // if (message.includes('http')) {
    //     message = 'URL GELECEK'
    // }
    const dateObj = new Date(date);
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const formattedHour = (hour < 10 ? "0" : "") + hour;
    const formattedMinute = (minute < 10 ? "0" : "") + minute;
    const time = [formattedHour,' : ', formattedMinute]


    return (
        <div>
            { (sender === 'me') &&
                <div className={'chat-right'}>
                    <div className={(message.length < 25) ? 'chat-bubble' : 'chat-bubble-long'}>
                        { message.includes('http')
                            ? <img src={message} alt={message}/>
                            : message
                        }
                        <span className={'message-date'}>{time}</span></div>

            </div>
            }
            { (sender === 'friend') &&
                <div className={'chat-left'}>

                <div className={(message.length < 25) ? 'chat-bubble' : 'chat-bubble-long'}>
                    { message.includes('http')
                        ? <img src={message} alt={message}/>
                        : message
                    }
                    <span className={'message-date'}>{time}</span></div>
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