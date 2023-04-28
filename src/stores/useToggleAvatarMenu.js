import {create} from 'zustand'

const useToggleAvatarMenu = create((set) => ({
    avatarMenu: false,
    setAvatarMenu: (x) => {
        set(() => ({
            avatarMenu: x
        }))
    }
}));

export default useToggleAvatarMenu;
