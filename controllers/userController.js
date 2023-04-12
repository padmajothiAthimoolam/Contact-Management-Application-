const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const jwt =require("jsonwebtoken");

const User = require("../models/userModel");

const registerUser = asyncHandler(async(req,res) =>{
    const{ username,email,password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatroy");
    }
    const userAlreadyExists = await User.findOne({email});
    if(userAlreadyExists){
        res.status(400);
        throw new Error("The email is already registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username, email, password: hashedPassword
    });
    if(user){
       res.status(201).json({_id: user.id, email: user.email});
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({message: "User registered successfully"});

});

const loginUser =asyncHandler(async(req,res)=>{
    const{ email,password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatroy")
    }
    const user = await User.findOne(email);
    const passwordMatch = bcrypt.compare(password,user.password);
    if(user && passwordMatch){
        const accessToken = jwt.sign({
            user: {
                username: User.username,
                email: User.email,
                id: User.id
            },
        },
        process.env.ACCESS_TOKEN,
        {expiresIn :"10m"}
        );
        res.status(200).json({accessToken});
    }
    else {
        res.status(401);
        throw new Error("Email or Password is not valid")
    }
});

const currentUser =asyncHandler(async(req,res)=>{
    res.send(req.user)
});

module.exports = {registerUser,loginUser,currentUser};