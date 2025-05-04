"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";

export default function AnalysisPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Derived analytics state
  const [analysis, setAnalysis] = useState({
    avgFlow: 0,
    totalWater: 0,
    minPressure: 0,
    maxPressure: 0,
  });

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/lora");
        if (!res.ok) {
          throw new Error("Failed to fetch data from the server");
        }
        const data = await res.json();

        // Filter for latest message per source
        const latestBySource: Record<string, any> = {};
        data.forEach((msg: any) => {
          const existing = latestBySource[msg.source];
          if (
            !existing ||
            new Date(msg.timestamp) > new Date(existing.timestamp)
          ) {
            latestBySource[msg.source] = msg;
          }
        });

        const filtered = Object.values(latestBySource);
        setMessages(filtered);

        // Calculate basic analysis
        const flows: number[] = [];
        const pressures: number[] = [];
        let total = 0;

        filtered.forEach((msg: any) => {
          const flowMatch = msg.data?.match(/Flow: ([\d.]+) L\/min/);
          const pressureMatch = msg.data?.match(/Pressure: ([-\d.]+) psi/);
          const totalMatch = msg.data?.match(/TotalDelivered: ([\d.]+) L/);

          if (flowMatch?.[1]) flows.push(parseFloat(flowMatch[1]));
          if (pressureMatch?.[1]) pressures.push(parseFloat(pressureMatch[1]));
          if (totalMatch?.[1]) total += parseFloat(totalMatch[1]);
        });

        const avgFlow = flows.length
          ? (flows.reduce((a, b) => a + b, 0) / flows.length).toFixed(2)
          : "0";

        const minPressure = pressures.length
          ? Math.min(...pressures).toFixed(2)
          : "0";
        const maxPressure = pressures.length
          ? Math.max(...pressures).toFixed(2)
          : "0";

        setAnalysis({
          avgFlow: Number(avgFlow),
          totalWater: Number(total.toFixed(2)),
          minPressure: Number(minPressure),
          maxPressure: Number(maxPressure),
        });
      } catch (err) {
        console.error("Failed to fetch MQTT messages:", err);
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full">
      <Navbar activePage="analysis" />

      <main className="p-6 w-full ml-64">
        <h1 className="text-2xl font-bold mb-4">Sensor Data (Live Feed)</h1>

        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Source</th>
                <th className="px-4 py-2 border">Flow (L/min)</th>
                <th className="px-4 py-2 border">Pressure (psi)</th>
                <th className="px-4 py-2 border">Total Delivered (L)</th>
                <th className="px-4 py-2 border">Time</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, idx) => {
                const flowMatch = msg.data?.match(/Flow: ([\d.]+) L\/min/);
                const pressureMatch = msg.data?.match(/Pressure: ([-\d.]+) psi/);
                const totalMatch = msg.data?.match(/TotalDelivered: ([\d.]+) L/);

                return (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2 border">{msg.source}</td>
                    <td className="px-4 py-2 border">{flowMatch?.[1] || "N/A"}</td>
                    <td className="px-4 py-2 border">{pressureMatch?.[1] || "N/A"}</td>
                    <td className="px-4 py-2 border">{totalMatch?.[1] || "N/A"}</td>
                    <td className="px-4 py-2 border">{new Date(msg.timestamp).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 📊 Real-time Analysis Summary */}
        <div className="mt-8 bg-white p-4 rounded-xl shadow-md w-full max-w-3xl">
          <h2 className="text-xl font-semibold mb-4">📈 Live Summary</h2>
          <ul className="space-y-2 text-gray-700">
            <li><strong>Average Flow Rate:</strong> {analysis.avgFlow} L/min</li>
            <li><strong>Total Water Delivered:</strong> {analysis.totalWater} L</li>
            <li><strong>Pressure Range:</strong> {analysis.minPressure} - {analysis.maxPressure} psi</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
