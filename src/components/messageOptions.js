import React, {useEffect, useRef} from 'react';

function MessageOptions({show, setShow, sender}) {
    const optionsRef = useRef(null)
    useEffect(() => {
        if (show) {
            optionsRef.current?.classList.add('showOpt');
        } else {
            optionsRef.current?.classList.remove('showOpt');
        }
    }, [show]);

    //onMouseLeave={() => setShow(false)}
    return (
        <div className={`options-container ${sender}`}
             ref={optionsRef} >
            <ul >
                <li>Cevapla</li>
                <li>İlet</li>
                <li>Sil</li>
                <li>İfade Bırak</li>
            </ul>

        </div>
    );
}

export default MessageOptions;