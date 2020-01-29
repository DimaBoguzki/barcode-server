const mysql = require('mysql');

class DB {
    constructor(){
        this.con = mysql.createConnection({
            host: process.env.HOST_MYSQL,
            user: process.env.USER_MYSQL,
            password: process.env.PASSWORD_MYSQL,
            database: process.env.DB
          });
          this.con.connect((err)=>{
            if (err) throw err;
            console.log("Connected!");
          });
    }
}
module.exports = DB;