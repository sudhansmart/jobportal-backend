const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const { error } = require("console");
dotenv.config()
const transporter = nodemailer.createTransport({
 service:"gmail",
  auth: {
    user: process.env.nodemailuser,
    pass: process.env.nodemailpass
  },
});

function sendMail(toEmail,subject,content){
     console.log("mail triggered :",toEmail)
    const mailOption ={
        from : "skylarkhr2013@gmail.com",
        to : toEmail,
        subject:subject,
        html:content
    };

    transporter.sendMail(mailOption,(error,info)=>{
      if(error){
        console.log("error occured in sendmail :",error)
      }else{
        console.log("Email Sent : ",info.response)
      }
    })

}

function applyMail(toEmail,subject,content,attached,jobsmail){
  console.log("mail triggered :",toEmail)
 const mailOption ={
     from : "skylarkhr2013@gmail.com",
     to : toEmail,
     bcc: jobsmail,
     subject:subject,
     html:content,
     attachments:attached

 };

 transporter.sendMail(mailOption,(error,info)=>{
   if(error){
     console.log("error occured in sendmail :",error)
   }else{
     console.log("Email Sent : ",info.response)
   }
 })

}
module.exports = {sendMail,applyMail}
