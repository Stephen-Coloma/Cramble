export type UserSignUp = {
    user_id?: number; // auto_increment, so it's optional when creating a new user
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    email: string;
    avatar_blob?: Buffer; // blob type corresponds to Buffer in Node.js
    avatar_url?: Buffer; // blob type corresponds to Buffer in Node.js
    created_at?: string; // timestamp, can be string in ISO format 
    last_login?: string; // timestamp, can be string in ISO format
};