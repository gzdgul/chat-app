import React, {useEffect, useState} from 'react';
import {getLatestMessages} from "../firebase";
import reporter from "../stores/reporter";
import useConnections from "../stores/useConnections";

function LatestMessages({UID, place, createNotification}) {
    const [contact, setContact, ] = useState({
        message_: null,
        date_: null
    });
    const [LatestConnection_,setLatestConnection_] = useState({})
    const sortConnectionsList = useConnections(state => state.sortConnections); //HABERCİ KUŞ
    const reporterBird = reporter(state => state.reporter); //HABERCİ KUŞ


    useEffect(() => {
        getLatestMessages()
            .then((res) => {
                let arr = [];
                res.forEach((x) => {
                    const dateObj = new Date(x.date);
                    arr.push(dateObj)
                })
                arr.sort((a,b) => b-a)

                const LatestConnection = res.find(x => new Date(x.date).getTime() === arr[0].getTime())
                setLatestConnection_(LatestConnection)
                createNotification(LatestConnection)
                console.log('LatestConnection',LatestConnection)
                sortConnectionsList(LatestConnection.recieverID)

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