const jwt = require('jsonwebtoken')
const User = require('../models/user');



const showAllUsers = async (req,res) =>{
    try{
        const users = await User.find({});
        res.status(200).json({success:"true",data:users});
    }catch(error){
        res.status(500).json({success:"false",msg:error});
}
}

const token = async (req,res) =>{
   
    try{
        if(!token){
            res.status(500).json('Invalid token');
        }
        const user = await User.findOne({refreshToken:req.body.token});
        if(!user){
            res.status(500).json({error:"Invalid user"});
        }
        const{username,email,_id} = user;
        const userData = {username,email,_id}
        const access_token = await generateToken(userData);
        const refresh_token = await generateRefreshToken(userData);
        user.refreshToken = refresh_token;
        user.save();
        res.status(200).json({success:"true", data:{access_token,refresh_token}});
       
    }catch(error){
        res.status(500).json({error:error})
    }
}

const generateToken = (userData) =>{
    const token =  jwt.sign(userData,process.env.ACCESS_TOKEN,{expiresIn:'30s'})
    return token;
}

const generateRefreshToken = (userData) =>{
    const token =  jwt.sign(userData,process.env.REFRESH_TOKEN,{expiresIn:'10d'})
    return token;
}
module.exports = {showAllUsers,token};