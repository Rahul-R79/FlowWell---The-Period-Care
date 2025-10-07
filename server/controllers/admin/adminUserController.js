//adminUserController
import User from "../../models/User.js";

/**
 * @function getAllUsers
 * @description Retrieves a paginated list of users with optional search by name or email.
 * @expectedInput req.query: { page?: number, limit?: number, search?: string }
 * @expectedOutput { users, currentPage, totalPages, totalUsers } or { message: "server error" }
 */
export const getAllUsers = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const query = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      { email: { $regex: search, $options: "i" } },
                  ],
              }
            : {};

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        const users = await User.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-password");
        res.status(200).json({
            users,
            currentPage: page,
            totalPages,
            totalUsers,
        });
    } catch (err) {
        res.status(500).json({ message: "server error" });
    }
};

/**
 * @function deleteUser
 * @description Deletes a user by ID.
 * @expectedInput req.params: { userId }
 * @expectedOutput { message: "user deleted successfully" } or { message: "user not found" }
 */
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "user deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function blockUser
 * @description Blocks a user by setting isBlocked to true.
 * @expectedInput req.params: { userId }
 * @expectedOutput { message: "user blocked successfully", user } or { message: "user not found" }
 */
export const blockUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(
            userId,
            { isBlocked: true },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "user not found" });

        res.status(200).json({ message: "user blocked successfully", user });
    } catch (err) {
        res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function unblockUser
 * @description Unblocks a user by setting isBlocked to false.
 * @expectedInput req.params: { userId }
 * @expectedOutput { message: "user unblocked successfully", user } or { message: "user not found" }
 */
export const unblockUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(
            userId,
            { isBlocked: false },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "user not found" });

        res.status(200).json({ message: "user unblocked successfully", user });
    } catch (err) {
        res.status(500).json({ message: "internal server error" });
    }
};
