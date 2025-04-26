"use client";

import React from "react";
import { Search } from "lucide-react"; // <-- Import the icon

interface DeviceHeaderProps {
    topSearch: string;
    setTopSearch: (value: string) => void;
}

export default function DeviceHeader({ topSearch, setTopSearch }: DeviceHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-xl font-bold">Devices</h1>
            <p className="text-gray-500 text-sm">Manage all your irrigation devices</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
            type="text"
            placeholder="Search..."
            value={topSearch}
            onChange={(e) => setTopSearch(e.target.value)}
            className="border rounded-lg p-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        </div>
    );
}
