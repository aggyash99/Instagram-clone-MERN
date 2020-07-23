const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name : {
        
        type : String, 
        required : true
    },
    email: {
        type : String,
        required : true
    },
    resetToken:String,
    expireToken:Date,
    password : {
        type : String,
        required : true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/aggyash99/image/upload/v1593843648/sample.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User",userSchema)