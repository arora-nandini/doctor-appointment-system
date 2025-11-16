const mongoose=require("mongoose")

const connectDB=async(uri)=>{
    
await mongoose.connect(uri)
console.log("mongoDB connected");
        
   
        console.log("MongoDb connected");
    
}
module.exports=connectDB;