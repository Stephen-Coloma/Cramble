export type User = {
    userId: number; // auto_increment, so it's optional when creating a new user
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    avatarUrl: Buffer; // blob type corresponds to Buffer in Node.js
    createdAt: string; // timestamp, can be string in ISO format 
    lastLogin: string; // timestamp, can be string in ISO format
    status: string;
};