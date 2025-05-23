"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import DashboardCard from "src/components/profile/DashboardCard";
import CalendarWidget from "../../components/profile/CalendarWidget";
import AlertsWidget from "../../components/profile/AlertsWidget";
import LatestSchedulesWidget from "../../components/profile/LatestSchedulesWidget";
import DashboardGraphWidget from "../../components/profile/DashboardGraphWidget";

interface Message {
  topic: string;
  source: string;
  data: string;
  rssi: number;
  snr: number;
  timestamp: string;
}

interface Field {
  _id: string;
  name: string;
  loraId: string;
}

export default function ProfilePage() {
  const [latestMessages, setLatestMessages] = useState<Record<string, Message>>({});
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [msgRes, fieldRes] = await Promise.all([
          fetch("/api/lora", { cache: "no-store" }),
          fetch("/api/fields", { cache: "no-store" }),
        ]);
        const messages = await msgRes.json();
        const fields = await fieldRes.json();

        setFields(fields);

        if (messages.length > 0) {
          const updatedMessages: Record<string, Message> = {};

          messages.forEach((msg: Message) => {
            updatedMessages[msg.source] = {
              ...msg,
              timestamp: msg.timestamp || new Date().toISOString(),
            };
          });

          setLatestMessages(updatedMessages);
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  const sources = Object.keys(latestMessages);

  function getFieldNameFromSource(source: string): string {
    if (!source) return "";
    const field = fields.find((f) => f.loraId?.toLowerCase() === source.toLowerCase());
    return field?.name || source;
  }

  // Separate field and water level sensors
  const fieldMessages = sources.filter((s) =>
    fields.some((f) => f.loraId?.toLowerCase() === s.toLowerCase())
  );
  const waterLevelMessages = sources.filter((s) => !fieldMessages.includes(s));

  return (
    <div className="flex flex-row min-h-screen bg-white">
      <Navbar activePage="dashboard" />

      <div className="flex flex-1 ml-64 p-8 space-x-8">
        {/* Left Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-bold">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">
                Overview of your irrigation systems
              </p>
            </div>

            {/* Search Bar */}
            <div>
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Field Sensor Cards */}
          {fieldMessages.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-gray-600 mb-2">
                Field Sensors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {fieldMessages.map((source) => (
                  <DashboardCard
                    key={source}
                    source={getFieldNameFromSource(source)}
                    message={latestMessages[source]}
                  />
                ))}
              </div>
            </>
          )}

          {/* Water Level Cards */}
          {waterLevelMessages.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-gray-600 mb-2">
                Water Level Sensors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {waterLevelMessages.map((source) => (
                  <DashboardCard
                    key={source}
                    source={source}
                    message={latestMessages[source]}
                  />
                ))}
              </div>
            </>
          )}

          {/* New Widget for Graphs above the latest schedules */}
          {/* <DashboardGraphWidget sensorData={Object.values(latestMessages)} /> */}

          {/* Latest Schedules Table */}
          <LatestSchedulesWidget />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex flex-col gap-8">
          <CalendarWidget />
          <AlertsWidget />
        </div>
      </div>
    </div>
  );
}
