const express = require('express');
const ExamDB = require('./DataBase/examDB');
const db = new ExamDB();

const routeExam = express.Router();
routeExam.post('/students', (req, res) => {
    let id = req.body.student;
    if(id===null){
      res.send(null);
      return;
    }
    db.getStudentById(id,(data)=>{
      res.send(data);
    });
});
routeExam.post('/getExam',(req,res)=>{
  let exam_code = req.body.exam_code;
  if(exam_code===null) res.send({data:null});
  else{
    db.getExamByCode(exam_code, (data)=>{
      res.send(data);
    });
  }
});
  /**
   * send array of students by id exam...
  */
routeExam.post('/getAllStudents',(req,res)=>{
  if(req.body.exam_id===null)
    res.send(null);
  else{
    let exam_code = req.body.exam_id;
    db.getAllStudentsByExamCode(exam_code, (data)=>{
      res.send(data);
    });
  }
});
  
routeExam.post('/setStudentInExam',(req,res)=>{
  if(req.body.examID===null || req.body.studentID===null || req.body.supervisorID===null)
    res.send(false);
  else{
    db.setStudentInExam(req.body.examID, req.body.studentID, req.body.supervisorID, (bool)=> {
      res.send(bool);
    });
  }
});

routeExam.post('/deleteStudentFromExam',(req,res)=>{
  if(req.body.exam_id===null || req.body.student_id===null)
    res.send(false);
  else{
      db.deleteStudentFromExam(req.body.exam_id, req.body.student_id, (bool)=> {
      res.send(bool);
  });
}
  
});

module.exports = routeExam;