"use client";

import { FaSearch, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface CommandFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (filter: string) => void;
}

export default function CommandFilters({ searchQuery, setSearchQuery, statusFilter, setStatusFilter }: CommandFiltersProps) {
    const router = useRouter();

    return (
        <div className="mb-6">
        {/* Header */}
        <h2 className="text-xl font-bold mb-4">Command History</h2>

        {/* Filters */}
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
            <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                type="text"
                placeholder="Search Fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border pl-10 p-2 rounded w-64"
                />
            </div>

            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border p-2 rounded"
            >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="executed">Executed</option>
                <option value="failed">Failed</option>
            </select>
            </div>

            <button
            onClick={() => router.push("/command/new")}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
            <FaPlus /> Add Command
            </button>
        </div>
        </div>
    );
}
