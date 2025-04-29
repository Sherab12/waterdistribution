"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "../../../components/navbar";
import { useRouter } from "next/navigation"; // <-- import router
import { motion } from "framer-motion";

interface Field {
    _id: string;
    name: string;
    valves: Valve[];
}

interface Valve {
    _id: string;
    topic: string;
}

export default function AddCommandPage() {
    const router = useRouter(); // <-- initialize router
    const [fields, setFields] = useState<Field[]>([]);
    const [selectedFieldId, setSelectedFieldId] = useState<string>("");
    const [selectedValveId, setSelectedValveId] = useState<string>("");
    const [commandType, setCommandType] = useState<"open" | "close">("close");


    useEffect(() => {
        fetchFields();
    }, []);

    const fetchFields = async () => {
        try {
        const res = await axios.get("/api/fields-with-valves");
        setFields(res.data);
        } catch (err) {
        console.error("Error fetching fields:", err);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFieldId || !selectedValveId || !commandType) {
        toast.error("Please complete all selections.");
        return;
        }

        try {
            await axios.post("/api/command", {
                fieldId: selectedFieldId,
                command: commandType,
            });
            

        toast.success("Command sent successfully!");
        router.push("/command"); // <-- navigate after success if you want
        } catch (err) {
        console.error("Error sending command:", err);
        toast.error("Failed to send command.");
        }
    };

    const handleCancel = () => {
        router.push("/command"); // <-- Go back to Command page
    };

    const selectedField = fields.find((f) => f._id === selectedFieldId);

    return (
        <div className="flex">
        <Navbar activePage="command-center" />

        <div className="flex-1 p-6 pl-72">
            <h1 className="text-xl font-bold mb-6">Add New Command</h1>

            <div className="bg-white p-6 rounded-lg shadow space-y-6 max-w-2xl">

            {/* Field Selection */}
            <div>
                <label className="block mb-2 font-semibold">Select Field:</label>
                <select
                value={selectedFieldId}
                onChange={(e) => {
                    const fieldId = e.target.value;
                    setSelectedFieldId(fieldId);

                    const field = fields.find((f) => f._id === fieldId);
                    if (field && field.valves.length > 0) {
                    setSelectedValveId(field.valves[0]._id);
                    } else {
                    setSelectedValveId("");
                    }
                }}
                className="border p-2 rounded w-full"
                >
                <option value="">-- Select a Field --</option>
                {fields.map((field) => (
                    <option key={field._id} value={field._id}>
                    {field.name}
                    </option>
                ))}
                </select>
            </div>

            {/* Valve Display */}
            {selectedField && (
                <div>
                <label className="block mb-2 font-semibold">Valve:</label>
                {selectedField.valves.length > 0 ? (
                    <div className="p-2 border rounded bg-gray-100">
                    {selectedField.valves[0].topic}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No valve found for this field.</p>
                )}
                </div>
            )}

            {/* Command Type Toggle */}
            <div>
                <label className="block mb-2 font-semibold">Select Action:</label>

                <div className="relative flex bg-gray-200 rounded-full p-1 w-60 mx-auto overflow-hidden">
                {/* Buttons with animated background */}
                {["open", "close"].map((type) => (
                    <div key={type} className="relative w-1/2 text-center">
                    {commandType === type && (
                        <motion.div
                        layoutId="toggleBackground"
                        className={`absolute inset-0 rounded-full ${type === "open" ? "bg-green-500" : "bg-red-500 "}`}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    <button
                        onClick={() => setCommandType(type as "open" | "close")}
                        className="relative z-10 w-full h-10 font-semibold"
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                    </div>
                ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-6">
                <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded"
                disabled={!selectedFieldId || !selectedValveId || !commandType}
                >
                Send
                </button>

                <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded"
                >
                Cancel
                </button>
            </div>

            </div>
        </div>
        </div>
    );
}
