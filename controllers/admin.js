const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const Admins = require('../models/Admins');
const bcrypt = require('bcrypt');
dotenv.config();

async function CheckUser(userid){
    try {
        const user = await Admins.findOne({userid:userid})
        if(user){
            return true;
        }
        return false;
    } catch (error) {
        return "Server Busy" ;
    }
  }

  async function insertAdmin(userId,password) {
    try {
      const Payload = {role :'admin'}
      const token = generateToken(Payload);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new Admins({
     
        userid: userId,
        password : hashedPassword,
        token: token,
        role : 'admin'

       
      });
      await newUser.save();
    } catch (error) {
      console.log("Error occurred in InsertAdmin: ", error);
    }
  }
  
  function generateToken(payload) {
    const token = jwt.sign({ Role: payload.role}, process.env.signUp_SecretKey, {
      expiresIn: '1h', // You can adjust the expiration time
    });
  
    return token;
  }
  
async function AuthenticateUser(userid,password){
    try {
        const usercheck = await Admins.findOne({userid:userid});
        const validpassword = await bcrypt.compare(password,usercheck.password)
        
        if (validpassword){
            const token = jwt.sign({userid},process.env.login_SecretKey);
            const response = {
                id:usercheck.id,
                userid:usercheck.userid,
                token:token,
                status:true,   

            }
            await Admins.findOneAndUpdate({userid:usercheck.userid},{$set:{token:token}},{new:true})
            return response
        }

        else{ return "Invalid Username or Password"}
    } catch (e) {
        console.log("error occured in authentication : ",e.message)
        return "Server Busy"
    }
}


module.exports = {AuthenticateUser,CheckUser,insertAdmin};
