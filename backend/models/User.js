const mongoose=require("mongoose")

const bcrypt=require("bcrypt")

const jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema({
    name:{
        type:String ,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']

    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["patient","doctor","admin"],
        default:"patient"
    },
     isAdmin: { 
        type: Boolean,
         default: false },
    
    createdAt:{
        type:Date,
        default:Date.now
    }
});

//hashing password
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){

         return next();
    }
try {
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
} catch (err) {
    next(err);
}     
});

userSchema.methods.comparePassword=async function (candidatePassword) {
    return bcrypt.compare(candidatePassword,this.password);
};

//jwt token
userSchema.methods.generateJWT=function(){
    return jwt.sign(
    {id:this._id,
        email:this.email,
        role:this.role, 
        isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    {expiresIn:"1h"}
    )
}
module.exports=mongoose.model("User",userSchema);