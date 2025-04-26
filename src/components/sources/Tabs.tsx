export default function Tabs({ activeTab, setActiveTab }: { activeTab: "sources" | "fields", setActiveTab: (tab: "sources" | "fields") => void }) {
    return (
        <div className="flex mt-10 mb-2">
            <button
            className={`px-4 py-2 rounded-t-lg text-1xl ${activeTab === "sources" ? "bg-white shadow font-bold" : "bg-gray-100"}`}
            onClick={() => setActiveTab("sources")}
            >
            Water Sources
            </button>
            <button
            className={`px-4 py-2 rounded-t-lg ${activeTab === "fields" ? "bg-white shadow font-bold" : "bg-gray-100"}`}
            onClick={() => setActiveTab("fields")}
            >
            Fields
            </button>
        </div>
    );
}