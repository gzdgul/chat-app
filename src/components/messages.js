import React, {useEffect, useState} from 'react';


function Messages({message, date, sender}) {
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
            { (sender === 'oto') &&
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