const { sendMail } = require('./sendMail');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const Users = require('../models/Users');



async function CheckUser(email){
  try {
      const user = await Users.findOne({email:email})
      if(user){
          return true;
      }
      return false;
  } catch (error) {
      return "Server Busy" ;
  }
}

async function InsertnewUser(name, email) {
  try {
    const Payload = {name:name,email:email}
    const token = generateToken(Payload);
    const latestCandidate = await Users.findOne({}, {}, { sort: { serialId: -1 } });
    adminemail = process.env.adminEmail
    const newUser = new Users({
      serialId: latestCandidate ? latestCandidate.serialId + 1 : 1,
      name: name,
      email: email,
      token: token,  
      firstLogin:true,
    });

    const content = `<h2>Hello ${name.replace(/\b\w/g,c=>c.toUpperCase())},</h2>
                     <h4>Welcome to Skylark HR Solutions </h4>
                     <p>Thank You For Signing up.You are successfully registered </p>   
                     <p>Regards,</p>
                     <p>Skylark Hr Solutions</p>`
                  
                     const admincontent = `
                     <!DOCTYPE html>
                     <html lang="en">
                     <head>
                         <meta charset="UTF-8">
                         <meta name="viewport" content="width=device-width, initial-scale=1.0">
                         <title>New User Notification</title>
                         <style>
                             body {
                                 font-family: Arial, sans-serif;
                                 margin: 0;
                                 padding: 0;
                                 background-color: #f4f4f4;
                             }
                     
                             .container {
                                 max-width: 600px;
                                 margin: 20px auto;
                                 padding: 20px;
                                 background-color: #ffffff;
                                 border-radius: 8px;
                                 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                             }
                     
                             h2 {
                                 color: #333333;
                                 margin-top: 0;
                             }
                     
                             table {
                                 width: 100%;
                                 border-collapse: collapse;
                                 margin-bottom: 20px;
                             }
                     
                             table, th, td {
                                 border: 1px solid #dddddd;
                                 text-align: left;
                             }
                     
                             th, td {
                                 padding: 10px;
                             }
                     
                             .header {
                                 background-color: #f9f9f9;
                                 padding: 20px 0;
                                 text-align: center;
                                 border-top-left-radius: 8px;
                                 border-top-right-radius: 8px;
                             }
                     
                             .footer {
                                 background-color: #f9f9f9;
                                 padding: 20px;
                                 text-align: center;
                                 border-bottom-left-radius: 8px;
                                 border-bottom-right-radius: 8px;
                             }
                     
                             .footer p {
                                 color: #666666;
                                 font-size: 12px;
                                 margin: 0;
                             }
                         </style>
                     </head>
                     <body>
                         <div class="container">
                             <div class="header">
                                 <h2>New User Registered</h2>
                             </div>
                             <div class="content">
                                 <p>Hello Admin,</p>
                                 <p>A new user has been registered. Below are the details:</p>
                                 <table>
                                     <tr>
                                         <th>Name</th>
                                         <td> ${name.replace(/\b\w/g,c=>c.toUpperCase())}</td>
                                     </tr>
                                     <tr>
                                         <th>Email</th>
                                         <td><a href="mailto:${email}">${email}</a></td>
                                     </tr>
                                     
                                 </table>
                                 <p >Please take necessary action.</p>
                             </div>
                             <div class="footer">
                                 <p>Best Regards,<br></p>
                                 <a target="_blank" href="https://www.skylarkjobs.com/#/findcandidate"> Skylarkjobs.com</a>
                             </div>
                         </div>
                     </body>
                     </html>
                     `
    await newUser.save();
   
    sendMail(email, "Registration Successfull", content);
    sendMail(adminemail, "New User Registered", admincontent);
  } catch (error) {
    console.log("Error occurred in InsertnewUser: ", error);
  }
}

function generateToken(payload) {
  const token = jwt.sign({ email: payload.email,name : payload.name }, process.env.signUp_SecretKey, {
    expiresIn: '1h', // You can adjust the expiration time
  });

  return token;
}


async function ExistingUser(otp) {
    try {
      const usercheck = await Users.findOne({ otp: otp });
      if (usercheck) {
        const response = {
          id:usercheck.id,
          name :usercheck.name,
          email:usercheck.email,
          status:true,
          firstLogin:true,
          role:"user"

      }
        return response; 
      }
      else{
        return false
      }
    } catch (error) {
      console.log("Error occurred in ExistingUser: ", error);
      return "Server Error"; 
    }
  }




module.exports = { InsertnewUser, ExistingUser,CheckUser};
