const mongoose = require('mongoose');


const uploadedFileSchema = new mongoose.Schema(
   {
    serialId :{
    type:Number,
    required:true,
    unique : true
  },
    
   date: {
      type: Date,
      default: Date.now
    },
    name :{
        type:String,
        required:true
      },
      email:{
        type:String,
        required:true
      },
      phoneNumber:{
        type:String,
        required:true
      },
      location:{
        type:String,
        required:true
      },
      preferredlocation:{
        type:String,
      },
      qualification:{
        type:String,
        required:true
      },
      currentCompany:{
        type:String,
        required:true
      },

      overAllExp:{
        type:String,
        required:true
      },
      relevantExp:{
        type:String,
        required:true
      },
      currentCtc:{
        type:String,
        required:true
      },
      expectedCtc:{
        type:String,
        required:true
      },
      noticePeriod:{
        type:String,
        required:true
      },
      dob:{
        type: String,
      },
  
     
      gender:{
        type:String,
      },
      skills:{
        type:String,
        required:true
      },
   
      cvpath:{
        type:String
       
      }
   },
   {
    collection :"UploadedFile"
   });

   module.exports = mongoose.model("UploadedFile",uploadedFileSchema)
