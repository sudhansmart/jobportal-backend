const express = require('express')
const router = express.Router();
const {CheckUser}= require('../controllers/signup');
const {insertOTP,OtpVerification} =  require('../controllers/login');



router.post('/verify',async (req,res)=>{
    const {email} = req.body;
    const userfound = await CheckUser(email);
   
   
    try {
        if(userfound){
            insertOTP(email)
            res.status(200).send(true)
        }else if(!userfound){
            res.status(200).send(false)
        }

    } catch (error) {
        console.log("error occured in login route :",error)
    }
    console.log("login : ",userfound)
})

router.post('/verifyotp',async (req,res)=>{
      const {email,otp} = req.body;
     const otpverify = await OtpVerification(email,otp)
    try {
        
       if(otpverify) {
        res.status(200).send(otpverify)
       }
      else if(otpverify === false) {
        res.status(201).send(false)
       }
    } catch (error) {
        
    }

})

module.exports = router;