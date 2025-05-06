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

  // Assume all datasets have same timestamps, use one as base X-axis labels
  const fieldNames = Object.keys(groupedData);
  const baseField = fieldNames[0];
  const timestamps = groupedData[baseField]?.map((d) => d.timestamp) ?? [];

  // Combine all data into one array of objects with timestamps and values for each field
  const combinedData = timestamps.map((timestamp, index) => {
    const entry = { timestamp };
    fieldNames.forEach((field) => {
      entry[field] = groupedData[field]?.[index]?.value ?? null;
    });
    return entry;
  });

  return (
    <div className="bg-white shadow rounded-lg p-4 h-64">
      <h2 className="text-sm font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          {fieldNames.map((field, idx) => (
            <Line
              key={field}
              type="monotone"
              dataKey={field}
              stroke={colors[idx % colors.length]}
              name={field}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
