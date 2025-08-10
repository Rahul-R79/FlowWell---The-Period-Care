import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET;

const ProtectedRoute = (req, res, next)=>{
    const token = req.cookies['access-token'];

    if(!token) return res.status(401).json({message: 'Access denied'});

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({message: 'Access denied: Invalid or expired token'});
    }
}

export default ProtectedRoute;