"use client";

export default function AlertsWidget() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold mb-4">Alerts</h3>
      <ul className="space-y-2 text-sm text-red-500">
        <li>⚠️ Low Pressure detected!</li>
        <li>⚠️ Valve 2 inactive!</li>
        <li>⚠️ Source offline!</li>
      </ul>
    </div>
  );
}
