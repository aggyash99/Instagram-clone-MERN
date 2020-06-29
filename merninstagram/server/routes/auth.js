const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')



router.post('/signup',(req,res)=>{
   const {name, email, password } = req.body
   if( !email || !password || !name){
       return res.status(422).json({error : "please fill all the fields!!"})
   } 
   User.findOne({email:email})
   .then((savedUser)=>{
       if(savedUser){
        return res.status(422).json({error : "User already Exists with this email"})
       }
       bcrypt.hash(password,12)
       .then(hashedpassword =>{
            const user = new User({
                email,
                password:hashedpassword,
                name
            })
    
            user.save()
            .then(user=>{
                res.json({message : "Save Successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
       })
   })
   .catch(err=>{
       console.log(err)
   })
})

router.post('/signin',(req,res)=>{
    const {email,password} =req.body
    if (!email || !password){
        res.status(422).json({error : "Please provide all fields"})
    } 
    User.findOne({email:email})
    .then(savedUser =>{
        if(!savedUser){
            return res.status(422).json({error : "Invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch =>{
            if(doMatch){
                res.json({message : "successfully signed in"})
            }
            else{
                return res.status(422).json({error : "Invalid Email or Password"})
            }
        })
        .catch(err =>{
            console.log(err)
        })
    })
})

module.exports = router