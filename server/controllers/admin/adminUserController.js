import User from "../../models/User.js";

export const getAllUsers = async(req, res)=>{
    try{
        let {page = 1, limit = 10, search = ""} = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const query = search ? {$or: [{name: {$regex: search, $options: 'i'}}, {email: {$regex: search, $options: 'i'}}]} : {};

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        const users = await User.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({createdAt: -1})
        .select("-password");
        res.status(200).json({users, currentPage: page, totalPages, totalUsers});
    }catch(err){
        res.status(500).json({message: 'server error'});
    }
}

export const deleteUser = async(req, res)=>{
    try{
        const {userId} = req.params;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: 'user not found'});
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({message: 'user deleted successfully'});
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}

export const blockUser = async(req, res)=>{
    try{
        const {userId} = req.params;
        const user = await User.findByIdAndUpdate(userId, {isBlocked: true}, {new: true});

        if(!user) return res.status(404).json({message: 'user not found'});

        res.status(200).json({message: 'user blocked successfully', user});
    }catch(err){
        res.status(500).json({message: 'internal server error'});
    }
}

export const unblockUser = async(req, res)=>{
    try{
        const {userId} = req.params;
        const user = await User.findByIdAndUpdate(userId, {isBlocked: false}, {new: true});

        if(!user) return res.status(404).json({message: 'user not found'});

        res.status(200).json({message: 'user unblocked successfully', user});
    }catch(err){
        console.log('unblock error', err.message);
        
        res.status(500).json({message: 'internal server error'});
    }
}
