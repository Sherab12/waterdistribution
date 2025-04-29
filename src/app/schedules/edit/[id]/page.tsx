"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Navbar from "src/components/navbar";

interface Field {
    _id: string;
    name: string;
}

export default function EditSchedulePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [fields, setFields] = useState<Field[]>([]);
    const [fieldId, setFieldId] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [amountLiters, setAmountLiters] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Schedule ID:", id);  // Log the ID to ensure it’s correct
        if (id) {
        fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
        const [fieldsRes, scheduleRes] = await Promise.all([
            axios.get("/api/fields"),
            axios.get(`/api/schedules/${id}`),
        ]);

        console.log("Fields Data:", fieldsRes.data);  // Check fields data
        console.log("Schedule Data:", scheduleRes.data);  // Check schedule data

        setFields(fieldsRes.data);

        const data = scheduleRes.data;
        const fieldIdResolved = typeof data.fieldId === "object" ? data.fieldId._id : data.fieldId;

        setFieldId(fieldIdResolved);
        setStartTime(data.startTime.slice(0, 16)); // Trim the string for datetime-local input
        setEndTime(data.endTime.slice(0, 16));
        setAmountLiters(data.amountLiters.toString());
        } catch (err) {
        console.error("Failed to fetch data:", err);
        } finally {
        setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
        await axios.patch(`/api/schedules/${id}`, {
            fieldId,
            startTime,
            endTime,
            amountLiters: Number(amountLiters),
        });
        router.push("/schedules");
        } catch (err) {
        console.error("Failed to update schedule:", err);
        }
    };

    if (loading) {
        return (
        <div className="flex">
            <Navbar activePage="schedules" />
            <main className="flex-1 px-8 py-6 pl-72 bg-white min-h-screen">
            <p className="text-gray-600">Loading schedule...</p>
            </main>
        </div>
        );
    }

    return (
        <div className="flex">
        <Navbar activePage="schedules" />
        <main className="flex-1 px-8 py-6 pl-72 bg-white min-h-screen">
            <h1 className="text-xl font-semibold mb-2">Edit Schedule</h1>
            <p className="text-gray-600 text-sm mb-4">Update the details of the scheduled irrigation.</p>

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
                {/* Update button first, then Cancel button */}
                <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                Update Schedule
                </button>
                <button
                type="button"
                onClick={() => router.push("/schedules")} // Navigate back on cancel
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
