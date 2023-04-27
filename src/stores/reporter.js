import {create} from 'zustand'

const reporter = create((set) => ({
    reporter: 0,
    setReporter: () => {
        set((state) => ({
            reporter: state.reporter + 1
        }))
    }
}));
export default reporter;
