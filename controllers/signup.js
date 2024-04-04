const { sendMail } = require('./sendMail');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const Users = require('../models/Users');
dotenv.config();

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
    const newUser = new Users({
      serialId: latestCandidate ? latestCandidate.serialId + 1 : 1,
      name: name,
      email: email,
      token: token,  
    });

    const content = `<h2>Hello Job Seeker,</h2>
                     <h4>Welcome to Skylark HR Solutions </h4>
                     <p>Thank You For Signing up.You are successfully registered </p>   
                     <p>Regards,</p>
                     <p>Skylark Hr Solutions</p>`;

    await newUser.save();
    console.log(newUser); 
    sendMail(email, "Registration Successfull", content);
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
