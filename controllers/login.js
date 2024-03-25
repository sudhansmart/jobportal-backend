const { sendMail } = require('./sendMail');
const Users = require('../models/Users');


async function insertOTP(email){
    try {
        const user = await Users.findOne({email:email}) 
        const otp = Math.floor(100000 + Math.random() * 900000);
        const generatedotp= otp.toString(); 
        user.otp = generatedotp;

        const content = `<h2>Hello Job Seekers,</h2>
        <h4>Welcome to Skylark HR solutions </h4>
        <p>Thank You For Your Registration.Here is Your 6 Digit OTP - <h2 style="color: blue;">${generatedotp}</h2> </p>
        
        <p>Regards,</p>
        <p>Team Skylark HR solutions</p>`;

        await user.save();
        console.log("saved User",user); 
        sendMail(email, "User Verification", content);

        
    } catch (error) {
        console.log("Error Occured in InsertOtp :",error)
    }
}

async function OtpVerification (email,otp){
    const user = await Users.findOne({email:email}) 
    if(user.otp === otp){
        const response = {
            name :user.name,
            email:user.email,
            token:user.token,
            id:user._id
        }
          return response; 
    }else {
        return false
    }
}

module.exports = {insertOTP,OtpVerification}