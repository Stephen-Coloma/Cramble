import config from "../config/config"
import mysql from 'mysql'

//database params
const params = {
    host: config.database.host,
    database: config.database.database,
    user:  config.database.user,
    password: config.database.password,
}

class Database{
    private pool: mysql.Pool;

    private constructor(){
        this.pool = mysql.createPool({
            host: params.host,
            database: params.database,
            user: params.user,
            password: params.password,
            connectionLimit: 10, //default, maximum of connection to create at once
            queueLimit: 0 //default 0, no limit
        })
        
    };

    //singleton instance
    private static instance: Database;

    public static getInstance(): Database{
        if(!this.instance){
            Database.instance = new Database;
        }
        return Database.instance;
    }

    /**This method, when called, returns a promise of type PoolConnection. I made this a promise so that I can make use of then and catch and finally
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
    async connect(): Promise<mysql.PoolConnection>{
        return new Promise<mysql.PoolConnection>((resolve, reject) =>{
            this.pool.getConnection((err, connection)=>{
                if(err){
                    reject(err);
                    return;
                }
                console.log('Database connected successfully');
                resolve(connection);
            });
        }) 
    }

    /**This method accepts a connection of type PoolConnection and a query string.  I made this a promise so that I can make use of then and catch and finally
     * I pass in the query string to the connection.query method, and a callback will be used to determine if the query is successful or not.
     * further, when values[] is provided,it is a parameterized query. empty array will handle simple query
     * 
     * return type is any: not sure how to make the result set a return type
    */
    async processQuery(connection: mysql.PoolConnection, queryString: string, values: any[] = []): Promise<any> {
        //connection is a PoolConnection from the pool
        return new Promise((resolve, reject) =>{
            connection.query(queryString, values, (err, result) => {
                if(err){
                    reject(err);
                    return;
                }

                connection.release()
                resolve(result);
            });
        });
    } 
}//end of class

export const databaseInstance = Database.getInstance();