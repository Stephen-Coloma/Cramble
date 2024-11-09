import env from 'dotenv'

env.config();

//parsing from environment file
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT =  parseInt(process.env.SERVER_PORT || '3000');

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'quizdb';
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';


//server configuration
const server = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
}

//database configuration
const database = {
    host: MYSQL_HOST,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD
}

const config = {
    server: server,
    database: database
}

export default config;