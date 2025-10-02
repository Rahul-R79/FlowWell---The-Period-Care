import mongoose from "mongoose";

const cycleSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lastPeriodDate: {
            type: Date,
            required: true,
        },
        cycleLength: {
            type: Number,
            default: 28,
        },
        nextPeriodDate: {
            type: Date,
        },
        lastNotifiedDate: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Cycle", cycleSchema);
