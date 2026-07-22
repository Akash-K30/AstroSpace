import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req,res,next)=>{

try{

const{name,email,password}=req.body;

if(!name || !email || !password)
return res.status(400).json({message:"All fields required"});

if(!validator.isEmail(email))
return res.status(400).json({message:"Invalid email"});

const exists=await User.findOne({email});

if(exists)
return res.status(409).json({message:"Email already exists"});

const hashed=await bcrypt.hash(password,10);

const user=await User.create({

name,
email,
password:hashed

});

const token=jwt.sign(

{id:user._id},

process.env.JWT_SECRET,

{expiresIn:"1d"}

);



res.status(201).json({
token
,

user:{

id:user._id,

name:user.name,

email:user.email

}

});

}catch(err){

next(err);

}

}


export const login = async (req,res,next)=>{

try{

const{email,password}=req.body;

const user=await User.findOne({email});

if(!user)
return res.status(401).json({message:"Invalid credentials"});

const match=await bcrypt.compare(password,user.password);

if(!match)
return res.status(401).json({message:"Invalid credentials"});

const token=jwt.sign(

{id:user._id},

process.env.JWT_SECRET,

{expiresIn:"1d"}

);

res.json({

token,

user:{

id:user._id,

name:user.name,

email:user.email

}

});

}catch(err){

next(err);

}

}

export const getProfile = async (req, res) => {

    res.json(req.user);

};