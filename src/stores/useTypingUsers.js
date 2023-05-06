import {create} from 'zustand'

const useTypingUsers = create((set) => ({
    typingUsers: [],
    setTypingUsers: (x) => {
        set((state) => ({
            typingUsers: [...state.typingUsers.filter((y) => y.typerID !== x.typerID),{
                typerID: x.typerID,
                status: x.status
            }]
        }))
    }
}));

export default useTypingUsers;
