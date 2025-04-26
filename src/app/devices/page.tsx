"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import Navbar from "src/components/navbar";
import Header from "src/components/devices/Header"; // if you want top search bar like sources
import DeviceTabs from "src/components/devices/Tabs";
import DeviceTable from "src/components/devices/DeviceTable";

export default function DevicesPage() {
    const [sensors, setSensors] = useState([]);
    const [valves, setValves] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [topSearch, setTopSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"sensors" | "valves">("sensors");
    const router = useRouter();

    useEffect(() => {
        // Fetch sensors
        axios
            .get("/api/sensors")
            .then((res) => setSensors(res.data))
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load sensors");
            });

        // Fetch valves
        axios
            .get("/api/valve")
            .then((res) => setValves(res.data))
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load valves");
            });
    }, []);

    const filteredSensors = sensors.filter(
        (d) =>
            (d.type === "flow" || d.type === "pressure") &&
            d.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredValves = valves.filter(
        (d) => d.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex">
            <Navbar activePage="devices" />
            <main className="flex-1 p-8 ml-[250px]">
                <Header topSearch={topSearch} setTopSearch={setTopSearch} />
                <DeviceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <DeviceTable
                    activeTab={activeTab}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filteredSensors={filteredSensors}
                    filteredValves={filteredValves}
                    router={router}
                    setDevices={activeTab === "valves" ? setValves : setSensors}
                />

            </main>
        </div>
    );
}
