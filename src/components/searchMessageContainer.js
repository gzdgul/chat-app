import React, {useEffect, useRef} from 'react';

function SearchMessageContainer({showSrc, setShowSrc, user}) {
    const SearchContainerRef = useRef(null);

    useEffect(() => {
        if (showSrc) {
            SearchContainerRef.current?.classList.add('showSrc');
        } else {
            SearchContainerRef.current?.classList.remove('showSrc');
        }
    }, [showSrc]);
    return (
        <>
            {
                <div className={'chat-user-search-container'} ref={SearchContainerRef}>
                   search message container
                </div>
            }
        </>
    );
}

export default SearchMessageContainer;