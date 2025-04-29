'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import Navbar from "src/components/navbar";

export default function EditFieldPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [field, setField] = useState({
        name: "",
        size: "",
        sourceId: "",
        loraId: "",   // <-- ADD this
    });
    

    const [sources, setSources] = useState([]);

    useEffect(() => {
        const fetchSourcesAndField = async () => {
        try {
            const sourcesRes = await axios.get("/api/sources");
            setSources(sourcesRes.data);
    
            if (id) {
            const fieldRes = await axios.get(`/api/fields?id=${id}`);
            const fieldData = fieldRes.data;
    
            // If source exists and matches one in sources, set it
            setField({
                name: fieldData.name || "",
                size: fieldData.size || "",
                sourceId: typeof fieldData.sourceId === "object" ? fieldData.sourceId._id : fieldData.sourceId || "",
                loraId: fieldData.loraId || "",  // <-- ADD this
            });
            
            
            }
        } catch (error) {
            console.error("Error loading field or sources:", error);
            toast.error("Failed to load data");
        }
        };
    
        fetchSourcesAndField();
    }, [id]);
    
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setField({ ...field, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await axios.put("/api/fields", { _id: id, ...field });
        toast.success("Field updated!");
        router.push("/sources");
        } catch (err) {
        console.error(err);
        toast.error("Failed to update field");
        }
    };

    return (
        <div className="flex">
        <Navbar activePage="sources" />
        <main className="flex-1 p-8 ml-[250px]">
            <h1 className="text-xl font-semibold mb-6 text-gray-800">Edit Field</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
                <input
                name="name"
                value={field.name}
                onChange={handleChange}
                placeholder="Field Name"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <input
                name="size"
                value={field.size}
                onChange={handleChange}
                placeholder="Size"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Source</label>
            <select
                name="sourceId"
                value={field.sourceId || ""}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="">-- Select Source --</option>
                {sources.map((source: any) => (
                    <option key={source._id} value={source._id}>
                    {source.name}
                    </option>
                ))}
                </select>

            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LoRa ID</label>
                <input
                    name="loraId"
                    value={field.loraId}
                    onChange={handleChange}
                    placeholder="LoRa ID (e.g., LORA1, LORA2)"
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>


            <div className="flex gap-4 justify-end">
                <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                Update Field
                </button>
                <button
                type="button"
                onClick={() => router.push("/sources")}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                >
                Cancel
                </button>
            </div>
            </form>
        </main>
        </div>
    );
}
