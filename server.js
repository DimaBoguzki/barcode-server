require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const Nexmo = require('nexmo');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 5001;
const app = express();

app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));

// create commection of nexmo sms
const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET
})
// create connection of mysql
/*var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_MYSQL,
    password: process.env.PASSWORD_MYSQL,
    database: process.env.DB
  });
  con.connect((err)=>{
    if (err) throw err;
    console.log("Connected MYSQL!: host "+process.env.HOST);
  });*/
/**
 * reccive: string of id_student
 * send : if exist send objext with data of student, if not send null
 */
app.get('/test',(req,res)=>{
  res.send(JSON.stringify("Connected"));
})
app.post('/students', (req, res) => {
    let id = req.body.student;
    if(id===null){
      res.send(null);
      return;
    }
    let sql = "select * from students where id_student = '"+id+"';";
    con.query(sql,(err, results,field)=>{
        if (err) throw error;
        if(results.length!==0)
          res.send({student:results[0]});
        else
          res.send({student:null});
    });
});
/**
 * recive : phone number
 * send: if success true else false
 */
app.post('/sms', (req,res)=>{
  const from = '972545738557';
  const to =   '972'+req.body.phone.substring(1);
  const text = 'אישור בחינה';
  const opts = {
    "type": "unicode"
  }
    nexmo.message.sendSms(from, to, text, opts, (err, responseData) => {
          if (err) {
              console.log(err);
              res.send(false);
          } else {
              if(responseData.messages[0]['status'] === "0") {
                  console.log("Message sent successfully.");
                  res.send(true);
              } else {
                  console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                  res.send(false);
              }
          }
      })
});
/**
 * logIn 
 * receive : string of userLogIN and password
 * if supervisor exist, send object of user with first_name,last_name and login
 */
app.post('/login', (req,respons)=>{
  let sql = "select * from supervisor where user = '"+req.body.userLogIN.user+"';";
  con.query(sql,(error, results,field)=>{
      if(error){
        throw error;
      }
      if(results.length===0){
        respons.send(JSON.stringify({logIn:false,res:'user not exist',obj:null}));
      }
      else{
        bcrypt.compare(req.body.userLogIN.password, results[0].password,(err, res) => {
          if(!err){
            console.log('logIn is '+res)
            let objServisor = {
              id: results[0].id,
              first_name: results[0].first_name,
              last_name: results[0].last_name,
              gender: results[0].gender
            }
            respons.send(JSON.stringify({logIn:true,res:'',obj:objServisor}));
          }
          else{
            console.log('Error: ',err)
            respons.send(JSON.stringify({logIn:false,res:'password incorect',obj:null}));
          }
      });
    }
  });
});
app.post('/check_exam',(req,res)=>{
  let sql = "select * from exam where exam_code='"+req.body.exam_code+"';";
  con.query(sql,(error,result,field)=>{
    if(error)
      throw error;
    if(result.length===0){
      res.send(JSON.stringify({data:null,res:'exam not exist'}));
    }
    else{
      res.send(JSON.stringify({data:result[0],res:''}));
    }
  });
});
/**
 * send array of students by id exam...
*/
app.post('/getAllStudents',(req,res)=>{
  let sql = "select s.id,s.id_student,s.first_name,s.last_name,s.phone,s.email,s.img from exam_details as e "
  +"inner join students as s on e.id_student=s.id "
  +"where e.id_exam='"+req.body.exam_id+"';";

  con.query(sql,(error,result)=>{
    if(error)
      throw error;
    res.send(JSON.stringify(result));

  });
});

app.post('/setStudentInExam',(req,res)=>{
  let sql = "insert into exam_details(id_exam,id_student,id_supervisor) "
  +"values('"+req.body.examID+"','"+req.body.studentID+"','"+req.body.supervisorID+"');";

  con.query(sql,(error,result)=>{
    if(error)
      throw error;
    if(result.affectedRows>0)
      res.send(true);
    else
      res.send(false);
  })
});
app.post('/deleteStudentInExam',(req,res)=>{
  let sql = "delete from exam_details WHERE "
    +"id_exam='"+req.body.exam_id+"' and id_student='"+req.body.student_id+"';";
  
  con.query(sql,(error,result)=>{
    if(error)
      throw error;
    if(result.affectedRows>0)
      res.send(true);
    else
      res.send(false);
  })
})

app.listen(PORT, () => {
    console.log(`Server run on ${PORT}`);
});
