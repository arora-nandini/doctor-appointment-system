const mongoose=require("mongoose")

const appointmentSchema=new mongoose.Schema({
    patient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
        
    },
    doctor:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Doctor",
       required:true
     
    },
    date:{
        type:String ,
        required:true },
time:{
    type:String ,
    required:true }, 

status: { type: String,
     enum: ['booked', 'completed', 'cancelled', 'no-show'],
      default: 'booked' },
createdAt:{
    type:Date,
    default:Date.now }
});
module.exports=mongoose.model("Appointment",appointmentSchema);