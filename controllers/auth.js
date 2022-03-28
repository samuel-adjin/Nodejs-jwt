const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const res = require('express/lib/response');


const signUp = async (req,res)=>{
    try{
        //plainText is password
    const {email,username,plainText,confirmedPassword} = req.body;
    
    if(plainText !== confirmedPassword){
        res.status(500).json({error:"Password does not match"});
    }
    const emailExist = User.find({email});
    if(emailExist){
        res.status(500).json(`${email} is taken`);
    }
    const password = await bcrypt.hash(plainText,10);
    emailToken = crypto.randomBytes(64).toString('hex');
    const user =  await User.create({
        email,password,username,emailToken
    });
    await emailConfirmation(user,req);
    res.status(201).json({sucess:true, data:user});
    }catch(error){
        res.status(500).json({success:"false",msg:error});
    }
}  
    

const login =async (req, res)=>{
    try{
        const{email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(500).json('Invalid email or password');
        }
        if(!user.isVerified){
            return res.status(500).json(`Ooops can't login... Go to your mail to confirm email... thank you` );
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(500).json(`Ooops can't login... Go to your mail to confirm email... thank you` );
        }
        const{username,_id} = user;
        const access_token = jwt.sign({email,username,_id},process.env.ACCESS_TOKEN,{expiresIn:'1m'});
        const refresh_token = jwt.sign({email,username,_id},process.env.REFRESH_TOKEN,{expiresIn:'10d'});
        user.refreshToken = refresh_token;
        user.save();
        res.status(200).json({msg:`logged in successfully`,data:{access_token,refresh_token}});
    }catch(error){
        res.status(500).json({success:"false",msg:error});
    }
}

const emailConfirmation = async (user,req)=>{
    try{
        const transport = nodemailer.createTransport(
            nodemailerSendgrid({
                apiKey: process.env.SENDGRID_API_KEY
            })
        );
    
 const msg ={
    from: 'samueladams990@outlook.com',
    to: user.email,
    subject: 'Email Confirmation',
    html: `<h1>Hello,${user.username}</h1>
    <p>Thanks for signing up wiht farad, Click the link below to verify your email</p>
    <a href ="https://api/v1/auth/${req.headers.host}/verify-email?token=${user.emailToken}"> verify email </a>`
};
    
    transport.sendMail(msg);
    }catch(error){
        res.status(500).json(error)
        console.log(error);
    }
   
};

const emailVerified = async (req,res)=>{
    const{token} = req.query;
    try{

        const user = await User.findOne({emailToken:token});
        if(!user){
            res.status(500).json('Invalid verification token');
        }
        user.isVerified = true;
        user.emailToken = null;
        user.save();
        res.status(200).json({success:"true", msg:"email verified successfully"})
    }catch(error){
        res.status(500).json({success:"false",error:error});
    }
}




module.exports = 
{
    signUp,
    login,
    emailVerified
}