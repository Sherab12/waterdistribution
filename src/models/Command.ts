import mongoose from "mongoose";

const commandSchema = new mongoose.Schema({
    fieldId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Field", 
        required: true 
    },
    command: { 
        type: String, 
        enum: ["open", "close", "closeall", "openall"], // add closeall here
        required: true 
    }, 
    status: { 
        type: String, 
        enum: ["pending", "executed", "failed"], 
        default: "executed" 
    }
    }, { timestamps: true }
);

export default mongoose.models.Command || mongoose.model("Command", commandSchema);
