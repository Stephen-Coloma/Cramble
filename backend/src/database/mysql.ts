import config from "../config/config"
import mysql from 'mysql'

//database params
const params = {
    host: config.database.host,
    database: config.database.database,
    user:  config.database.user,
    password: config.database.password,
}

export default class Database{
    //make constructor private to prevent instantiation
    private constructor(){};

    static pool = mysql.createPool({
        host: params.host,
        database: params.database,
        user: params.user,
        password: params.password,
        connectionLimit: 10, //default, maximum of connection to create at once
        queueLimit: 0 //default 0, no limit
    })

    /**This method, when called, returns a promise of type PoolConnection
     * PoolConnection is a subclass of mysql.Connection
     * Since it is a promise, we can either resolce or reject it depending on the success of the code inside the callback
     * Inside the callback, there is another callback which gets a connection in the pool created above. 
     * It resolves the callback on the parent by giving PoolConnection object, when there is a free connection in the pool
     * It rejects the callback on the parent by giving mysql error. 
     * 
     * new Promise<mysql.PoolConnection>((resolve, reject) --> resolve expects a return type PoolConnection
     * new Promise<mysql.PoolConnection>((resolve, reject) --> reject expects return of type any
     * 
     * this.pool.getConnection --> needs a callback which params is MysqlError and PoolConnection
     */
    static async Connect(): Promise<mysql.PoolConnection>{
        return new Promise<mysql.PoolConnection>((resolve, reject) =>{
            this.pool.getConnection((err, connection)=>{
                if(err){
                    reject(err)
                }
                console.log('Database connected successfully');
                resolve(connection)
            });
        }) 
    }

    
}
