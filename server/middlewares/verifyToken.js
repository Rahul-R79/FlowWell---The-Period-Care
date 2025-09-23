//verify jwt tokens for protect the routes
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const userProtectedRoute = async (req, res, next)=>{
    const token = req.cookies['user-access-token'];

    if(!token) return res.status(401).json({message: 'Access denied'});

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded.role !== 'user'){
            return res.status(403).json({message: 'Forbidden: Users only'})
        }

        const user = await User.findById(decoded.id);
        if(!user) return res.status(404).json({message: 'user not found'});

        if(user.isBlocked){
            res.clearCookie('user-access-token');
            return res.status(403).json({message: 'user is blocked'});
        }
        
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({message: 'Access denied: Invalid or expired token'});
    }
}

export const adminProtectedRoute = (req, res, next)=>{
    const token = req.cookies['admin-access-token'];

    if(!token) return res.status(401).json({message: 'Access denied'});

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded.role !== 'admin'){
            return res.status(403).json({message: 'Forbidden: Admins only'});
        }
        req.admin = decoded
        next();
    }catch(err){
        return res.status(401).json({message: 'Access denied: Invalid or expired token'});
    }
}