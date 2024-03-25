const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
   {
    name :{
        type:String,
       
      },
    email:{
        type:String,
        unique : true
      },
    phonenumber:{
        type: Number, 
      },
      role :{
        type:String,
      },
      location :{
        type:String,
      },
      experience :{
        type:String,
      },
      currentctc:{
        type:String,
      },
      noticeperiod : {
        type : String
      },
      cvname:{
        type : String
      },
      cvpath:{
        type : String
      },
      profileSummary:{
        type : String
      },
      keySkills:{
        type : String
      },
      Updatedcvname:{
        type:String
      } ,
      Updatedcvpath:{
        type:String
      } ,
      gender:{
        type : String
      },

    joinedOn :{
        type:Date,
        default:Date.now()
     },   
      dateofbirth :{
      type:Date,
     },
   
    otp: String,
      token:{
        type:String,
       
      },
      languages : [{
        language :{
          type: String
          },
        proficiency :{
        type: String
        },
        read: {
          type:String
        },
        write: {
          type:String
        },
        speak: {
          type:String
        },
      }],
     
      education: [{
        qualification :{
        type: String
        },
        collegeName: {
          type:String
        },
        passedout: {
          type:String
        },
        course: {
          type:String
        },
      }],

      appliedJobs: [{
        jobid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostedJobs'
        },
        cvname: String,
        cvpath: String
      }]
   },
   {
    collection :"User"
   });

   module.exports = mongoose.model("User",userSchema)
