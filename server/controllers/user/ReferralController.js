//userReferralController
import Referral from "../../models/Referral.js";
import crypto from "crypto";

/**
 * @function getReferralCode
 * @description Retrieves the referral code for the logged-in user. Generates a new code if one doesn't exist.
 * @expectedInput req.user.id
 * @expectedOutput { referral } or { message: "Internal server error" }
 */
export const getReferralCode = async (req, res) => {
    try {
        let referral = await Referral.findOne({ generatedUser: req.user.id });

        if (!referral) {
            const generateCoupon = crypto
                .randomBytes(4)
                .toString("hex")
                .toUpperCase();

            referral = await Referral.create({
                generatedUser: req.user.id,
                couponCode: generateCoupon,
            });
        }

        return res.status(200).json({ referral });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
