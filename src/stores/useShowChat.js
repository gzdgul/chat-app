import {create} from 'zustand'

const useShowChat = create((set) => ({
    showChat: false,
    setShowChat: (x) => {
        set(() => ({
            showChat: x
        }))
    }
}));

export default useShowChat;
