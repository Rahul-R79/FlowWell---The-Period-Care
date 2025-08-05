import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/jwt.js';

export const SignUp = async(req, res)=>{
    const {name, email, password} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'Email already in use'});
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashed});
        return res.status(201).json({message: 'User created Successfully', user});
    }catch(err){
        return res.status(500).json({message: 'SignUp failed Please try again'});
    }
}

export const SignIn = async(req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({error: 'Invalid Credentials'});
        }
        const token = generateToken({id: user._id});
        res.cookie('access-token', token, {
            httponly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({success: true, message: 'login successful', token});
    }catch(err){
        res.status(500).json({ message: 'Internal server error' });
    }
}