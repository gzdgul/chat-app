import React from 'react';
import useSelectMessage from "../stores/useSelectMessage";

function FilteredMessages({message, input}) {
    const setSelectedMessage = useSelectMessage(state => state.setSelectedMessage);


    const parts = [];
    let i = 0;

    while (i < message.length) {
        const selamIndex = message.indexOf(input, i);
        if (selamIndex === -1) {
            parts.push(message.substring(i));
            break;
        }
        parts.push(message.substring(i, selamIndex));
        parts.push(
            <span style={{ color: 'red' }}>{message.substring(selamIndex, selamIndex + input.length)}</span>
        );
        i = selamIndex + input.length;
    }

    const handleClick = (e) => {
        alert(e.target.innerText)
        setSelectedMessage(e.target.innerText)
    }

    return (
        <div className={'filtered-message'} onClick={handleClick}>
            <div>{parts}</div>
        </div>
    );
}

export default FilteredMessages;