"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Droplet, Gauge, Waves } from "lucide-react";
import { format } from "date-fns";

export default function AlertsWidget() {
  const [alerts, setAlerts] = useState<any[]>([]);
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
        const generatedAlerts = generateAlerts(data);
        setAlerts(generatedAlerts.slice(0, 4)); // Limit to the latest 4 alerts
      } catch (err) {
        console.error("Failed to load sensor data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateAlerts = (sensorData: any[]) => {
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

  const getIcon = (type: string) => {
    switch (type) {
      case "flow":
        return <Droplet className="text-blue-500 w-6 h-6" />;
      case "pressure":
        return <Gauge className="text-purple-600 w-6 h-6" />;
      case "level":
        return <Waves className="text-green-600 w-6 h-6" />;
      default:
        return <AlertTriangle className="text-red-500 w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
        <h3 className="text-lg font-semibold">Alerts</h3>
      </div>
      
      {loading ? (
        <p className="text-gray-500">Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p className="text-gray-500">No alerts to show.</p>
      ) : (
        <ul className="space-y-4 text-sm text-red-500">
          {alerts.map((alert, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <div>{getIcon(alert.type)}</div>
              <div>
                <p>{alert.message}</p>
                <p className="text-xs mt-1">{alert.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
