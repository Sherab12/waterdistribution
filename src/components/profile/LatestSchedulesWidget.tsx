"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation"; // Import useRouter for routing

interface Schedule {
    _id: string;
    fieldId: {
        name: string;
    };
    startTime: string;
    endTime: string;
    amountLiters: number;
    status: string;
}

export default function LatestSchedulesWidget() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // Initialize useRouter

    useEffect(() => {
        async function fetchSchedules() {
        try {
            const res = await fetch("/api/schedules");
            const data = await res.json();
            const sorted = data
            .sort((a: Schedule, b: Schedule) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
            .slice(0, 4);
            setSchedules(sorted);
        } catch (err) {
            console.error("Failed to load schedules", err);
        } finally {
            setLoading(false);
        }
        }

        fetchSchedules();
    }, []);

    // Navigate to the general schedule page
    const handleViewAllSchedules = () => {
        router.push("/schedule"); // Navigate to the actual schedule page
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-blue-500" />
            Latest Schedules
            </h2>
            {/* Button aligned to the right */}
            <button
            onClick={handleViewAllSchedules}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            >
            View All Schedules
            </button>
        </div>

        {loading ? (
            <p className="text-gray-500">Loading schedules...</p>
        ) : schedules.length === 0 ? (
            <p className="text-gray-500">No schedules available.</p>
        ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                <tr>
                    <th className="p-3 text-left">Field</th>
                    <th className="p-3 text-left">Start</th>
                    <th className="p-3 text-left">End</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Status</th>
                </tr>
                </thead>
                <tbody>
                {schedules.map((schedule) => (
                    <tr key={schedule._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{schedule.fieldId.name}</td>
                    <td className="p-3">{format(new Date(schedule.startTime), "yyyy-MM-dd HH:mm")}</td>
                    <td className="p-3">{format(new Date(schedule.endTime), "yyyy-MM-dd HH:mm")}</td>
                    <td className="p-3">{schedule.amountLiters} L</td>
                    <td className="p-3">
                        <span
                        className={`px-2 py-1 rounded text-xs ${
                            schedule.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                        >
                        {schedule.status}
                        </span>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
}
