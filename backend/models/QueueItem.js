const mongoose=require("mongoose");

const queueItemSchema=new mongoose.Schema({
   
 doctor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Doctor",
    required:true },

 appointment:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Appointment",
    required:true },

 position:{
    type:Number,
    required:true},

 status:{
    type:String,
    enum:["waiting","in-progress","served", "skipped"],
     default: "waiting" },


    createdAt:{
    type:Date,
    default:Date.now },
});

module.exports=mongoose.model("QueueItem",queueItemSchema);