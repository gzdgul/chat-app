import {create} from 'zustand'

const useConnections = create((set) => ({
    connections_: [],
    setConnections: (x) => {
        set(() => ({
            connections_: [...x]
        }))
    },
    addConnection: (x) => {
        set((state) => ({
            connections_: [...state.connections_, x]
        }))
    }
}));

export default useConnections;
