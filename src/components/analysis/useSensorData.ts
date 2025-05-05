"use client";
import { useState, useEffect } from "react";

export default function useSensorData() {
    const [sensorData, setSensorData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSensorData = async () => {
        try {
            const res = await fetch("/api/sensor-data");
            const data = await res.json();
            setSensorData(data.slice(-30).reverse());
        } catch (err) {
            console.error("Error fetching sensor data:", err);
        } finally {
            setLoading(false);
        }
        };
        fetchSensorData();
    }, []);

    return { sensorData, loading };
}
