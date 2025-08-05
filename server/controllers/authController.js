import bcrypt from 'bcryptjs';
import User from '../models/User.js';

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