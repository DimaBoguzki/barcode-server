const fs = require("fs");

class Log {
    constructor(){
        this.dir="./Logs";
        this.fullPath=this.dir+"/";
        if(!fs.existsSync(this.dir)){
            try{
                fs.mkdirSync(this.dir);
            } catch(err){
                throw err;
            }
        }
    }
}
class ErrorLog extends Log{
    constructor(){
        super();
        this.loger=null;
        this.fileName="errorLogs.log";
        try{
            this.loger = fs.createWriteStream(this.fullPath+this.fileName, {flags: "a"});
        } catch(err) {
            throw err
        }
    }
    writeErrorLog(title,data) {
        try{
            let date = new Date();
            let txt = date.toUTCString()+"\n" + "##### "+title+" #####\n"+data+"\n\n\n";
            this.loger.write(txt);
        } catch(err) {
            console.log(err);
        }
    }
}
class Logs extends Log{
    constructor(){
        super();
        this.loger=null;
        this.fileName="logs.log";
        try{
            this.loger = fs.createWriteStream(this.fullPath+this.fileName, {flags: "a"});
        } catch(err) {
            throw err
        }
    }
    writeLog(title,data) {
        try{
            let date = new Date();
            let txt = date.toUTCString()+"\n" + "##### "+title+" #####\n"+data+"\n\n\n";
            this.loger.write(txt);
        } catch(err) {
            console.log(err);
        }
    }
}

const errorLogs = new ErrorLog();
const logs = new Logs();
module.exports = {errorLogs, logs};