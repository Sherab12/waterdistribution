"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "src/components/navbar";
import { DateTime } from "luxon";

interface Field {
    _id: string;
    name: string;
}

export default function NewSchedulePage() {
    const router = useRouter();
    const [fields, setFields] = useState<Field[]>([]);
    const [fieldId, setFieldId] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [amountLiters, setAmountLiters] = useState("");

    useEffect(() => {
        fetchFields();
    }, []);

    const fetchFields = async () => {
        try {
        const res = await axios.get("/api/fields");
        setFields(res.data);
        } catch (err) {
        console.error("Failed to fetch fields:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            const start = DateTime.fromISO(startTime, { zone: 'local' })
                .setZone("Asia/Thimphu")
                .toFormat("yyyy-MM-dd'T'HH:mm:ssZZ");
    
            const end = DateTime.fromISO(endTime, { zone: 'local' })
                .setZone("Asia/Thimphu")
                .toFormat("yyyy-MM-dd'T'HH:mm:ssZZ");
    
            await axios.post("/api/schedules", {
                fieldId,
                startTime: start, // ex: 2025-05-01T16:00:00+06:00
                endTime: end,
                amountLiters: Number(amountLiters),
            });
    
            router.push("/schedules");
        } catch (err) {
            console.error("Failed to create schedule:", err);
        }
    };
    
    
    

    const handleCancel = () => {
        router.push("/schedules");
    };

    return (
        <div className="flex">
        <Navbar activePage="schedules" />
        <main className="flex-1 px-8 py-6 pl-72 bg-white min-h-screen">
            <h1 className="text-xl font-semibold mb-2">Add New Schedule</h1>
            <p className="text-gray-600 text-sm mb-4">Create a schedule for automated irrigation.</p>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-xl">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Field</label>
                <select
                value={fieldId}
                onChange={(e) => setFieldId(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                <option value="">Select a field</option>
                {fields.map((field) => (
                    <option key={field._id} value={field._id}>
                    {field.name}
                    </option>
                ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Water Amount (Liters)</label>
                <input
                type="number"
                min="0"
                value={amountLiters}
                onChange={(e) => setAmountLiters(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
            </div>

            <div className="flex justify-end gap-4">
                <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                Create Schedule
                </button>
                <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                >
                Cancel
                </button>
            </div>
            </form>
        </main>
        </div>
    );
}
