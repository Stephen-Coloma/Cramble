import axios, { AxiosResponse } from "axios";
import { User } from "@/dtos/user/User";

export type UserDetails = Pick<User, "firstName" | "lastName" | "username" | "email">;

async function getUserDetailss(): Promise<UserDetails> {
  const SERVER_HOST = process.env.NEXT_PUBLIC_SERVER_HOST;
  const url = `http://${SERVER_HOST}/api/extras/user/details`;

  try {
    const response: AxiosResponse<UserDetails> = await axios.get(url, {
      withCredentials: true,
    });

    const {firstName, lastName, username, email } = response.data;
    return {firstName, lastName, username, email};
  } catch (error: unknown) {
    console.error("Error fetching user details:", error);
    throw error;
  }
}

export const userDetails: UserDetails = await getUserDetailss();
