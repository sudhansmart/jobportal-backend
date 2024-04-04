const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
   {
    serialId :{
      type:Number,
     
      unique : true
    },
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
      clientName:{
        type:String
      },

      experience :{
        type:String,
      },
      currentctc:{
        type:String,
      },
      expectedctc:{
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
      keySkills:[{
        type : String
      }],
      Updatedcvname:{
        type:String
      } ,
      Updatedcvpath:{
        type:String
      } ,
      gender:{
        type : String
      },
      currentCompany:{
        type:String
      },
       joinedOn :{
        type:Date,
        default:Date.now()
     },   
      dob :{
      type:Date,
     },
     remarks:{
      type:String
     },
     industry :{
      type:String,
     },
     preferredLocation :{
      type:String,
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
          type:Boolean
        },
        write: {
          type:Boolean
        },
        speak: {
          type:Boolean
        },
      }],
     
      education: [{
        qualification :{
        type: String
        },
        collegeName: {
          type:String
        },
        startyear:{
          type : String
        },
        passedout: {
          type:String
        },
        degree: {
          type:String
        },
      }],
      employment: [{
        expYear :{
        type: String
        },
        expMonth: {
          type:String
        },
        currentCompanyName:{
          type : String
        },
        designation: {
          type:String
        },
        startDate: {
          type:Date
        },
        endDate: {
          type:Date
        },
        jobSummary:{
          type:String
        },
        isCurrent:{
          type:Boolean
        }
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
