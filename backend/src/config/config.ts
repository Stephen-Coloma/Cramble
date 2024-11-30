import env from 'dotenv'

//parsing from environment file
env.config();

//server environment variables
const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SERVER_PORT =  parseInt(process.env.SERVER_PORT || '3000');

//database environment variables
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'cramble_db';
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';

//miscellaneous environment variables
const COOKIE_PARSER_SECRET_KEY = process.env.COOKIE_PARSER_SECRET_KEY || undefined;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const NODE_ENV = process.env.NODE_ENV;


//server configuration
const server = {
    host: SERVER_HOST,
    port: SERVER_PORT
}

//database configuration
const database = {
    host: MYSQL_HOST,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD
}

//miscellaneous configuration
const misc = {
    cookieParserKey: COOKIE_PARSER_SECRET_KEY,
    jwtSecretKet: JWT_SECRET_KEY,
    nodeEnvirontment: NODE_ENV
}

const config = {
    server: server,
    database: database,
    misc: misc
}

export default config;