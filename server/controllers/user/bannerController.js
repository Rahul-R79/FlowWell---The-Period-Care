//userBannerController
import Banner from "../../models/Banner.js";

/**
 * @function getUserBanner
 * @description Retrieves all active banners for users.
 * @expectedInput None
 * @expectedOutput { banner } or { message: "banner not found" } or { message: "internal server error" }
 */
export const getUserBanner = async (req, res) => {
    try {
        const banner = await Banner.find({
            isActive: true,
        });

        if (!banner) {
            return res.status(404).json({ message: "banner not found" });
        }

        res.status(200).json({ banner });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
