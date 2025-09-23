import Referral from "../../models/Referral.js";
import crypto from 'crypto';

//get refferal code
export const getReferralCode  = async(req, res)=>{
    try{
        let referral = await Referral.findOne({generatedUser: req.user.id});

        if(!referral){
            const generateCoupon = crypto.randomBytes(4)
                .toString('hex')
                .toUpperCase()

            referral = await Referral.create({
                generatedUser: req.user.id,
                couponCode: generateCoupon
            })
        }

        return res.status(200).json({referral});
    }catch(err){
        return res.status(500).json({message: 'Internal server error'});
    }
}