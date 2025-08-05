import jwt from 'jsonwebtoken';

const generateToken = (payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET, 
    {expiresIn: process.env.JWT_EXPIRE});
}

export default generateToken;