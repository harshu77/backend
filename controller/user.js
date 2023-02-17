var userModel = require('../models/user');
var jwt  = require('jsonwebtoken')
const userHelperFunction = require('../utils/user');
const saltRounds = 10;

const userController = {}

async function signup (req,res,next){
    try{
    const {name,email,password}  = req.body;
    if(name == undefined || email == undefined || password == undefined){
        return res.status(400).json({message:"Please provide all the fields"})
    }
    const hashPassword = await userHelperFunction.hashPassword(password);
    
    const userEntry = await userModel.create({name,email,password:hashPassword})
    
    if(userEntry?._id !== undefined){
        const token = jwt.sign(
            { user_id: userEntry._id, email },
            process.env.TOKEN_KEY,
          );
        const cloneUserEntry = {...userEntry}
        const updatedUserEntry = cloneUserEntry._doc
        updatedUserEntry.token = token
        delete  updatedUserEntry.password;
        delete  updatedUserEntry._id;
        console.log( updatedUserEntry)
        
        return res.json({message:"User Successfully created",data:updatedUserEntry}).status(200)
    }else{
        return res.status(400).json({message:"Error while entering in registration Database"})
    }
    }catch(err){
        console.log(err)
        return res.status(400).json({message:"Something went wrong"})
    }
     
}

userController.signup = signup
module.exports = userController
