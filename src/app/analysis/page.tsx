"use client";

import React, { useState } from "react";
import Navbar from "../../components/navbar";
import useSensorData from "../../components/analysis/useSensorData";
import SearchFilterBar from "../../components/analysis/SearchFilterBar";
import SensorDataTable from "../../components/analysis/SensorDataTable";
import SensorGraph from "../../components/analysis/SensorGraph";
import { format } from "date-fns";

export default function AnalysisPage() {
  const { sensorData, loading } = useSensorData();
  const [searchQuery, setSearchQuery] = useState("");
  const [sensorTypeFilter, setSensorTypeFilter] = useState("All");

  const filteredData = sensorData.filter((entry) => {
    const matchesSearch =
      entry.sensorId?.fieldId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const matchesSensorType =
      sensorTypeFilter === "All" || entry.sensorId?.type === sensorTypeFilter;
    return matchesSearch && matchesSensorType;
  });

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
    <div className="flex w-full flex-col">
      <Navbar activePage="analysis" />

      <div className="min-h-screen p-6 text-gray-900 ml-64">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Analysis</h1>
          <p className="text-gray-600 text-sm">Monitor latest irrigation sensor readings.</p>
        </div>

        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sensorTypeFilter={sensorTypeFilter}
          setSensorTypeFilter={setSensorTypeFilter}
          onRefresh={() => window.location.reload()}
        />

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <SensorDataTable data={filteredData} loading={loading} />
          </div>
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <SensorGraph title="Flow Volume (Last)" groupedData={groupByField("flow")} />
            <SensorGraph title="Pressure (Last)" groupedData={groupByField("pressure")} />
          </div>
        </div>
      </div>
    </div>
  );
}
