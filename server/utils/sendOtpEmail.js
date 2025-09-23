//nodemailer configuration
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();

const sendOTP = async(email, otp)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
    });

    await transporter.sendMail({
    from: `"FlowWell" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'OTP Verification Process',
    html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <h2 style="color: #333; text-align: center;">FlowWell OTP Verification</h2>
                <p style="font-size: 16px; color: #555;">Hi,</p>
                <p style="font-size: 16px; color: #555;">
                Use the following One-Time Password (OTP) to complete your verification process. The code is valid for <strong>1 minute</strong>.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; font-size: 28px; letter-spacing: 8px; font-weight: bold; color: #007bff;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #999; text-align: center;">
                If you didnot request this, please ignore this email.
                </p>
                <p style="font-size: 14px; color: #ccc; text-align: center; margin-top: 30px;">- FlowWell Team</p>
                <p>Developed by <a href="https://www.linkedin.com/in/rahulqwe/" target="_blank" style="color: #0077b5; text-decoration: none;">Rahul</a></p>
            </div>
        </div>
    `
    });
};

export default sendOTP;