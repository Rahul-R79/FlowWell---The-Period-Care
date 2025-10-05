//mail for period reminder
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "../config/logger.js";
dotenv.config();

const sendPeriodReminder = async (email, nextPeriodDate) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"FlowWell" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Your Upcoming Period Reminder",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #d63384; text-align: center;">FlowWell Period Reminder</h2>
                        <p style="font-size: 16px; color: #555;">Hi there,</p>
                        <p style="font-size: 16px; color: #555;">
                            This is a friendly reminder that your next period is expected to start on:
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="display: inline-block; font-size: 22px; font-weight: bold; color: #d63384;">${nextPeriodDate}</span>
                        </div>
                        <p style="font-size: 16px; color: #555;">
                            Stay prepared and track your cycle easily with FlowWell and purchase your favourite product asap!
                        </p>
                        <p style="text-align: center; margin-top: 30px;">
                            <a href="https://flowwell.online" target="_blank" style="background-color: #007bff; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                                Visit FlowWell Website
                            </a>
                        </p>
                        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 30px;">
                            If you did not subscribe to these reminders, please ignore this email.
                        </p>
                        <p style="font-size: 14px; color: #ccc; text-align: center;">- FlowWell Team</p>
                        <p style="text-align: center;">Developed by <a href="https://www.linkedin.com/in/rahulqwe/" target="_blank" style="color: #0077b5; text-decoration: none;">Rahul</a></p>
                    </div>
                </div>
            `,
        });
    } catch (error) {
        logger.error('sendPeriodReminder err' + error);
    }
};

export default sendPeriodReminder;
