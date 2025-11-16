const mongoose=require("mongoose")

const doctorSchema=new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    specialization:{
        type:String },
    bio:{
        type:String},
    availableSlots:[
        {
            date:{type:Date},
            slots:[String]
        }
    ]
 });
 module.exports=mongoose.model("Doctor",doctorSchema)