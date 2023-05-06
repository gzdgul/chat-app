import React, {useEffect} from 'react';
import useSelectMessage from "../stores/useSelectMessage";

function FilteredMessages({messageObj, input}) {
    const setSelectedMessage = useSelectMessage(state => state.setSelectedMessage);
    const message = messageObj.message
    const date = new Date(messageObj.date).toLocaleDateString()
    const parts = [];
    let i = 0;

    while (i < message.length) {
        const Index = message.indexOf(input, i);
        if (Index === -1) {
            parts.push(message.substring(i));
            break;
        }
        parts.push(message.substring(i, Index));
        parts.push(
            <span style={{ color: 'var(--pink)' }}>{message.substring(Index, Index + input.length)}</span>
        );
        i = Index + input.length;
    }

    const handleClick = (e) => {
        // alert(e.target.innerText)
        setSelectedMessage(e.target.textContent)
    }

    return (
        <div className={'filtered-message'} onClick={handleClick}>
            <div className={'message'}>{parts}</div>
            <div className={'date'}>{date}</div>
        </div>
    );
}

export default FilteredMessages;