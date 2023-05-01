import React, {useEffect, useRef, useState} from 'react';
import FilteredMessages from "./filteredMessages";

function SearchMessageContainer({showSrc, setShowSrc, chat, user}) {
    const [searching, setSearching] = useState(false)
    const [messageSearchInput, setMessageSearchInput] = useState('')
    const [filteredMessages, setFilteredMessages] = useState('')
    const SearchContainerRef = useRef(null);


    useEffect(() => {
        if (showSrc) {
            SearchContainerRef.current?.classList.add('showSrc');
        } else {
            SearchContainerRef.current?.classList.remove('showSrc');
        }
    }, [showSrc]);

    console.log('filteredMessages',filteredMessages)



    const handleSearchSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <>
            {

                <div className={'chat-user-search-container'} ref={SearchContainerRef}>
                    <div className={'header-user-info'}>
                        <p>Mesajlarda Ara</p>
                        <button className={'cancel-button'} onClick={() => setShowSrc(!showSrc)}>✖</button>
                    </div>
                    <div className={'search'}>
                        <div className={'search-bar'}>
                            <div className={'search-icon'}><i className="fa fa-search"></i></div>
                            <form className={'search-form'} onSubmit={handleSearchSubmit}>
                                <input className={'message-search-input'} type="text"
                                       placeholder={'Mesajlarda Aratın'}
                                       onChange={(e) => {
                                           (e.target.value.length > 0) ? setSearching(true) : setSearching(false)
                                           setMessageSearchInput(e.target.value)
                                           setFilteredMessages(chat.filter((x) => x.message.includes(e.target.value)))
                                       }}
                                />
                            </form>
                        </div>
                    </div>
                    <div className={'filtered-message-container'}>

                        { searching &&
                            filteredMessages?.map((x) => {
                               return <FilteredMessages message={x.message} input={messageSearchInput}/>
                            })
                        }



                    </div>
                </div>
            }
        </>
    );
}

export default SearchMessageContainer;