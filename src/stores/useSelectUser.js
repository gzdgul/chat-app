import {create} from 'zustand'

const useSelectUser = create((set) => ({
  user: null,
  setUser: (x) => {
    set(() => ({
      user: x
    }))
  }
}));

export default useSelectUser;
