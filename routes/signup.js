const express = require('express');
const router = express.Router();
const { CheckUser } = require('../controllers/signup');
const { InsertnewUser, ExistingUser } = require('../controllers/signup');

router.post('/verifyotp', async (req, res) => {
    try {
      const { otp } = req.body;
      const otpValid = await ExistingUser(otp);
      if (otpValid) {
      const otpValid = await ExistingUser(otp);
        res.status(202).send(otpValid);
      } else {
        res.status(203).send(false);
      }
  
    } catch (error) {
      console.log("Error occurred in OTP verification: ", error);
      res.status(501).send("Internal Server Error");
    }
  });

router.post('/verify', async (req, res) => {
  try {
    const { name, email} = req.body;

    const registerCredentials = await CheckUser(email);
   
    if (registerCredentials === false) {
      await InsertnewUser(name, email); 
      res.status(200).send(true);
    } else if (registerCredentials === true) { 
      res.status(201).send(false);
    } else if (registerCredentials === "Server Busy") {
      res.status(500).send("Server Busy");
    }
  } catch (error) {
    console.log("Error occurred in /verify route: ", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
