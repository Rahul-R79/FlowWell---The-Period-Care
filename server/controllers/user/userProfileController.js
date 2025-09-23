import User from "../../models/User.js";
import cloudinary from "../../utils/cloudinary.js";

//update user profile
export const updateProfile = async (req, res) => {
    const { name, phone } = req.body;
    const userId = req.user.id;

    try {
        let avatarUrl;

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "userProfile" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });

            avatarUrl = result.secure_url;
        }

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                phone,
                ...(avatarUrl && {avatar: avatarUrl})
            },
            { new: true }
        );
        res.status(200).json({ user: updateUser });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

