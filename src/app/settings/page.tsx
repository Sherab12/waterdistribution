"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../../components/navbar";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"profile" | "system">("profile");

    const [profile, setProfile] = useState({ username: "", email: "", password: "" });
    const [mqtt, setMqtt] = useState({ host: "", port: 1883, username: "", password: "", baseTopic: "" });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const p = await axios.get("/api/settings/profile?email=one@gmail.com");
                setProfile({ ...p.data, password: "" });

                const m = await axios.get("/api/settings/broker");
                if (m.data) setMqtt(m.data);
            } catch {
                toast.error("Failed to load settings");
            }
        }
        fetchData();
    }, []);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/api/settings/profile", profile);
            toast.success("Profile updated");
            setEditing(false);
        } catch {
            toast.error("Update failed");
        }
    };

    const handleMqttSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/api/settings/broker", mqtt);
            toast.success("MQTT config saved");
        } catch {
            toast.error("Failed to save MQTT config");
        }
    };

    return (
        <div className="flex w-full">
            <Navbar activePage="settings" />
            <div className="p-6 w-full max-w-6xl mx-auto ml-64">
                <h1 className="text-2xl font-bold mb-1">Settings</h1>
                <p className="text-gray-600 mb-6">Manage profile and system configuration</p>

                {/* Tabs */}
                <div className="flex border-b mb-6">
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            activeTab === "profile"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                        }`}
                        onClick={() => setActiveTab("profile")}
                    >
                        Profile
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ml-4 ${
                            activeTab === "system"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                        }`}
                        onClick={() => setActiveTab("system")}
                    >
                        System
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <form onSubmit={handleProfileSubmit} className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="text-lg font-semibold mb-4">Profile</h2>

                        {!editing ? (
                            <>
                                <div className="mb-4">
                                    <p><strong>Username:</strong> {profile.username}</p>
                                    <p><strong>Email:</strong> {profile.email}</p>
                                </div>
                                <button
                                    type="button"
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit Profile
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        className="border rounded p-2"
                                        placeholder="Username"
                                        value={profile.username}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                    />
                                    <input
                                        className="border rounded p-2"
                                        type="email"
                                        placeholder="Email"
                                        value={profile.email}
                                        readOnly
                                    />
                                    <input
                                        className="border rounded p-2"
                                        type="password"
                                        placeholder="New Password (optional)"
                                        value={profile.password}
                                        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                                    />
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-gray-400 text-white px-4 py-2 rounded"
                                        onClick={() => {
                                            setEditing(false);
                                            setProfile((prev) => ({ ...prev, password: "" }));
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                )}

                {/* System Tab - unchanged */}
                {activeTab === "system" && (
                    <form onSubmit={handleMqttSubmit} className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="text-lg font-semibold mb-4">MQTT Broker Configuration</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                className="border rounded p-2"
                                placeholder="Broker Host"
                                value={mqtt.host}
                                onChange={(e) => setMqtt({ ...mqtt, host: e.target.value })}
                            />
                            <input
                                className="border rounded p-2"
                                type="number"
                                placeholder="Port"
                                value={mqtt.port}
                                onChange={(e) => setMqtt({ ...mqtt, port: Number(e.target.value) })}
                            />
                            <input
                                className="border rounded p-2"
                                placeholder="Username"
                                value={mqtt.username}
                                onChange={(e) => setMqtt({ ...mqtt, username: e.target.value })}
                            />
                            <input
                                className="border rounded p-2"
                                type="password"
                                placeholder="Password"
                                value={mqtt.password}
                                onChange={(e) => setMqtt({ ...mqtt, password: e.target.value })}
                            />
                            <input
                                className="border rounded p-2"
                                placeholder="Base Topic"
                                value={mqtt.baseTopic}
                                onChange={(e) => setMqtt({ ...mqtt, baseTopic: e.target.value })}
                            />
                        </div>
                        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded" type="submit">
                            Save Config
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
