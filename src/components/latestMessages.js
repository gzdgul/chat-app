import React, {useEffect, useState} from 'react';
import {getLatestMessages} from "../firebase";
import reporter from "../stores/reporter";
import useConnections from "../stores/useConnections";

function LatestMessages({UID, place, createNotification}) {
    const [contact, setContact, ] = useState({
        message_: null,
        date_: null
    });
    const [LatestConnection_,setLatestConnection_] = useState(null)
    const sortConnectionsList = useConnections(state => state.sortConnections);
    const setConnectionsList = useConnections(state => state.setConnections);
    const reporterBird = reporter(state => state.reporter); //HABERCİ KUŞ



    useEffect(() => {
        getLatestMessages()
            .then((res) => {
                res = res.sort((a,b) => {
                    const a_date = new Date(a.date);
                    const b_date = new Date(b.date);
                    return b_date - a_date;
                })
                const LatestConnection = res[0]

                setLatestConnection_(LatestConnection)
                createNotification(LatestConnection)
                setConnectionsList(res.map(x => x.recieverID))
                console.log('----------TEST----------------')

                const ConnectionLatest = res.find(x => x.recieverID === UID)
                const dateObj = new Date(ConnectionLatest.date);
                const hour = dateObj.getHours();
                const minute = dateObj.getMinutes();
                const formattedHour = (hour < 10 ? "0" : "") + hour;
                const formattedMinute = (minute < 10 ? "0" : "") + minute;
                const time = [formattedHour,' : ', formattedMinute]

                setContact({
                    message_: ConnectionLatest.message?.slice(0,30),
                    date_: time
                })
            });
    }, [reporterBird])

    return (
        <div>
            { (place === 'index') &&
                contact.message_
            }
            { (place === 'date') &&
                contact.date_
            }
        </div>
    );
}

export default LatestMessages;