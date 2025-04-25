'use client';

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Navbar from "src/components/navbar";

export default function NewFieldPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [sources, setSources] = useState([]);

  useEffect(() => {
    axios.get("/api/sources").then((res) => setSources(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/fields", { name, size, sourceId });
      toast.success("Field created!");
      router.push("/sources");
    } catch (err) {
      console.error(err);
      toast.error("Error creating field");
    }
  };

  return (
    <div className="flex">
      <Navbar activePage="sources" />
      <main className="flex-1 p-8 ml-[250px]">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Add New Field</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
            <input
              type="text"
              placeholder="Field Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
            <input
              type="text"
              placeholder="Size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Source</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
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

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Save Field
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
