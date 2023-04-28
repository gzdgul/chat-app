import {create} from 'zustand'

const useSelectAvatar = create((set) => ({
    avatarLink: null,
    setAvatarLink: (x) => {
        set(() => ({
            avatarLink: x
        }))
    }
}));

export default useSelectAvatar;
