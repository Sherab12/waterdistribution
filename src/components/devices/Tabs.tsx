export default function DeviceTabs({
    activeTab,
    setActiveTab,
  }: {
    activeTab: "sensors" | "valves";
    setActiveTab: (tab: "sensors" | "valves") => void;
  }) {
    return (
      <div className="flex mt-10 mb-2">
        <button
          className={`px-4 py-2 rounded-t-lg text-1xl ${
            activeTab === "sensors" ? "bg-white shadow font-bold" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("sensors")}
        >
          Sensors
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg text-1xl ${
            activeTab === "valves" ? "bg-white shadow font-bold" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("valves")}
        >
          Valves
        </button>
      </div>
    );
  }
  