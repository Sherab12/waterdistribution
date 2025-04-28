import React, { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface SourceTableProps {
    activeTab: "sources" | "fields";
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filteredSources: any[];
    filteredFields: any[];
    router: ReturnType<typeof useRouter>;
    }

const SourceTable: React.FC<SourceTableProps> = ({
    activeTab,
    searchTerm,
    setSearchTerm,
    filteredSources,
    filteredFields,
    router,
    }) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<{
        type: "source" | "field";
        data: any;
    } | null>(null);

    const openDeleteModal = (data: any, type: "source" | "field") => {
        setDeleteItem({ type, data });
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
            if (!deleteItem) return;
        
            try {
            const endpoint =
                deleteItem.type === "source"
                ? `/api/sources?id=${deleteItem.data._id}`
                : `/api/fields?id=${deleteItem.data._id}`;
        
            const response = await fetch(endpoint, {
                method: "DELETE",
            });
        
            if (!response.ok) {
                throw new Error("Failed to delete.");
            }
        
            // Optionally, show a success message
            // Reload or filter out the deleted item from state
            // You can pass a refresh function via props or use router.refresh() (if on app directory)
            window.location.reload(); // or use SWR/mutate or re-fetch filteredSources
        
            setDeleteModalOpen(false);
            } catch (error) {
            console.error(error);
            alert("Error deleting the item. Please try again.");
        }
    };
    

    const fieldCountMap = filteredFields.reduce((acc, field) => {
        const sid =
        typeof field.sourceId === "object" ? field.sourceId?._id : field.sourceId;
        acc[sid] = (acc[sid] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="bg-white shadow rounded-b-lg p-6">
        {/* Header */}
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
            onClick={() =>
                router.push(activeTab === "sources" ? "/sources/new" : "/fields/new")
            }
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex-shrink-0 whitespace-nowrap"
            >
            <Plus size={16} />
            {activeTab === "sources" ? "Add Source" : "Add Field"}
            </button>
        </div>

        {/* Sources Table */}
        {activeTab === "sources" && (
            <div className="overflow-x-auto">
            <table className="min-w-full text-left border-separate border-spacing-y-2">
                <thead className="bg-gray-100">
                <tr>
                    <th className="py-3 px-4 text-gray-500">Name</th>
                    <th className="py-3 px-4 text-gray-500">Location</th>
                    <th className="py-3 px-4 text-gray-500">Description</th>
                    <th className="py-3 px-4 text-gray-500">Fields</th>
                    <th className="py-3 px-4 text-gray-500">Created</th>
                    <th className="py-3 px-4 text-gray-500">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredSources.map((source) => {
                    const count = fieldCountMap[source._id] || 0;
                    return (
                    <tr key={source._id} className="border-b">
                        <td className="py-2 px-4 font-bold">{source.name}</td>
                        <td className="py-2 px-4">{source.location}</td>
                        <td className="py-2 px-4">{source.description}</td>
                        <td className="py-2 px-4">
                        <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                            {count}
                        </span>
                        </td>
                        <td className="py-2 px-4">
                        {new Date(source.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">
                        <div className="flex gap-3">
                            <button
                            onClick={() =>
                                router.push(`/fields/new?sourceId=${source._id}`)
                            }
                            title="Add Field"
                            className="text-blue-500 hover:text-blue-700"
                            >
                            <Plus size={18} />
                            </button>
                            <button
                            onClick={() =>
                                router.push(`/sources/edit/${source._id}`)
                            }
                            title="Edit"
                            className="text-gray-600 hover:text-gray-800"
                            >
                            <Pencil size={18} />
                            </button>
                            <button
                            onClick={() => openDeleteModal(source, "source")}
                            title="Delete"
                            className="text-red-500 hover:text-red-700"
                            >
                            <Trash2 size={18} />
                            </button>
                        </div>
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
            </div>
        )}

        {/* Fields Table */}
        {activeTab === "fields" && (
            <div className="overflow-x-auto">
            <table className="min-w-full text-left border-separate border-spacing-y-2">
                <thead className="bg-gray-100">
                <tr>
                    <th className="py-3 px-4 text-gray-500">Name</th>
                    <th className="py-3 px-4 text-gray-500">Size (sq km)</th>
                    <th className="py-3 px-4 text-gray-500">Source</th>
                    <th className="py-3 px-4 text-gray-500">Lora</th>
                    <th className="py-3 px-4 text-gray-500">Created</th>
                    <th className="py-3 px-4 text-gray-500">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredFields.map((field) => (
                    <tr key={field._id} className="border-b">
                    <td className="py-2 px-4 font-bold">{field.name}</td>
                    <td className="py-2 px-4">{field.size}</td>
                    <td className="py-2 px-4">{field.sourceId?.name}</td>
                    <td className="py-2 px-4">{field.loraId}</td>
                    <td className="py-2 px-4">
                        {new Date(field.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">
                        <div className="flex gap-3">
                        <button
                            onClick={() => router.push(`/fields/edit/${field._id}`)}
                            title="Edit"
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            onClick={() => openDeleteModal(field, "field")}
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
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <h2 className="text-lg text-center font-semibold mb-4">Confirm Deletion</h2>
                <p className="text-sm text-gray-700 text-center mb-6">
                {deleteItem?.type === "source" ? (
                    <>
                    Are you sure you want to delete {" "}
                    <span className="font-medium">{deleteItem.data.name}</span>?
                    </>
                ) : (
                    <>
                    Are you sure you want to delete {" "}
                    <span className="font-medium">{deleteItem.data.name}</span>{" "}
                    from {" "}
                    <span className="font-medium">
                        {deleteItem.data.sourceId?.name || "Unknown Source"}
                    </span>
                    ?
                    </>
                )}
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

export default SourceTable;
