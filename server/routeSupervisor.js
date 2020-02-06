const express = require('express');
const SingIn = require('./DataBase/singin');
const db = new SingIn();

const routeSupervisor = express.Router();

routeSupervisor.post('/login', (req, res)=>{
    db.checkUser(req.body.user,req.body.password,(data)=>{
        res.send(JSON.parse(data));
    })
});
routeSupervisor.post('/register',(req, res)=>{
    db.newUser(req.body,(data)=>{
        // data obj ---> {set:boolean,msgError:string}
        if(data.set){
            res.send("המשגיח נשמר בכהתלחה");
        }
        else res.send(data.msgError);
    })
});

module.exports = routeSupervisor;