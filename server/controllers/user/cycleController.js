//userCycleController
import Cycle from "../../models/Cycle.js";

/**
 * @function saveCycleInfo
 * @description Saves or updates the user's menstrual cycle information and calculates the next period date.
 * @expectedInput req.body: { lastPeriodDate, cycleLength }, req.user.id
 * @expectedOutput { cycle } or { message: "internal server error" }
 */
export const saveCycleInfo = async (req, res) => {
    const { lastPeriodDate, cycleLength } = req.body;

    try {
        const start = new Date(lastPeriodDate);

        let nextPeriodDate = new Date(start);
        nextPeriodDate.setDate(
            nextPeriodDate.getDate() + parseInt(cycleLength)
        );

        const today = new Date();
        if (today >= nextPeriodDate) {
            start = new Date(nextPeriodDate);
            nextPeriodDate = new Date(start);
            nextPeriodDate.setDate(start.getDate() + parseInt(cycleLength));
        }

        const cycle = await Cycle.findOneAndUpdate(
            { userId: req.user.id },
            { lastPeriodDate, cycleLength, nextPeriodDate },
            { new: true, upsert: true }
        );

        res.status(200).json({ cycle });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

/**
 * @function getCycleInfo
 * @description Retrieves the user's menstrual cycle information.
 * @expectedInput req.user.id
 * @expectedOutput { cycle } or { message: "No cycle data found" } or { message: "Server error" }
 */
export const getCycleInfo = async (req, res) => {
    try {
        const cycle = await Cycle.findOne({ userId: req.user.id });
        if (!cycle) {
            return res.status(404).json({ message: "No cycle data found" });
        }
        res.json({ cycle });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
