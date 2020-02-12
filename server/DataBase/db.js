const mysql = require('mysql');
const {errorLogs} = require('../log');
/**
 * MySql Conection....
 */

connection = mysql.createConnection({
    host: process.env.HOST_MYSQL,
    user: process.env.USER_MYSQL,
    password: process.env.PASSWORD_MYSQL,
    database: process.env.DB
});

connection.connect((err)=>{
  if (err){
    errorLogs.writeErrorLog("Error DataBase Connection: ",err);
    throw err;
  }
});

module.exports = connection;