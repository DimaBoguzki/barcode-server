require('dotenv/config');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_MYSQL,
    password: process.env.PASSWORD_MYSQL,
    database: process.env.DB
  });
  con.connect((err)=>{
    if (err) throw err;
    console.log("Connected MYSQL!: host "+process.env.HOST);
  });

  let saltRound = 10;
  let password = '12345678';
  let id_user = '999999999'

  bcrypt.hash(password, saltRound,(err, hash) => {
      if(!err){
        let sql = "UPDATE supervisor SET password='"+hash+"' WHERE id_supervisor='"+id_user+"';";
        con.query(sql,(error, results,field)=>{
            if (error) throw error;
            console.log("updated!");
        });
      }
      else{
          console.log('Error: ',err)
      }

  });