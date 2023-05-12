import {create} from 'zustand'

const useFileProgress = create((set) => ({
    fileProgress: null,
    setFileProgress: (x) => {
        set(() => ({
            fileProgress: x
        }))
        if (x === 100) {
            setTimeout(() => {
                set(() => ({
                    fileProgress: 0
                }))
            },1500)
        }
    }
}));

export default useFileProgress;
