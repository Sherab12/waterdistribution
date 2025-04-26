import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema({
    sensorId: { type: mongoose.Schema.Types.ObjectId, ref: "Sensor", required: true },
    timestamp: { type: Date, default: Date.now },
    value: { type: Number, required: true }
});

export default mongoose.models.SensorData || mongoose.model("SensorData", sensorDataSchema);
