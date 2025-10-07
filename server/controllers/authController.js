//admin and user authController
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/jwt.js";
import crypto from "crypto";
import redisClient from "../utils/redis.js";
import sendOTP from "../utils/sendOtpEmail.js";
import Admin from "../models/Admin.js";
import Referral from "../models/Referral.js";
import Coupon from "../models/Coupon.js";

/**
 * @function SignUp
 * @description Handles user registration and sends OTP for email verification.
 * @expectedInput { name: String, email: String, password: String, referralCode?: String }
 * @expectedOutput { message: "OTP send to mail" } or { errors: [{ field, message }] }
 */
export const SignUp = async (req, res) => {
    const { name, email, password, referralCode } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                errors: [{ field: "general", message: "Email already exist" }],
            });
        }

        if (referralCode) {
            const referral = await Referral.findOne({
                couponCode: referralCode,
            });

            if (!referral) {
                return res.status(400).json({
                    errors: [
                        {
                            field: "referralCode",
                            message: "Invalid referral code",
                        },
                    ],
                });
            }
        }

        const hashed = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(1000, 9999).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        const user = JSON.stringify({
            name,
            email,
            password: hashed,
            referralCode,
            otp: hashedOtp,
        });

        await redisClient.set(`otp:${email}`, user, { EX: 300 });

        await sendOTP(email, otp);
        return res.status(200).json({ message: "OTP send to mail" });
    } catch (err) {
        return res
            .status(500)
            .json({ message: "SignUp failed Please try again" });
    }
};

/**
 * @function verifyOTP
 * @description Verifies OTP and creates a new user account.
 * @expectedInput { email: String, otp: String }
 * @expectedOutput { message: "User created successfully", user } or { errors: [{ field, message }] }
 */
export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const redisData = await redisClient.get(`otp:${email}`);
        if (!redisData) {
            return res.status(400).json({
                errors: [
                    {
                        field: "general",
                        message: "OTP is expired please signup again",
                    },
                ],
            });
        }

        const {
            name,
            password,
            otp: hashedOtp,
            referralCode,
        } = JSON.parse(redisData);

        const match = await bcrypt.compare(otp, hashedOtp);
        if (!match) {
            return res.status(400).json({
                errors: [{ field: "general", message: "Incorrect OTP" }],
            });
        }

        await redisClient.del(`otp:${email}`);
        const user = await User.create({ name, email, password });

        if (referralCode) {
            const referral = await Referral.findOne({
                couponCode: referralCode,
            });

            if (referral) {
                referral.usages.push({ usedUser: user._id });
                await referral.save();

                await Coupon.create({
                    couponName: `REFERRAL-${user._id
                        .toString()
                        .toUpperCase()
                        .slice(-4)}`,
                    couponCode: crypto
                        .randomBytes(4)
                        .toString("hex")
                        .toUpperCase(),
                    minPurchaseAmount: 1000,
                    usageLimit: 1,
                    couponType: "percentage",
                    discountValue: 50,
                    expirationDate: new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000
                    ),
                    referral: referral._id,
                });
            }
        }

        return res
            .status(201)
            .json({ message: "User created successfully", user });
    } catch (err) {
        return res.status(500).json({ message: "otp verfication failed" });
    }
};

/**
 * @function resendOTP
 * @description Resends the signup OTP if it's not expired.
 * @expectedInput { email: String }
 * @expectedOutput { message: "OTP resended successfully" } or { errors: [{ field, message }] }
 */
export const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const redisData = await redisClient.get(`otp:${email}`);
        if (!redisData) {
            return res.status(400).json({
                errors: [
                    {
                        field: "general",
                        message: "OTP expired Please signup again",
                    },
                ],
            });
        }

        const { name, password } = JSON.parse(redisData);

        const otp = crypto.randomInt(1000, 9999).toString();
        const hashedOTP = await bcrypt.hash(otp, 10);

        const updatedUser = JSON.stringify({ name, password, otp: hashedOTP });
        await redisClient.set(`otp:${email}`, updatedUser, { EX: 300 });

        await sendOTP(email, otp);
        return res.status(200).json({ message: "OTP resended successfully" });
    } catch (err) {
        return res
            .status(500)
            .json({ message: "resend failed please try again" });
    }
};

/**
 * @function SignIn
 * @description Authenticates user and issues JWT token.
 * @expectedInput { email: String, password: String }
 * @expectedOutput { success: true, message: "login successful", user } or { errors: [{ field, message }] }
 */
export const SignIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                errors: [
                    {
                        field: "general",
                        message: "Invalid Email or Password",
                    },
                ],
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                errors: [
                    {
                        field: "general",
                        message: "Your account is blocked. Contact admin",
                    },
                ],
            });
        }
        const token = generateToken({ id: user._id, role: "user" });
        const { password: hashedPassword, ...rest } = user._doc;
        res.cookie("user-access-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "Lax" : "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            message: "login successful",
            user: { ...rest, role: "user" },
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @function forgotPassword
 * @description Sends OTP to user email for password reset.
 * @expectedInput { email: String }
 * @expectedOutput { message: "OTP send to your email for password reset" } or { errors: [{ field, message }] }
 */
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                errors: [{ field: "email", message: "User not found" }],
            });
        }

        const otp = crypto.randomInt(1000, 9999).toString();
        const hashedOTP = await bcrypt.hash(otp, 10);

        await redisClient.set(
            `otp:forgot:${email}`,
            JSON.stringify({ otp: hashedOTP }),
            { EX: 300 }
        );

        await sendOTP(email, otp, "Forgot Password");

        res.status(200).json({
            message: "OTP send to your email for password reset",
        });
    } catch (err) {
        return res.status(500).json({ message: "something went wroung" });
    }
};

