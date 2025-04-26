import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    fieldId: { type: mongoose.Schema.Types.ObjectId, ref: "Field", required: true },
    scheduledTime: { type: Date, required: true },
    amountLiters: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending" }
});

export default mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);
