import React, {useEffect, useState} from 'react';
import {getLatestMessages} from "../firebase";
import useLatestMessage from "../stores/useLatestMessage";

function LatestMessages({UID}) {
    const [latestMessage, setLatestMessage] = useState(null);

    useEffect(() => {
        getLatestMessages()
            .then((res) => {
                setLatestMessage(res.find(x => x.recieverID === UID)?.message)
            });
    }, [])

    return (
        <div>
            {latestMessage}
        </div>
    );
}

export default LatestMessages;