"use client";
import React from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

export default function SensorGraph({ title, groupedData }) {
    const colors = ['#3b82f6', '#10b981', '#6366f1'];

    return (
        <div className="bg-white shadow rounded-lg p-4 h-64">
        <h2 className="text-sm font-semibold mb-2">{title}</h2>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.entries(groupedData).map(([field, data], idx) => (
                <Line
                key={field}
                data={data}
                type="monotone"
                dataKey="value"
                name={field}
                stroke={colors[idx % colors.length]}
                />
            ))}
            </LineChart>
        </ResponsiveContainer>
        </div>
    );
}
