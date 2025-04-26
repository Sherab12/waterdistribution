import { Search } from "lucide-react";

export default function Header({ topSearch, setTopSearch }: { topSearch: string, setTopSearch: (val: string) => void }) {
    return (
        <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-xl font-bold">Sources & Fields</h1>
            <p className="text-gray-600 text-sm">Manage water sources and irrigation fields</p>
        </div>
        <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <input
            type="text"
            placeholder="Search sources..."
            value={topSearch}
            onChange={(e) => setTopSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
            />
        </div>
        </div>
    );
}