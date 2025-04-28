import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String },
    description: { type: String },
}, { timestamps: true },
);

export default mongoose.models.Source || mongoose.model("Source", sourceSchema);
