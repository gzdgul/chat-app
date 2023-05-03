import {create} from 'zustand'

const useNotificationList = create((set) => ({
    notificationList: [],
    setNotificationList: (x) => {
        set(() => ({
            notificationList: [...x]
        }))
    },
    addNotificationList: (x) => {
        set((state) => ({
            notificationList: [x, ...state?.notificationList.filter((y) => y !== x)]
        }))
    },
    removeNotificationList: (x) => {
        set((state) => ({
            notificationList: [...state?.notificationList.filter((y) => y !== x)]
        }))
    }
}));

export default useNotificationList;
