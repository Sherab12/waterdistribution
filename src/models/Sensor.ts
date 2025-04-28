import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema(
    {
        fieldId: { type: mongoose.Schema.Types.ObjectId, ref: "Field", required: true },
        type: { type: String, enum: ["flow", "pressure", "level"] },
        topic: { type: String, required: true },
    },
    { timestamps: true } // ✅ ADD THIS LINE
);

export default mongoose.models.Sensor || mongoose.model("Sensor", sensorSchema);
