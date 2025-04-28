import mongoose from "mongoose";

const valveSchema = new mongoose.Schema({
    fieldId: { type: mongoose.Schema.Types.ObjectId, ref: "Field", required: true },
    topic: { type: String, required: true }
}, { timestamps: true },
);

export default mongoose.models.Valve || mongoose.model("Valve", valveSchema);
