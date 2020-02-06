const DB = require('./db');
const bcrypt = require("bcryptjs");

class SingIn extends DB{
    constructor(){
        super();
    }
    /**
     * 
     * @param {user supervisor from login app} user 
     * @param {password supervisor from login app} pass 
     * @param {call back with dataq object} callBack 
     */
    checkUser(user, pass, callBack){
        let sql = "select * from supervisor where user = '"+user+"';";
        this.con.query(sql,(error, results)=>{
            if(error){
              throw error;
            }
            if(results.length===0){
              return callBack(JSON.stringify({logIn:false,res:'user not exist',obj:null}));
            }
            else{
              bcrypt.compare(pass, results[0].password,(err, res) => {
                  console.log(res)
                if(err)
                    throw error;
                if(res){ // if password is valid
                  console.log('logIn is '+res)
                  let objServisor = {
                    id: results[0].id,
                    first_name: results[0].first_name,
                    last_name: results[0].last_name,
                    gender: results[0].gender
                  }
                  return callBack(JSON.stringify({logIn:true,res:'',obj:objServisor}));
                }
                else { // if password is ivalid
                  console.log('Error: ',err)
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
            if(err) throw err;
            let sql = "INSERT INTO supervisor" 
                +"(id_supervisor,first_name,last_name,phone,gender,user,password) "
                +`VALUES('${objUser.id_supervisor}','${objUser.first_name}','${objUser.last_name}',`
                +`'${objUser.phone}','${objUser.gender}','${objUser.user}','${hash}')`;
            this.con.query(sql, (err,res)=>{
                const obj={};
                if(err){
                    console.error(err);
                    obj.set=false;
                    obj.msgError=err.sqlMessage;
                    return callBack(obj);
                };
                obj.set=true;
                obj.msgError="";
                return callBack(obj);
            })
        });
    }
}
module.exports = SingIn;