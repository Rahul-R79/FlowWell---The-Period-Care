//adminRefferalController
import Referral from "../../models/Referral.js";

/**
 * @function getReferrals
 * @description Retrieves all referrals along with populated user information.
 * @expectedInput req: Express request object (no specific query/body parameters required)
 * @expectedOutput res: JSON object containing all referrals with populated generatedUser and usages.usedUser names
 */
export const getReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find()
            .populate("generatedUser", "name")
            .populate("usages.usedUser", "name");

        res.status(200).json({ referrals });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
