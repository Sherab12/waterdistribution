"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import Navbar from "src/components/navbar";
import Header from "src/components/sources/Header";
import Tabs from "src/components/sources/Tabs";
import SourceTable from "src/components/sources/SourceTable";

export default function SourcePage() {
  const [sources, setSources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [topSearch, setTopSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"sources" | "fields">("sources");
  const [fields, setFields] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/sources")
      .then((response) => setSources(response.data))
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load sources");
      });
  
    axios
      .get("/api/fields")
      .then((response) => setFields(response.data))
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load fields");
      });
  }, []);
  

  const filteredSources = sources.filter((source: any) =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFields = fields.filter((field: any) =>
  field.name.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className="flex">
      <Navbar activePage="sources" />
      <main className="flex-1 p-8 ml-[250px]">
        <Header topSearch={topSearch} setTopSearch={setTopSearch} />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <SourceTable
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredSources={filteredSources}
          filteredFields={filteredFields} // ✅ Add this line
          router={router}
        />
      </main>
    </div>
  );
}
