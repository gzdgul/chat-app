import {create} from 'zustand'

const useToggleReplyMode = create((set) => ({
    replyMode: false,
    repliedMessage: {
        message: null,
        date: null
    },
    messageKey: null,
    setReplyMode: (x) => {
        set(() => ({
            replyMode: x
        }))
    },
    setRepliedMessage: (message,date,sender) => {
        set(() => ({
            repliedMessage: {
                message: message,
                date: date,
                sender: sender
            }
        }))
    },
    setMessageKey: (x) => {
        set(() => ({
            messageKey: x
        }))
    },
}));

export default useToggleReplyMode;
