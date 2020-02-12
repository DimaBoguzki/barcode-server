const DB = require('./db');

class ExamDB{

    getStudentById(id, callback) {
        let sql = "select * from students where id_student = '"+id+"';";
        DB.query(sql, (err, res)=>{
            if (err) throw err;
            if(res.length!==0){
              return callback(JSON.stringify({student:res[0]}));
            }
            else
              return callback(JSON.stringify({student:null}));
        });
    }
    getExamByCode(exam_code, callback) {
        let sql = "select * from exam where exam_code='"+exam_code+"';";
        DB.query(sql,(err,res)=>{
          if(err) throw err;
          if(res.length===0)
            return callback(JSON.stringify({data:null}));
          else
            return callback(JSON.stringify({data:res[0]}));
        });
    }
    getAllStudentsByExamCode(exam_id, callback) {
        let sql = "select s.id,s.id_student,s.first_name,s.last_name,s.phone,s.email,s.img from students as s "
        +"inner join exam_details as e on e.id_student=s.id where e.id_exam='"+exam_id+"';";
        DB.query(sql,(err,res)=>{
          if(err) throw error;
          return callback(JSON.stringify(res));
      
        });
    }
    setStudentInExam(examID, studentID, supervisorID, callback){
        let sql = "insert into exam_details(id_exam,id_student,id_supervisor) "
            +"values('"+examID+"','"+studentID+"','"+supervisorID+"');";
      
        DB.query(sql, (err,res)=>{
          if(err) throw err;
          if(res.affectedRows > 0)
            return callback(true);
          else
            return callback(false);
        })
    }
    deleteStudentFromExam(exam_id, student_id, callback){
        let sql = "delete from exam_details WHERE "
            +"id_exam='"+exam_id+"' and id_student='"+student_id+"';";
        
        DB.query(sql, (err,res)=> {
            if(err) throw err;

            if(res.affectedRows>0) 
                return callback(true);
            else 
                return callback(false);
        });
    }
}

module.exports = ExamDB;