import { create } from 'zustand';

interface AuthStore {
  jwt: string; // jwt string türünde
  loader: boolean; // loader boolean türünde
  setLoader: (loader: boolean) => void; // setLoader boolean alır
  setJwt: (jwt: string) => void; // setJwt string alır
}

const useAuthStore = create<AuthStore>((set) => ({
  jwt: "",
  loader: false,
  setLoader: (loader: boolean) => set({ loader }),
  setJwt: (jwt: string) => set({ jwt }),
}));

export default useAuthStore;
