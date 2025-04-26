import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: Number, required: true }, // in square km
    sourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Source", required: true }
});

export default mongoose.models.Field || mongoose.model("Field", fieldSchema);
