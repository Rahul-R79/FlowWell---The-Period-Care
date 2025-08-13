import User from "../../models/User.js";

export const getAllUsers = async(req, res)=>{
    try{
        const users = await User.find().select("-password");
        res.status(200).json(users);
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





