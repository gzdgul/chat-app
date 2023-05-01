import {create} from 'zustand'

const useSelectMessage = create((set) => ({
    selectedMessage: null,
    setSelectedMessage: (x) => {
        set(() => ({
            selectedMessage: x
        }))
    }
}));

export default useSelectMessage;
