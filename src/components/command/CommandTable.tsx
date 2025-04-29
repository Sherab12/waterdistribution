"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Dialog } from "@headlessui/react";

interface CommandTableProps {
    loading: boolean;
    filteredCommands: any[];
    onDelete?: (id: string) => void;
}

export default function CommandTable({ loading, filteredCommands, onDelete }: CommandTableProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const openConfirm = (id: string) => {
        setSelectedId(id);
        setShowConfirm(true);
    };

    const closeConfirm = () => {
        setShowConfirm(false);
        setSelectedId(null);
    };

    const handleDelete = async () => {
        if (!selectedId) return;

        setDeletingId(selectedId);
        try {
        const res = await fetch(`/api/command/${selectedId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        if (onDelete) onDelete(selectedId);
        } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete command.");
        } finally {
        setDeletingId(null);
        closeConfirm();
        }
    };

    return (
        <div className="overflow-x-auto">
        <table className="w-full table-auto">
            <thead>
            <tr className="bg-gray-100">
                <th className="p-2 text-left text-sm">Field</th>
                <th className="p-2 text-left text-sm">Command</th>
                <th className="p-2 text-left text-sm">Sent</th>
                <th className="p-2 text-left text-sm">Status</th>
                <th className="p-2 text-left text-sm">Actions</th>
            </tr>
            </thead>
            <tbody>
            {loading ? (
                <tr>
                <td colSpan={5} className="text-center p-6 text-sm">Loading...</td>
                </tr>
            ) : filteredCommands.length === 0 ? (
                <tr>
                <td colSpan={5} className="text-center p-6 text-sm">No commands found.</td>
                </tr>
            ) : (
                filteredCommands.map((cmd) => (
                <tr key={cmd._id} className="border-t">
                    <td className="p-2 text-sm">{cmd.fieldId?.name || "Unknown"}</td>
                    <td className="p-2 text-sm">{cmd.command}</td>
                    <td className="p-2 text-sm">{new Date(cmd.createdAt).toLocaleString()}</td>
                    <td className="p-2 capitalize text-sm">{cmd.status}</td>
                    <td className="p-2 text-sm">
                    <button
                        onClick={() => openConfirm(cmd._id)}
                        className="text-red-600 hover:text-red-800 justify-center"
                        disabled={deletingId === cmd._id}
                    >
                        <Trash2 size={18} />
                    </button>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>

        {/* Confirmation Modal */}
        <Dialog open={showConfirm} onClose={closeConfirm} className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold text-center">Confirm Deletion</Dialog.Title>
            <p className="mt-2 text-center">Are you sure you want to delete this command?</p>
            <div className="mt-4 flex justify-center gap-2">
                <button
                onClick={closeConfirm}
                className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                Cancel
                </button>
                <button
                onClick={handleDelete}
                className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={!!deletingId}
                >
                {deletingId ? "Deleting..." : "Delete"}
                </button>
            </div>
            </Dialog.Panel>
        </Dialog>
        </div>
    );
}
