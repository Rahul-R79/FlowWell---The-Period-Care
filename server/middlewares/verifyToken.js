import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET;

export const userProtectedRoute = (req, res, next)=>{
    const token = req.cookies['access-token'];

    if(!token) return res.status(401).json({message: 'Access denied'});

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded.role !== 'user'){
            return res.status(403).json({message: 'Forbidden: Users only'})
        }
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({message: 'Access denied: Invalid or expired token'});
    }
}

export const adminProtectedRoute = (req, res, next)=>{
    const token = req.cookies['access-token'];

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