import { User } from "@/dtos/user/User";
import { create } from "zustand"
import { persist } from 'zustand/middleware'
import axios from "axios";
import { AxiosResponse } from "axios";

export type UserDetails =  Pick<User, 'firstName' | 'lastName' | 'username' | 'email'> 

type UserStoreState = {
  user: UserDetails;
}
  
type UserStoreAction = {
  initializeUserDetails: () => Promise<void>,
  setUser: (user: UserDetails) => void;
}

type UserStore = UserStoreState & UserStoreAction;

export const useUserStore = create<UserStore>()(
  persist((set)=>({ // zustand persist stores data to localstorage
      user: {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
      },

      initializeUserDetails: async () => {
        const SERVER_HOST = process.env.NEXT_PUBLIC_SERVER_HOST;
        const url = `http://${SERVER_HOST}/api/extras/user/details`;
        try {
          const response: AxiosResponse = await axios.get(url, {withCredentials: true});
          if (response.status === 200) {
            const { firstName, lastName, username, email} = response.data;
            set({user: {firstName, lastName, username, email}})
            return;
          }
        } catch (err: unknown) {
          console.log(err);
          throw err as Error;
        }
      },

      setUser: (user: UserDetails) => {user}
    }), 
    { name: "user-details",
      partialize: (state) => ({user: state.user}) // Persist only `user`
    },
  )
)