import { User } from './User' 

export type UserSignUp = Pick<User, 'firstName' | 'lastName' | 'username' | 'password' | 'email'>;