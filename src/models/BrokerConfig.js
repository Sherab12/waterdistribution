import mongoose from "mongoose";

const brokerConfigSchema = new mongoose.Schema({
    host: { type: String, required: true },
    port: { type: Number, required: true },
    username: { type: String },
    password: { type: String },
    baseTopic: { type: String },
}, { timestamps: true });

const BrokerConfig = mongoose.models.BrokerConfig || mongoose.model("BrokerConfig", brokerConfigSchema);

export default BrokerConfig;
