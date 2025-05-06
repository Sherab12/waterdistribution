"use client";

import React from "react";
import SensorGraph from "../../components/analysis/SensorGraph";
import { format } from "date-fns";

export default function DashboardGraphWidget({ sensorData }) {
  const groupByField = (type) => {
    const grouped = {};
    sensorData
      .filter((d) => d.sensorId?.type === type)
      .forEach((d) => {
        const field = d.sensorId?.fieldId?.name || "Unknown";
        if (!grouped[field]) grouped[field] = [];
        grouped[field].push({
          value: Number(d.value),
          timestamp: format(new Date(d.timestamp), "HH:mm:ss"),
        });
      });
    return grouped;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
      <h3 className="text-xl font-semibold mb-4">Sensor Data Graphs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SensorGraph title="Flow Volume (Last)" groupedData={groupByField("flow")} />
        <SensorGraph title="Pressure (Last)" groupedData={groupByField("pressure")} />
      </div>
    </div>
  );
}
