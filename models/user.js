const mongoose = require('mongoose');
const userSchema = new  mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        trim:true,
        unique:true
    },
    emailToken:{
        type:String,
        trim:true,
        unique:true
    },
    refreshToken:{
        type:String,
        unique:true,
        trim:true
    },
    isVerified:{
        type:Boolean,
        default: false
    },
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;