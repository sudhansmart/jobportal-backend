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
    const mailOption ={
        from : "sudhansince1997@gmail.com",
        to : toEmail,
        subject:subject,
        html:content
    };

    transporter.sendMail(mailOption,(error,info)=>{
      if(error){
        console.log("error occured :",error)
      }else{
        console.log("Email Sent : ",info.response)
      }
    })

}
module.exports = {sendMail}
