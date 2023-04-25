import {create} from 'zustand'

const useLatestMessage = create((set) => ({
    UID: null,
    message: null,
    setMessage: (userID,message) => {
        set(() => ({
            UID: userID,
            message: message
        }))
    }
}));

export default useLatestMessage;
