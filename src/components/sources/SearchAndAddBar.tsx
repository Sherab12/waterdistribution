import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchAndAddBar({
    activeTab,
    searchTerm,
    setSearchTerm,
}: {
    activeTab: "sources" | "fields",
    searchTerm: string,
    setSearchTerm: (val: string) => void,
}) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="relative w-1/3">
                <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
                />
            </div>
            <button
                onClick={() => router.push(activeTab === "sources" ? "/sources/new" : "/fields/new")}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
                <Plus size={16} />
                <span>{activeTab === "sources" ? "Add Source" : "Add Field"}</span>
            </button>
        </div>
    );
}
