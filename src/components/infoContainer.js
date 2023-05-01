import React, {useEffect, useRef} from 'react';

function InfoContainer({showInf, setShowInf, user}) {
    const infoContainerRef = useRef(null);

    useEffect(() => {
        if (showInf) {
            infoContainerRef.current?.classList.add('showInf');
        } else {
            infoContainerRef.current?.classList.remove('showInf');
        }
    }, [showInf]);
    return (
        <>
            {
                <div className={'chat-user-info-container'} ref={infoContainerRef}>
                    <div className={'header-user-info'}>
                        <p>Kişi Bilgisi</p>
                        <button className={'cancel-button'} onClick={() => setShowInf(!showInf)}>✖</button>

                    </div>
                    <div className={'user-photo-index'}>
                        <div className={'user-photo-xl'}><img src={user?.avatarLink} alt=""/></div>
                        <p className={'user-info-name'}>{user?.displayName}</p>
                        <p className={'user-info-mail'}>{user?.email}</p>
                    </div>
                    <div className={'user-info-media-container'}>
                        <div className={'user-info-media-header'}>
                            <p>Medyalar, bağlantılar ve belgeler</p>
                            <div className={'user-info-media-arrow'}>›</div>
                        </div>
                        <div className={'user-info-media-footer-container'}>
                            <div className={'user-info-media'}></div>
                            <div className={'user-info-media'}></div>
                            <div className={'user-info-media'}></div>
                            <div className={'user-info-media'}></div>
                            <div className={'user-info-media'}></div>
                            <div className={'user-info-media'}></div>
                        </div>

                    </div>
                    <div className={'user-info-action-container'}>
                        <div className={'user-info-star-message'}><div className={'star-icon'}></div> Yıldızlı Mesajlar</div>
                        <div className={'user-info-block'}> <div className={'block-icon'}></div> {user?.displayName} kişisini engelle</div>
                        <div className={'user-info-report'}> <div className={'report-icon'}></div> {user?.displayName} kişisini şikayet et</div>
                        <div className={'user-info-delete'}> <div className={'delete-icon'}></div> {user?.displayName} kişisini sil</div>
                        <div className={'user-info-delete-messages'}> <div className={'delete-messages-icon'}></div> Tüm mesajları sil</div>
                    </div>
                </div>
            }
        </>
    );
}

export default InfoContainer;