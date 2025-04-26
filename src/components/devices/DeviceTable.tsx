import { Pencil, Trash2, Search, Plus } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface DeviceTableProps {
    activeTab: "sensors" | "valves";
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filteredSensors: any[];
    filteredValves: any[];
    router: ReturnType<typeof useRouter>;
    setDevices: React.Dispatch<React.SetStateAction<any[]>>;
}

const DeviceTable: React.FC<DeviceTableProps> = ({
    activeTab,
    searchTerm,
    setSearchTerm,
    filteredSensors,
    filteredValves,
    router,
    setDevices,
    }) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<any>(null);

    const openDeleteModal = (item: any) => {
        setDeleteItem(item);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteItem) return;
    
        try {
            // Determine the correct API endpoint based on the activeTab
            const apiUrl = activeTab === "valves"
            ? `/api/valve?id=${deleteItem._id}`
            : `/api/sensors?id=${deleteItem._id}`;

    
            // Perform the delete request
            const response = await fetch(apiUrl, { method: "DELETE" });
    
            if (!response.ok) {
                throw new Error("Failed to delete item");
            }
    
            // Update the list of devices by removing the deleted item
            setDevices((prev) => prev.filter((d) => d._id !== deleteItem._id));
    
            setDeleteModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("Error deleting the item.");
        }
    };
    

    const list = activeTab === "sensors" ? filteredSensors : filteredValves;

    return (
        <div className="bg-white shadow rounded-b-lg p-6">
        {/* Search & Add */}
        <div className="flex items-center justify-between mb-4">
            <div className="relative w-1/3">
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
            />
            </div>
            <button
                onClick={() => {
                    if (activeTab === "valves") {
                    router.push("/valves/new");
                    } else {
                    router.push("/devices/new?type=sensors");
                    }
                }}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                <Plus size={16} />
                Add {activeTab === "sensors" ? "Sensor" : "Valve"}
            </button>

        </div>

        {/* Device Table */}
        <div className="overflow-x-auto">
            <table className="min-w-full text-left border-separate border-spacing-y-2">
            <thead className="bg-gray-100">
                <tr>
                <th className="py-3 px-4 text-gray-500">Topic</th>
                <th className="py-3 px-4 text-gray-500">Type</th>
                <th className="py-3 px-4 text-gray-500">Field</th>
                <th className="py-3 px-4 text-gray-500">Created</th>
                <th className="py-3 px-4 text-gray-500">Actions</th>
                </tr>
            </thead>
            <tbody>
                {list.map((device) => (
                <tr key={device._id} className="border-b">
                    <td className="py-2 px-4 font-bold">{device.topic}</td>
                    <td className="py-2 px-4 capitalize">{device.type}</td>
                    <td className="py-2 px-4">{device.fieldId?.name || "N/A"}</td>
                    <td className="py-2 px-4">
                    {new Date(device.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">
                    <div className="flex gap-3">
                    <button
                        onClick={() => {
                            if (activeTab === "valves") {
                            router.push(`/valves/edit/${device._id}`);
                            } else {
                            router.push(`/devices/edit/${device._id}`);
                            }
                        }}
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
            </tbody>
            </table>
        </div>

        {/* Delete Modal */}
        {deleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <h2 className="text-lg text-center font-semibold mb-4">
                Confirm Deletion
                </h2>
                <p className="text-sm text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium">{deleteItem?.topic}</span>?
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
};

export default DeviceTable;
