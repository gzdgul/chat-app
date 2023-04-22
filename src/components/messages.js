import React from 'react';

function Messages({message, sender}) {
    return (
        <div>
            { (sender === 'me') &&
                <div className={'chat-right'}>
                <div className={'chat-bubble'}>{message}</div>
            </div>
            }
            { (sender === 'friend') &&
                <div className={'chat-left'}>
                <div className={'chat-bubble'}>{message}</div>
            </div>
            }
        </div>
    );
}

export default Messages;