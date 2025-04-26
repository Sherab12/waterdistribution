"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import Navbar from "src/components/navbar";
import DeviceHeader from "src/components/devices/Header"; // 🔥 Similar to sources/Header
import DeviceTable from "src/components/devices/DeviceTable"; // 🔥 Similar to sources/SourceTable

export default function DevicesPage() {
    const [devices, setDevices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [topSearch, setTopSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        axios
        .get("/api/sensors") // 👈 Fetching devices (your "sensors")
        .then((response) => setDevices(response.data))
        .catch((error) => {
            console.error(error);
            toast.error("Failed to load devices");
        });
    }, []);

    const filteredDevices = devices.filter((device: any) =>
        device.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex">
        <Navbar activePage="devices" />
        <main className="flex-1 p-8 ml-[250px]">
            <DeviceHeader topSearch={topSearch} setTopSearch={setTopSearch} />
            <DeviceTable
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredDevices={filteredDevices}
            router={router}
            setDevices={setDevices} // ✨ For deleting/editing
            />
        </main>
        </div>
    );
}
