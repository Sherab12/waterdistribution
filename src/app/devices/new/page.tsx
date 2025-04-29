"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import Navbar from "src/components/navbar";

export default function NewSensorPage() {
    const router = useRouter();
    const [topic, setTopic] = useState(""); // Topic for the sensor
    const [sensorType, setSensorType] = useState(""); // Sensor Type (flow, pressure, level)
    const [fieldId, setFieldId] = useState(""); // Field ID
    const [fields, setFields] = useState([]); // Array of fields to select from

    useEffect(() => {
        // Fetch available fields for the dropdown (assuming /api/fields returns a list of fields)
        axios.get("/api/fields").then((response) => {
            setFields(response.data);
        }).catch((err) => {
            console.error("Error fetching fields:", err);
            toast.error("Failed to fetch fields.");
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Send the sensor data to the API
            await axios.post("/api/sensors", {
                fieldId, // The selected field ID (ObjectId reference)
                type: sensorType, // The selected sensor type (flow, pressure, level)
                topic, // The topic/name for the sensor
            });
            toast.success("Sensor created!");
            router.push("/devices"); // Redirect after successful creation
        } catch (err) {
            console.error(err);
            toast.error("Error creating sensor");
        }
    };
    

    return (
        <div className="flex">
            <Navbar activePage="sensors" />
            <main className="flex-1 p-8 ml-[250px]">
                <h1 className="text-xl font-semibold mb-6 text-gray-800">Add New Sensor</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                        <input
                            type="text"
                            placeholder="e.g. Temperature Sensor"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
                        <select
                            value={fieldId}
                            onChange={(e) => setFieldId(e.target.value)}
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a Field</option>
                            {fields.map((field: any) => (
                                <option key={field._id} value={field._id}>
                                    {field.name} {/* Assuming field object has a 'name' property */}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sensor Type</label>
                        <select
                            value={sensorType}
                            onChange={(e) => setSensorType(e.target.value)}
                            required
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Sensor Type</option>
                            <option value="flow">Flow</option>
                            <option value="pressure">Pressure</option>
                            <option value="level">Level</option>
                        </select>
                    </div>

                    <div className="flex gap-4 justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Save Sensor
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/devices")}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
