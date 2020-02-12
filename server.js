require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const Nexmo = require('nexmo');
const RouteSupervisor = require('./server/routeSupervisor');
const RouteExam = require('./server/routeExam');
const log = require('./server/log');
const PORT = process.env.PORT || 5001;
const app = express();

app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/exam',RouteExam);
app.use('/supervisor', RouteSupervisor);

// create commection of nexmo sms
const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET
})
/**
 * reccive: string of id_student
 * send : if exist send objext with data of student, if not send null df
 */
app.get('/test',(req,res)=>{
  res.send(JSON.stringify("Connected"));
})
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

app.listen(PORT, () => {
    console.log(`Server run on ${PORT}`);
});
