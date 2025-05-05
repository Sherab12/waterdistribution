"use client";
import React from "react";
import { Search } from "lucide-react";

export default function SearchFilterBar({ searchQuery, setSearchQuery, sensorTypeFilter, setSensorTypeFilter, onRefresh }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
            <div className="relative w-full md:w-1/2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
            </span>
            <input
                type="text"
                placeholder="Search fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md w-full"
            />
            </div>

            <select
            value={sensorTypeFilter}
            onChange={(e) => setSensorTypeFilter(e.target.value)}
            className="border rounded-md px-4 py-2 w-full md:w-1/2"
            >
            <option value="All">All Sensor Types</option>
            <option value="flow">Flow</option>
            <option value="pressure">Pressure</option>
            <option value="valve">Level</option>
            </select>
        </div>

        <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-fit"
        >
            Refresh
        </button>
        </div>
    );
}