/**
 * @function verifyForgotOTP
 * @description Verifies OTP sent for password reset.
 * @expectedInput { email: String, otp: String }
 * @expectedOutput { message: "OTP verified" } or { errors: [{ field, message }] }
 */
export const verifyForgotOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const redisData = await redisClient.get(`otp:forgot:${email}`);
        if (!redisData) {
            return res.status(400).json({
                errors: [{ field: "general", message: "OTP expired" }],
            });
        }

        const { otp: hashedOTP } = JSON.parse(redisData);
        const isMatch = await bcrypt.compare(otp, hashedOTP);

        if (!isMatch) {
            return res.status(400).json({
                errors: [{ field: "general", message: "Incorrect OTP" }],
            });
        }

        await redisClient.del(`otp:forgot:${email}`);

        return res.status(200).json({ message: "OTP verified" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @function resendForgotOTP
 * @description Resends OTP for password reset.
 * @expectedInput { email: String }
 * @expectedOutput { message: "OTP send" } or { errors: [{ field, message }] }
 */
export const resendForgotOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const redisData = await redisClient.get(`otp:forgot:${email}`);

        if (!redisData) {
            return res.status(400).json({
                errors: [
                    {
                        field: "general",
                        message:
                            "OTP expired. Please request forgot password again",
                    },
                ],
            });
        }

        const otp = crypto.randomInt(1000, 9999).toString();
        const hashedOTP = await bcrypt.hash(otp, 10);

        await redisClient.set(
            `otp:forgot:${email}`,
            JSON.stringify({ otp: hashedOTP }),
            { EX: 300 }
        );
        await sendOTP(email, otp);

        return res.status(200).json({ message: "OTP send" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @function forgotResetPassword
 * @description Resets user password after verifying OTP.
 * @expectedInput { email: String, newPassword: String }
 * @expectedOutput { message: "password reset successfully" } or { errors: [{ field, message }] }
 */
export const forgotResetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                errors: [{ field: "general", message: "user not found" }],
            });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ email }, { password: hashed });

        res.status(200).json({ message: "password reset successfully" });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function googleAuthCallback
 * @description Handles Google OAuth login and sets JWT cookie.
 * @expectedInput req.user (from Google Passport)
 * @expectedOutput Redirects to CLIENT_URL or returns error message.
 */
export const googleAuthCallback = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "google auth failed" });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "user not found" });

        if (user.isBlocked) {
            return res.status(403).json({
                message: "Your account has been blocked please contact admin",
            });
        }

        const token = generateToken({ id: req.user._id, role: "user" });

        res.cookie("user-access-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "Lax" : "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(process.env.CLIENT_URL);
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function userauthMe
 * @description Returns the authenticated user's data.
 * @expectedInput req.user.id (from JWT)
 * @expectedOutput { user } or { message: "user not found" }
 */
export const userauthMe = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        res.json({ user });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function adminSignin
 * @description Authenticates admin and issues JWT token.
 * @expectedInput { email: String, password: String }
 * @expectedOutput { message: "admin signed in successfully", admin } or { errors: [{ field, message }] }
 */
export const adminSignin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({
                errors: [{ field: "general", message: "Invalid Credentials" }],
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({
                errors: [{ field: "general", message: "Invalid Credentials" }],
            });
        }

        const token = generateToken({ id: admin._id, role: "admin" });
        const { password: pwd, ...rest } = admin._doc;

        res.cookie("admin-access-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "Lax" : "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "admin signed in successfully",
            admin: { ...rest, role: "admin" },
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @function adminauthMe
 * @description Returns the authenticated admin's data.
 * @expectedInput req.admin.id (from JWT)
 * @expectedOutput { admin } or { message: "admin not found" }
 */
export const adminauthMe = async (req, res) => {
    try {
        const adminId = req.admin.id;

        const admin = await Admin.findById(adminId).select("-password");

        if (!admin) {
            return res.status(404).json({ message: "admin not found" });
        }

        res.json({ admin });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function adminLogout
 * @description Logs out admin by clearing cookie.
 * @expectedInput none
 * @expectedOutput { message: "admin logged out successfully" }
 */
export const adminLogout = (req, res) => {
    try {
        res.clearCookie("admin-access-token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "Lax" : "Strict",
        });
        return res
            .status(200)
            .json({ message: "admin logged out successfully" });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function userLogout
 * @description Logs out user by clearing cookie.
 * @expectedInput none
 * @expectedOutput { message: "user logged out successfully" }
 */
export const userLogout = (req, res) => {
    try {
        res.clearCookie("user-access-token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "Lax" : "Strict",
        });
        return res
            .status(200)
            .json({ message: "user logged out successfully" });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function changePassword
 * @description Changes user password after verifying old one.
 * @expectedInput { oldPassword: String, newPassword: String }
 * @expectedOutput { message: "password changed successfully" } or { errors: [{ field, message }] }
 */
export const changePassword = async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                errors: [
                    {
                        field: "oldPassword",
                        message: "Old password is incorrect",
                    },
                ],
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({
                errors: [
                    {
                        field: "newPassword",
                        message:
                            "New password cannot be the same as old password",
                    },
                ],
            });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        user.password = hashed;

        await user.save();

        return res
            .status(200)
            .json({ message: "password changed successfully" });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function deleteAccount
 * @description Deletes a user account by ID.
 * @expectedInput req.params.id (User ID)
 * @expectedOutput { user } or { message: "user not found" }
 */
export const deleteAccount = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
