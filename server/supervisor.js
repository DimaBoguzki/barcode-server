require('dotenv/config');
const express = require('express');
const SingIn = require('./DataBase/singin');
db = new SingIn();

const routeSupervisor = express.Router();

routeSupervisor.post('/login', function(req, res){
    db.checkUser(req.body.user,req.body.password,(data)=>{
        res.send(JSON.parse(data));
    })
});
routeSupervisor.post('/register', function(req, res){
    db.newUser(req.body,(data)=>{
        // data boolean, true is succsess and dalse not
        res.send(data);
    })
});

module.exports = routeSupervisor;