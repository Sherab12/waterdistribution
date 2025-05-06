"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { format } from "date-fns";
import { AlertTriangle, Droplet, Gauge, Waves } from "lucide-react";

export default function AlertsPage() {
    const [sensorData, setSensorData] = useState([]);
    const [loading, setLoading] = useState(true);

    const thresholds = {
        flow: { min: 5, max: 50 },
        pressure: { min: 1.0, max: 3.0 },
        level: { min: 20, max: 90 },
    };

    useEffect(() => {
        const fetchData = async () => {
        try {
            const res = await fetch("/api/sensor-data");
            const data = await res.json();
            setSensorData(data);
        } catch (err) {
            console.error("Failed to load sensor data", err);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, []);

    const generateAlerts = () => {
        return sensorData
        .filter((entry) => entry.sensorId && entry.sensorId.type)
        .map((entry) => {
            const { type } = entry.sensorId;
            const fieldName = entry.sensorId?.fieldId?.name || "Unknown Field";
            const value = Number(entry.value);
            const timestamp = format(new Date(entry.timestamp), "PPpp");

            const threshold = thresholds[type];
            if (!threshold) return null;

            if (value < threshold.min)
            return { fieldName, type, message: `${type} too low`, value, timestamp };
            if (value > threshold.max)
            return { fieldName, type, message: `${type} too high`, value, timestamp };

            return null;
        })
        .filter(Boolean);
    };

    const alerts = generateAlerts();

    const getIcon = (type) => {
        switch (type) {
        case "flow":
            return <Droplet className="text-blue-500 w-6 h-6" />;
        case "pressure":
            return <Gauge className="text-purple-600 w-6 h-6" />;
        case "level":
            return <Waves className="text-green-600 w-6 h-6" />;
        default:
            return <AlertTriangle />;
        }
    };

    return (
        <div className="flex">
        <Navbar activePage="alerts" />

        <main className="ml-64 w-full min-h-screen  p-8">
            <h1 className="text-xl font-bold text-gray-800">Alerts</h1>
            <p className="text-gray-600 text-sm mb-6">
            These alerts highlight irregularities detected in flow, pressure, or water level sensors.
            </p>

            {loading ? (
            <p className="text-gray-500">Loading sensor data...</p>
            ) : alerts.length === 0 ? (
            <p className="text-green-600 font-semibold">✅ All systems are functioning normally.</p>
            ) : (
            <div className="space-y-4">
                {alerts.map((alert, idx) => (
                <div
                    key={idx}
                    className="flex items-start p-4 bg-white rounded-xl shadow-md border-l-4 border-red-500 space-x-4"
                >
                    <div className="mt-1">{getIcon(alert.type)}</div>
                    <div>
                    <h2 className="text-md font-semibold text-gray-800">{alert.message}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        <strong>Field:</strong> {alert.fieldName}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Sensor:</strong> {alert.type}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Value:</strong> {alert.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{alert.timestamp}</p>
                    </div>
                </div>
                ))}
            </div>
            )}
        </main>
        </div>
    );
}
