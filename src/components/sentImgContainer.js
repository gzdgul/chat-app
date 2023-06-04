import React, {useEffect, useState} from 'react';
// import {listImages} from "../firebase";

function SentImgContainer({user}) {
    // const [imgList, setImgList] = useState([])
    //
    // useEffect(() => {
    //     (user) && listImages(user.userID)
    //         .then((x) => {
    //             // console.log('TESTTTTTTTT',x)
    //             setImgList(x)
    //         })
    //
    // },[user])


    return (
        // imgList.length > 0
        //     ? imgList.reverse().slice(0,6).map((x,i) => {
        //         return <div className={'user-info-media'} key={'user-info-media' + i} ><img src={x} alt={x} /></div>
        //     })
        //     : <div className={'noImage'}> No images found </div>
        <div className={'noImage'}> No images found </div>

    );
}

export default SentImgContainer;