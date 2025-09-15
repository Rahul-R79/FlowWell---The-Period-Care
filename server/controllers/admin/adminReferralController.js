import Referral from "../../models/Referral.js";

export const getReferrals = async(req, res)=>{
    try{
        const referrals = await Referral.find()
        .populate("generatedUser", "name")
        .populate("usages.usedUser", "name")

        res.status(200).json({referrals});
    }catch(err){
        return res.status(500).json({message: 'internal server error'});
    }
}