"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../components/navbar";
import { format } from "date-fns";
import { Pencil, Trash2, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Field {
    _id: string;
    name: string;
}

interface Schedule {
    _id: string;
    fieldId: Field;
    startTime: string;
    endTime: string;
    amountLiters: number;
    status: "pending" | "completed";
}

export default function SchedulePage() {
    const router = useRouter();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
        const res = await axios.get("/api/schedules");
        setSchedules(res.data);
        } catch (error) {
        console.error("Failed to fetch schedules:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!scheduleToDelete) return;

        try {
        await axios.delete(`/api/schedules/${id}`);
        toast.success("Schedule deleted successfully");
        fetchSchedules();
        setDeleteModalOpen(false);  // Close the modal after deletion
        } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete schedule");
        }
    };

    const filteredSchedules = schedules.filter((s) => {
        const matchesSearch = s.fieldId?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex">
        <Navbar activePage="schedules" />
        <main className="flex-1 px-8 py-6 pl-72 bg-white min-h-screen">
            <div className="mb-6">
            <h1 className="text-xl font-semibold">Schedules</h1>
            <p className="text-gray-600 text-sm mt-1">Manage and monitor scheduled irrigation tasks.</p>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="relative w-full max-w-sm">
                <input
                type="text"
                placeholder="Search fields..."
                className="w-full border rounded-md py-2 px-3 pl-10 text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

            <button
                onClick={() => router.push("/schedules/new")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
            >
                + Add Schedule
            </button>
            </div>

            <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mr-2">Filter by status:</label>
            <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
            </select>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
            {filteredSchedules.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No schedules found.</p>
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
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredSchedules.map((s) => (
                        <tr key={s._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{s.fieldId?.name}</td>
                        <td className="p-3">{format(new Date(s.startTime), "yyyy-MM-dd HH:mm")}</td>
                        <td className="p-3">{format(new Date(s.endTime), "yyyy-MM-dd HH:mm")}</td>
                        <td className="p-3">{s.amountLiters} L</td>
                        <td className="p-3">
                            <span
                            className={`px-2 py-1 rounded text-xs ${
                                s.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                            >
                            {s.status}
                            </span>
                        </td>
                        <td className="p-3 flex gap-2">
                            <button
                            title="Edit"
                            onClick={() => router.push(`/schedules/edit/${s._id}`)}
                            className="p-1 hover:text-blue-600"
                            >
                            <Pencil size={16} />
                            </button>
                            <button
                            title="Delete"
                            onClick={() => {
                                setScheduleToDelete(s);  // Set the schedule to be deleted
                                setDeleteModalOpen(true);  // Open the confirmation modal
                            }}
                            className="p-1 hover:text-red-700 text-red-500"
                            >
                            <Trash2 size={16} />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
        </main>

        {/* Confirmation Modal */}
        {deleteModalOpen && scheduleToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold text-center text-gray-800">
                Confirm Deletion
                </h2>
                <p className="mt-2 text-sm text-center text-gray-600">
                Are you sure you want to delete the schedule for{" "}
                <span className="font-medium">{scheduleToDelete.fieldId?.name}</span>?
                </p>
                <div className="mt-4 flex justify-center gap-3">
                <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Cancel
                </button>
                <button
                    onClick={() => handleDelete(scheduleToDelete._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Delete
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
}
