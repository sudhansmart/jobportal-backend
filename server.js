const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT
const DB_URL = process.env.DB_URL


// Routes
app.use('/signup',require('./routes/signup'));
app.use('/login',require('./routes/login'));
app.use('/file',require('./routes/upload'));
app.use('/admin',require('./routes/admin'));
app.use('/job',require('./routes/JobPosts'));
app.use('/post',require('./routes/applyJob'));
app.use('/profile',require('./routes/profile'));





mongoose.connect(DB_URL,{})
.then(()=>{
    console.log("MongoDB Connected")
})
.catch((err)=>{
    console.log("MongoDB Not Connected :",err.message)
})







app.listen(PORT,()=>{
    console.log("Your Server is Running at PORT : ",PORT)
})