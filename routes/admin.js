const express = require('express')
const router = express.Router();
const {AuthenticateUser,CheckUser,insertAdmin}= require('../controllers/admin');




router.post('/login',async (req,res)=>{
     try {
        const { userId, password } = req.body;
        const logincred = await AuthenticateUser(userId, password);
           
        if (logincred === "Invalid Username or Password") {
          res.status(202).send("Invalid Username or Password");
        } else if (logincred === "Server Busy") {
          res.status(201).send("Server Busy");
        } else {
          res.status(200).send(logincred);
        }
     } catch (error) {
        
     }
})

router.post('/addadmin',async (req,res)=>{
    try {
        const { userId, password } = req.body; 
        const registerCredentials = await CheckUser(userId);
        if (registerCredentials === false) {
          await insertAdmin(userId, password); // Corrected the parameter order
          res.status(200).send(true);
        } else if (registerCredentials === true) {
          res.status(201).send(false);
        } else if (registerCredentials === "Server Busy") {
          res.status(500).send("Server Busy");
        }
      } catch (error) {
        console.log("Error occurred in admin create route: ", error);
        res.status(500).send("Internal Server Error");
      }
   
})

module.exports = router;