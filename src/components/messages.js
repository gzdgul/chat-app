import React from 'react';

function Messages({message, sender}) {
    return (
        <div>
            { (sender === 'me') &&
                <div className={'chat-right'}>
                    <div className={'chat-bubble'}>{message}</div>
                    <svg className={'svg-right'} width="20" height="20">
                        <path className={'tail'} d="M 2,18
                                                   L 2,2
                                                   L 18,18
                                                   L 2,18
                                                   z"
                              fill="#3d3d3d"
                              stroke-width="1" />
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
                <div className={'chat-bubble'}>{message}</div>
            </div>
            }
        </div>
    );
}

export default Messages;