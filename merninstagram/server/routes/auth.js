const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const {JWT_SECRET}  = require('../config/keys')
const requiredLogin = require('../middleware/requirelogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRID_API,EMAIL} = require('../config/keys')
//


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

router.post('/signup',(req,res)=>{
   const {name, email, password, pic } = req.body
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
                name,
                pic
            })
    
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"aggyash99@gmail.com",
                    subject:"Signup Success",
                    html:"<h1>Welcome to Instagram Clone</h1>"
                })
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
                //res.json({message : "successfully signed in"})
                const token = jwt.sign({_id : savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic}=savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
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

router.post('/resetpassword',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User doesn't exist with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then(result=>{
                transporter.sendMail({
                    to:user.email,
                    from:"aggyash99@gmail.com",
                    subject:"Password Reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>click on this <a href = "${EMAIL}/resetpassword/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"check your email"})
            })
        })
    })
})

router.post('/newpassword',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then(savedUser=>{
                res.json({message:"password updates success"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
    })
})

module.exports = router