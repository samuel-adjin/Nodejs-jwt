const express = require('express');
const app = express();
require('dotenv').config();
const connectDb = require('./db/connect');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

app.use(express.json());
app.use('/api/v1/user',userRouter);
app.use('/api/v1/auth',authRouter);



port = process.env.PORT || 3000;

const start =  async () =>{
    try{
    await connectDb(process.env.MONGO_URI);
    app.listen(port,()=> console.log( `server listening on port: ${port}...`))
    }catch(error){
        console.log(error);
    }
}

start();