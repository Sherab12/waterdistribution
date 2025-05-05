import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema({
    sensorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sensor",
        required: true,
        unique: true // Only one latest entry per sensor
    },
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 1800 // ⏳ Deletes the document 1 hour after this timestamp
    },
    value: {
        type: Number,
        required: true
    }
});

export default mongoose.models.SensorData || mongoose.model("SensorData", sensorDataSchema);
