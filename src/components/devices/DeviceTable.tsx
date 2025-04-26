"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

interface DeviceTableProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filteredDevices: any[];
    router: any;
    setDevices: React.Dispatch<React.SetStateAction<any[]>>; // updated here
}

export default function DeviceTable({
    searchTerm,
    setSearchTerm,
    filteredDevices,
    router,
    setDevices,
    }: DeviceTableProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deviceToDelete, setDeviceToDelete] = useState<any>(null);

    const openDeleteModal = (device: any) => {
        setDeviceToDelete(device);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deviceToDelete) return;
        try {
        await axios.delete(`/api/sensors?id=${deviceToDelete._id}`);
        toast.success("Device deleted successfully");
        setDevices((prev) => prev.filter((d) => d._id !== deviceToDelete._id));
        setDeleteModalOpen(false);
        } catch (error) {
        console.error(error);
        toast.error("Failed to delete device");
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/devices/edit/${id}`);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
            <div className="relative w-1/3">
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
            />
            </div>
            <button
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={() => router.push("/devices/new")}
            >
            <Plus size={16} />
            Add Device
            </button>
        </div>

        {/* Device Table */}
        <div className="overflow-x-auto">
            <table className="min-w-full text-left border-separate border-spacing-y-2">
            <thead className="bg-gray-100">
                <tr>
                <th className="py-3 px-4 text-gray-500">Device (Topic)</th>
                <th className="py-3 px-4 text-gray-500">Field Name</th>
                <th className="py-3 px-4 text-gray-500">Sensor Type</th>
                <th className="py-3 px-4 text-gray-500">Status</th>
                <th className="py-3 px-4 text-gray-500">Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredDevices.map((device) => (
                <tr key={device._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-bold">{device.topic}</td>
                    <td className="py-2 px-4">{device.fieldId?.name || "Unknown Field"}</td>
                    <td className="py-2 px-4">{device.type || "Unknown Type"}</td>
                    <td className="py-2 px-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        Active
                    </span>
                    </td>
                    <td className="py-2 px-4">
                    <div className="flex gap-3">
                        <button
                        onClick={() => handleEdit(device._id)}
                        title="Edit"
                        className="text-gray-600 hover:text-gray-800"
                        >
                        <Pencil size={18} />
                        </button>
                        <button
                        onClick={() => openDeleteModal(device)}
                        title="Delete"
                        className="text-red-500 hover:text-red-700"
                        >
                        <Trash2 size={18} />
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
                {filteredDevices.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                    No devices found.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <h2 className="text-lg text-center font-semibold mb-4">Confirm Deletion</h2>
                <p className="text-sm text-gray-700 text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium">{deviceToDelete?.topic}</span>?
                </p>
                <div className="flex justify-center gap-2">
                <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Cancel
                </button>
                <button
                    onClick={confirmDelete}
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
