import {create} from 'zustand'

const usePrevMessageSendedDay = create((set) => ({
    prevMessageSendedDay: null,
     setPrevMessageSendedDay: (x) => {

        set(() => ({
            prevMessageSendedDay: x
        }))
    }
}));

export default usePrevMessageSendedDay;
