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
            connections_: [x, ...state.connections_]
        }))
    },
    sortConnections: (x) => {
        set((state) => ({
            connections_: [x, ...(state.connections_.filter(y => y !== x))]
        }))
    }
}));

export default useConnections;
