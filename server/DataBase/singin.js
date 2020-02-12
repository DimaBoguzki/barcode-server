const DB = require('./db');
const bcrypt = require("bcryptjs");
const {errorLogs,logs} = require('../log');

class SingIn{
    /**
     * 
     * @param {user supervisor from login app} user 
     * @param {password supervisor from login app} pass 
     * @param {call back with dataq object} callBack 
     */
    checkUser(user, pass, callBack){
        let sql = "select * from supervisor where user = '"+user+"';";
        DB.query(sql,(error, results)=>{
            if(error){
              errorLogs.writeErrorLog("LogIn",error);
              throw error;
            }
            if(results.length===0){
              logs.writeLog("LogIn","supervisor user : ("+user+") is not exist");
              return callBack(JSON.stringify({logIn:false,res:'user not exist',obj:null}));
            }
            else{
              bcrypt.compare(pass, results[0].password,(err, res) => {
                if(err){
                  errorLogs.writeErrorLog("LogIn",error);
                  throw error;
                }
                if(res){ // if password is valid
                  logs.writeLog("LogIn","supervisor "+results[0].first_name+" "+results[0].last_name+"connected");
                  let objServisor = {
                    id: results[0].id,
                    first_name: results[0].first_name,
                    last_name: results[0].last_name,
                    gender: results[0].gender
                  }
                  return callBack(JSON.stringify({logIn:true,res:'',obj:objServisor}));
                }
                else { // if password is ivalid
                  logs.writeLog("LogIn","supervisor ("+user+") password incorect");
                  return callBack(JSON.stringify({logIn:false,res:'password incorect',obj:null}));
                }
            });
          }
        });
    }
    newUser(objUser, callBack){
        let saltRound = 10;
        // hash password of supervisor
        bcrypt.hash(objUser.password, saltRound,(err, hash) => {
            if(err){
              errorLogs.writeErrorLog("SingUp",error);
              throw err;
            }
            let sql = "INSERT INTO supervisor" 
                +"(id_supervisor,first_name,last_name,phone,gender,user,password) "
                +`VALUES('${objUser.id_supervisor}','${objUser.first_name}','${objUser.last_name}',`
                +`'${objUser.phone}','${objUser.gender}','${objUser.user}','${hash}')`;
            DB.query(sql, (err,res)=>{
                const obj={};
                if(err){
                    errorLogs.writeErrorLog("SingUp",err);
                    obj.set=false;
                    obj.msgError=err.sqlMessage;
                    return callBack(obj);
                };
                obj.set=true;
                obj.msgError="";
                logs.writeLog("New supervisor",objUser.first_name+" "+objUser.last_name);
                return callBack(obj);
            })
        });
    }
}
module.exports = SingIn;