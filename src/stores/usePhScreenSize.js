import {create} from 'zustand'

const usePhScreenSize = create((set) => ({
    phScreen: false,
    setPhScreen: (x) => {
        set(() => ({
            phScreen: x
        }))
    }
}));

export default usePhScreenSize;
