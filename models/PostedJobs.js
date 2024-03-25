const mongoose = require('mongoose');


const postedJobSchema = new mongoose.Schema(
    {  
        serialId :{
            type:Number,
            required:true,
            unique : true
          },
        jobtitle : {
            type : String
         },
         postedDate :{
            type:Date,
            default:Date.now()
        },
         companyName : {
            type : String
         },
         jobtype : {
            type : String
         },
         category : {
            type : String
         },
         gender : {
            type : String
         },
         companyprofile : {
            type : String
         },
         jobdescription : {
            type : String
         },
         experience : {
            type : String
         },
         salary : {
            type : String
         },
         location : {
            type : String
         },
         qualification : {
            type : String
         },
         workmode : {
            type : String
         },
         noticePeriod : {
            type : String
         },
         recruiterName : {
            type : String
         },
         phoneNumber : {
            type : Number
         },
         recruiterEmail : {
            type : String
         },
         primarySkills : {
            type : String
         },
         applicants: [{
            candidateId :{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
            },
            jobtitle:String,
            candidateName: String,
            candidateEmail:String,
            candidatePhone: String,
            location:String,
            cvname: String,
            cvpath: String,
            status: String
          }]
       
    },
    {
        collection :"PostedJobs"
       }
);
module.exports = mongoose.model("PostedJobs",postedJobSchema)