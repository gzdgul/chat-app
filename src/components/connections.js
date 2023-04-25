import React, {useEffect, useState} from 'react';
import '../CSS/connection.css';
import useSelectUser from "../stores/useSelectUser";
import { getUserData } from "../firebase";
import useConnections from "../stores/useConnections";
import LatestMessages from "./latestMessages";

function Connections({userId}) {
    const [userDetail, setUserDetail] = useState(null);
    const connections = useConnections(state => state.connections_)
    const setConnections = useConnections(state => state.setConnections)
    const setUser = useSelectUser(state => state.setUser);

    useEffect(() => {
        getUserData(userId).then((res) => { // current user ın connections arrayindeki her bir UID nin full datası
            setUserDetail(res);
        })

    }, [])

    const handleClick = () => {
        setUser(userDetail);
    }

    if (!userDetail) return null;

    return (
        <div id={userDetail.userID} onClick={handleClick}>
            <div className={'connectionBanner'}>
                <div className={'connection-photo'}></div>
                <div className={'connection-info'}>
                    <div className={'connection-title'}>{userDetail.displayName}</div>
                    <div className={'connection-index'}>
                        {<LatestMessages UID = {userDetail.userID}/>}</div>
                </div>
                <div className={'connection-date'}>13:46</div>
            </div>
        </div>
    );
}

export default Connections;