import { User } from "@/dtos/user/User";
import { create } from "zustand"
import axios from "axios";
import { AxiosResponse } from "axios";

export type UserDetails =  Pick<User, 'firstName' | 'lastName' | 'username' | 'email'> 

type UserStore = {
    user: UserDetails | null;
    getUserDetailsAsync: () => Promise<void>,
    setUser: (user: UserDetails) => void;
}

export const useUserStore = create<UserStore>((set, )=> ({
    user:  null,
    getUserDetailsAsync: async () => {
      const SERVER_HOST = process.env.NEXT_PUBLIC_SERVER_HOST;
      const url = `http://${SERVER_HOST}/api/extras/user/details`;
      try {
        const response: AxiosResponse = await axios.get(url, {withCredentials: true});
        if(response.status === 200){
          set({user: response.data})
        }
      } catch (err: unknown) {
        set({user: null})
      }
    },
    setUser: (user: UserDetails) => set({user: user}),
}));