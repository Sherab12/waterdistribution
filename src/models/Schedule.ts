import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    fieldId: { type: mongoose.Schema.Types.ObjectId, ref: "Field", required: true },
    startTime: { type: Date, required: true },     // When to start irrigation
    endTime: { type: Date, required: true },       // When to stop irrigation
    amountLiters: { type: Number, required: true }, // Optional — can still keep this
    status: { type: String, enum: ["pending", "completed"], default: "pending" }
}, { timestamps: true }); // Optional: adds createdAt and updatedAt

export default mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);
