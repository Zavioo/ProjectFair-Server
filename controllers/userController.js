
const users = require('../models/userModel')
const jwt = require('jsonwebtoken')

// register
exports.registerController = async (req,res)=>{
    console.log("Inside Register controller");
    console.log(req.body);
    const {userName,email,password} = req.body
    try{
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(406).json("Already existing user ..... Please Login!!!!")


        }else{
            const newUser = new users({
                username:userName,email,password,github:"",linkedin:"",profilePic:""
            })
            await newUser.save()
            res.status(200).json(newUser)

        }

    }catch(err){
        res.status(401).json(err)
    }
    
    
    
}


// Login

exports.loginController = async(req,res)=>{
    console.log("Inside loginController");
    const {email,password} = req.body
    console.log(email,password);
    try{
        const existingUser = await users.findOne({email,password})
        if(existingUser){
            // token generation
            const token = jwt.sign({userId:existingUser._id},process.env.JWTPASSWORD)
            res.status(200).json({
                user:existingUser,token
            })
        }else{
            res.status(404).json("Incorrect Email / Password!!!")
        }

    }catch(err){
        res.status(401).json(err)
    }
    
    
}

// profile updation

exports.editUserController =async(req,res)=>{
    console.log("Inside editUserController");
    const {userName,email,password,github,linkedin,profilePic} = req.body
    const uploadProfilePic = req.file?req.file.filename:profilePic
    const userId = req.userId
    console.log(userName,email,password,github,linkedin,uploadProfilePic,userId);
    
    try{
        const updateUser = await users.findByIdAndUpdate({_id:userId},{
            username:userName,email,password,github,linkedin,profilePic:uploadProfilePic
        },{new:true})
        await updateUser.save()
        res.status(200).json(updateUser)

    }catch(err){
        res.status(401).json(err)
    }
    
}