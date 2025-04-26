import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String },
    description: { type: String },
});

export default mongoose.models.Source || mongoose.model("Source", sourceSchema);
