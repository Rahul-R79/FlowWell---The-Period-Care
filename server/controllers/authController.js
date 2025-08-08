import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/jwt.js';
import crypto from 'crypto'
import redisClient from '../utils/redis.js';
import sendOTP from '../utils/sendOtpEmail.js';

export const SignUp = async(req, res)=>{
    const {name, email, password} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({errors: [{ field: 'general', message: 'Email already exist' }]});
        }
        const hashed = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(1000, 9999).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        const user = JSON.stringify({name, password: hashed, otp: hashedOtp})
        
        await redisClient.set(`otp:${email}`, user, {EX: 300});

        await sendOTP(email, otp);

        return res.status(200).json({message: 'OTP send to mail'});
    }catch(err){
        return res.status(500).json({message: 'SignUp failed Please try again'});
    }
}

export const verifyOTP = async(req, res)=>{
    const {email, otp} = req.body;

    try{
        const redisData = await redisClient.get(`otp:${email}`);
        if(!redisData){
            return res.status(400).json({errors: [{field: 'general', message: 'OTP is expired please signup again'}]});
        }

        const {name, password, otp: hashedOtp} = JSON.parse(redisData);

        const match = await bcrypt.compare(otp, hashedOtp);
        if(!match){
            return res.status(400).json({errors: [{field: 'general', message: 'Incorrect OTP'}]});
        }

        const user = await User.create({name, email, password});
        await redisClient.del(`otp:${email}`);
        return res.status(201).json({ message: 'User created successfully', user});
    }catch(err){
        return res.status(500).json({message: 'otp verfication failed'});
    }
}

export const resendOTP = async(req, res)=>{
    const {email} = req.body;

    try{
        const redisData = await redisClient.get(`otp:${email}`);
        if(!redisData){
            return res.status(400).json({errors: [{field: 'general', message: 'OTP expired Please signup again'}]});
        }

        const {name, password} = JSON.parse(redisData);

        const otp = crypto.randomInt(1000, 9999).toString();
        const hashedOTP = await bcrypt.hash(otp, 10);

        const updatedUser = JSON.stringify({name, password, otp: hashedOTP});
        await redisClient.set(`otp:${email}`, updatedUser, {EX: 300});

        await sendOTP(email, otp);
        return res.status(200).json({message: 'OTP resended successfully'});
    }catch(err){
        return res.status(500).json({message: 'resend failed please try again'});
    }
}

export const SignIn = async(req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email})
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({errors: [{field: 'general', message: 'Invalid Email or Password'}]});
        }
        const token = generateToken({id: user._id});
        const {password: hashedPassword, ...rest} = user._doc;
        res.cookie('access-token', token, {
            httponly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    res.status(200).json({success: true, message: 'login successful', user: rest});
    }catch(err){
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const forgotPassword = async(req, res)=>{
    const {email} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors: [{field: 'email', message: 'User not found'}]});
        }

        const otp = crypto.randomInt(1000, 9999).toString();
        const hashedOTP = await bcrypt.hash(otp, 10);

        await redisClient.set(`otp:forgot:${email}`, JSON.stringify({otp: hashedOTP}), {EX: 300});

        await sendOTP(email, otp, "Forgot Password");

        res.status(200).json({message: 'OTP send to your email for password reset'});
    }catch(err){
        return res.status(500).json({message: 'something went wroung'});
    }
}

export const verifyForgotOTP = async(req, res)=>{
    const {email, otp} = req.body;

    try{
        const redisData = await redisClient.get(`otp:forgot:${email}`);
        if(!redisData){
            return res.status(400).json({errors: [{field: 'general', message: 'OTP expired'}]});
        }

        const {otp: hashedOTP} = JSON.parse(redisData)
        const isMatch = await bcrypt.compare(otp, hashedOTP);

        if(!isMatch){
            return res.status(400).json({errors: [{field: 'general', message: 'Incorrect OTP'}]});
        }

        await redisClient.del(`otp:forgot:${email}`);

        return res.status(200).json({message: 'OTP verified'});
    }catch(err){
        return res.status(500).json({message: 'Internal server error'});
    }
}

export const resendForgotOTP = async(req, res)=>{
    const {email} = req.body;

    try{
        const redisData = await redisClient.get(`otp:forgot:${email}`);

        if(!redisData){
            return res.status(400).json({errors: [{field: 'general', message: 'OTP expired. Please request forgot password again'}]});
        }

        const otp = crypto.randomInt(1000, 9999).toString();
        const hashedOTP = await bcrypt.hash(otp, 10);

        await redisClient.set(`otp:forgot:${email}`,JSON.stringify({otp: hashedOTP}), {EX: 300});
        await sendOTP(email, otp);

        return res.status(200).json({message: 'OTP send'});
    }catch(err){
        return res.status(500).json({message: 'Internal server error'});
    }
}