//period reminder
import cron from "node-cron";
import Cycle from "../models/Cycle.js";
import sendPeriodReminder from "../utils/cycleMailer.js";
import logger from "./logger.js";

export const scheduleReminder = () => {
    cron.schedule("0 9 * * *", async () => {
        try {
            const today = new Date();
            const cycles = await Cycle.find({}).populate("userId", "email");

            for (const cycle of cycles) {
                if (!cycle.nextPeriodDate) continue;

                const nextPeriodDate = new Date(cycle.nextPeriodDate);
                const reminder = new Date(nextPeriodDate);
                reminder.setDate(nextPeriodDate.getDate() - 5);

                const isReminderDay =
                    today.toDateString() === reminder.toDateString();
                const alreadyNotified =
                    cycle.lastNotifiedDate &&
                    cycle.lastNotifiedDate.toDateString() ===
                        reminder.toDateString();

                if (isReminderDay && !alreadyNotified) {
                    await sendPeriodReminder(
                        cycle.userId.email,
                        nextPeriodDate
                    );
                    cycle.lastNotifiedDate = today;
                    await cycle.save();
                }
            }
        } catch (err) {
            logger.error("reminder err: " + err);
        }
    });
};
