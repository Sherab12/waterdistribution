"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "src/components/navbar";
import DashboardCard from "src/components/profile/DashboardCard";
import { ArrowLeft } from "lucide-react";

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

export default function AnalysisPage() {
    const [latestMessages, setLatestMessages] = useState<Record<string, Message>>({});
    const [fields, setFields] = useState<Field[]>([]);
    const router = useRouter();

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
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, []);

    const sources = Object.keys(latestMessages);

    function getFieldName(source: string): string {
        const field = fields.find((f) => f.loraId?.toLowerCase() === source.toLowerCase());
        return field?.name || source;
    }

    const fieldSources = sources.filter((s) =>
        fields.some((f) => f.loraId?.toLowerCase() === s.toLowerCase())
    );
    const waterLevelSources = sources.filter((s) => !fieldSources.includes(s));

    return (
        <div className="flex flex-row min-h-screen bg-white">
            <Navbar activePage="analysis" />

            <div className="flex flex-1 ml-64 p-8 space-y-10 flex-col">
                

                <div>
                    <h1 className="text-xl font-bold text-gray-800 mb-1">Real-time Analysis</h1>
                    <p className="text-sm text-gray-500">Live sensor data for fields and water sources</p>
                </div>

                {/* Field Sensor Cards */}
                {fieldSources.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-600 mb-4">Field Sensors</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fieldSources.map((source) => (
                                <DashboardCard
                                    key={source}
                                    source={getFieldName(source)}
                                    message={latestMessages[source]}
                                />
                            ))}
                        </div>
                    </div>
                )}

                                {/* Water Level Sensor Cards */}
                                {waterLevelSources.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-600 mb-4">Water Level Sensors</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {waterLevelSources.map((source) => (
                                <DashboardCard
                                    key={source}
                                    source={source}
                                    message={latestMessages[source]}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Return Button at Bottom */}
                <div className="mt-10 flex justify-start">
                    <button
                        onClick={() => router.push("/analysis")}
                        className="px-4 py-2 bg-gray-200 text-sm hover:bg-gray-300 text-gray-800 rounded"
                    >
                        Return
                        
                    </button>
                </div>

            </div>
        </div>
    );
}
