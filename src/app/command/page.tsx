"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";
import QuickActions from "src/components/command/QuickActions";
import CommandFilters from "src/components/command/CommandFilters";
import CommandTable from "src/components/command/CommandTable";

export default function CommandCenterPage() {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/command");
      setCommands(res.data);
    } catch (err) {
      console.error("Error fetching commands:", err);
    }
    setLoading(false);
  };

  const sendQuickCommand = async (commandType: "openall" | "closeall") => {
    if (sending) return;
    setSending(true);
    try {
      const fieldId = commands[0]?.fieldId?._id;
      if (!fieldId) {
        alert("No field available to send command.");
        return;
      }

      await axios.post("/api/command", {
        fieldId,
        command: commandType,
      });

      await fetchCommands();
    } catch (err) {
      console.error("Error sending command:", err);
    }
    setSending(false);
  };

  const filteredCommands = commands.filter((cmd: any) => {
    const matchesSearch = cmd.fieldId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || cmd.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex">
      <Navbar activePage="command-center" />
      <div className="flex-1 p-6 pl-72">
        <h1 className="text-xl font-bold mb-2">Command Center</h1>
        <p className="text-gray-600 mb-6 text-sm">Send commands and monitor device responses</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActions sendQuickCommand={sendQuickCommand} sending={sending} />
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <CommandFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
            <CommandTable loading={loading} filteredCommands={filteredCommands} onDelete={fetchCommands}/>
          </div>
        </div>
      </div>
    </div>
  );
}
