const jwt = require('jsonwebtoken');


const verifyToken = async (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(500).json('no token provided');
    }
    const token = authHeader.split(' ')[1];
    try{
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN);
    if(!decoded){
        return res.status(500).json('Invalid token');
    }
    const {email,_id, username} = decoded;
    req.user = {email,_id, username};
    next();
    }catch(error){
        res.status(500).json({error});
    }
}

module.exports = verifyToken;