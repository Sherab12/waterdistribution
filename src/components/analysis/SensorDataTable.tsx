"use client";
import React from "react";
import { format } from "date-fns";

export default function SensorDataTable({ data, loading }) {
    return (
        <div className="bg-white shadow rounded-lg p-4">
        {loading ? (
            <p className="text-gray-500">Loading data...</p>
        ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-separate border-gray-200">
                <thead className="bg-gray-50 text-gray-700">
                <tr>
                    <th className="px-4 py-2">Field</th>
                    <th className="px-4 py-2">Sensor Type</th>
                    <th className="px-4 py-2">Value</th>
                    <th className="px-4 py-2">Timestamp</th>
                </tr>
                </thead>
                <tbody>
                {data.map((entry, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{entry.sensorId?.fieldId?.name || "Unknown"}</td>
                    <td className="px-4 py-2 capitalize">{entry.sensorId?.type || "N/A"}</td>
                    <td className="px-4 py-2">{entry.value}</td>
                    <td className="px-4 py-2">
                        {format(new Date(entry.timestamp), "yyyy-MM-dd HH:mm:ss")}
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
