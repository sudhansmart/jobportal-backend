const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema(
   {
     userid : {
        type : String
     },
     password :{
        type :String
     },
     token :{
      type :String
   },
   role :{
      type :String
   },
   },
   {
    collection :"Admins"
   });

   module.exports = mongoose.model("Admins",adminSchema)
