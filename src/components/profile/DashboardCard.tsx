"use client";

interface DashboardCardProps {
    source: string;
    message: {
        data: string;
        timestamp: string;
        rssi: number;
        snr: number;
    };
}

export default function DashboardCard({ source, message }: DashboardCardProps) {
    const flowMatch = message.data.match(/Flow:\s*(-?\d+\.\d+)\s*L\/min/);
    const pressureMatch = message.data.match(/Pressure:\s*(-?\d+\.\d+)\s*psi/);
    const waterLevelMatch = message.data.match(/WaterLevel:\s*(-?\d+\.\d+)\s*cm/);

    const flow = flowMatch ? parseFloat(flowMatch[1]) : null;
    const pressure = pressureMatch ? parseFloat(pressureMatch[1]) : null;
    const waterLevel = waterLevelMatch ? parseFloat(waterLevelMatch[1]) : null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="text-gray-400 text-sm mb-2">{message.timestamp}</div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">{source}</h2>

        {waterLevel !== null && (
            <div className="mb-4">
            <p className="text-sm text-gray-400">Water Level</p>
            <p className="text-3xl font-bold text-purple-600">{waterLevel} cm</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${Math.min((waterLevel / 200) * 100, 100)}%` }}
                />
            </div>
            </div>
        )}

        {flow !== null && (
            <div className="mb-4">
            <p className="text-sm text-gray-400">Water Flow</p>
            <p className="text-3xl font-bold text-blue-600">{flow} L/min</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min((flow / 100) * 100, 100)}%` }}
                />
            </div>
            </div>
        )}

        {pressure !== null && (
            <div className="mb-4">
            <p className="text-sm text-gray-400">Pressure</p>
            <p className="text-3xl font-bold text-green-600">{pressure} psi</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${Math.min((pressure / 10) * 100, 100)}%` }}
                />
            </div>
            </div>
        )}

        <div className="flex justify-between text-sm text-gray-500 mt-4">
            <span>RSSI: {message.rssi} dBm</span>
            <span>SNR: {message.snr} dB</span>
        </div>
        </div>
    );
}
