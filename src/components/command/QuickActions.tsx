"use client";

import { useState } from "react";
import { FaFaucet, FaRedo } from "react-icons/fa";

interface QuickActionsProps {
    sendQuickCommand: (commandType: "openall" | "closeall") => void;
    sending: boolean;
}

export default function QuickActions({ sendQuickCommand, sending }: QuickActionsProps) {
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [pendingCommand, setPendingCommand] = useState<"openall" | "closeall" | null>(null);

    const handleQuickCommandClick = (commandType: "openall" | "closeall") => {
        setPendingCommand(commandType);
        setConfirmModalOpen(true);
    };

    const handleConfirm = () => {
        if (pendingCommand) {
        sendQuickCommand(pendingCommand);
        }
        setConfirmModalOpen(false);
        setPendingCommand(null);
    };

    const handleCancel = () => {
        setConfirmModalOpen(false);
        setPendingCommand(null);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

        <button
            onClick={() => handleQuickCommandClick("openall")}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-3"
            disabled={sending}
        >
            <FaFaucet /> Open All Valves
        </button>

        <button
            onClick={() => handleQuickCommandClick("closeall")}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded mb-3"
            disabled={sending}
        >
            <FaFaucet /> Close All Valves
        </button>

        <button
            className="w-full flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded"
            disabled
        >
            <FaRedo /> Restart All Devices
        </button>

        {/* Confirm Modal */}
        {confirmModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                <h3 className="text-lg font-bold mb-4 text-center">Confirm Action</h3>
                <p className="text-center mb-6">
                Are you sure you want to <span className="font-semibold">{pendingCommand === "openall" ? "open all valves" : "close all valves"}</span>?
                </p>
                <div className="flex justify-center gap-4">
                <button
                    onClick={handleConfirm}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Yes
                </button>
                <button
                    onClick={handleCancel}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    No
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
}
