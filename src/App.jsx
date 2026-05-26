import { useMemo, useState } from "react";
import ChatAssistant from "./components/ChatAssistant.jsx";
import properties from "./data/properties.json";
import SearchBar from "./components/SearchBar.jsx";

import {
  Building2,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Clock3,
} from "lucide-react";

import KPIcard from "./components/KPIcard.jsx";
import TenantFilter from "./components/TenantFilter.jsx";
import CollectionChart from "./components/CollectionChart.jsx";

function App() {
  const [selectedCity, setSelectedCity] =
  useState("All Cities");
  const [search, setSearch] =useState("");
  
  const cities = [
    "All Cities",
    "Delhi",
    "Mumbai",
    "Pune",
    "Bengaluru",
    "Chennai",
    "Hyderabad",
    "Ahmedabad",
    "Kolkata",
    "Jaipur",
    "Lucknow",
  ];

  const filteredData = useMemo(() => {
  let data =
    selectedCity === "All Cities"
      ? properties
      : properties.filter(
          (item) =>
            item.tenant === selectedCity
        );

  if (search.trim()) {
    data = data.filter(
      (item) =>
        item.owner_name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.property_id
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );
  }

  return data;
}, [selectedCity, search]);

  const totalProperties =
    filteredData.length;

    
    const approvedProperties =
    filteredData.filter(
      (item) => item.status === "Approved"
    ).length;
    
    const rejectedProperties =
    filteredData.filter(
      (item) => item.status === "Rejected"
    ).length;
    
    const pendingProperties =
    filteredData.filter(
      (item) => item.status === "Pending"
    ).length;
    
    const totalCollection =
    filteredData.reduce(
      (acc, curr) =>
        acc + curr.collection_inr,
      0
    );
    
    const approvalRate =
  totalProperties > 0
    ? (
        (approvedProperties /
          totalProperties) *
        100
      ).toFixed(1)
    : 0;
  const chartData = cities
    .filter((city) => city !== "All Cities")
    .map((city) => {
      const cityData = properties.filter(
        (item) => item.tenant === city
      );

      return {
        city,
        collection: cityData.reduce(
          (acc, curr) =>
            acc + curr.collection_inr,
          0
        ),
      };
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">


        <div>
          <h1 className="text-4xl font-bold">
            Property Tax Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            UPYOG Multi-Tenant Analytics
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
  <SearchBar
    search={search}
    setSearch={setSearch}
  />

  <TenantFilter
    selectedCity={selectedCity}
    setSelectedCity={
      setSelectedCity
    }
    cities={cities}
  />
</div>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <KPIcard
          title="Total Properties"
          value={totalProperties}
          icon={
            <Building2 className="text-blue-400" />
          }
          color="text-white"
        />

        <KPIcard
          title="Approved"
          value={approvedProperties}
          icon={
            <CheckCircle2 className="text-green-400" />
          }
          color="text-green-400"
        />

        <KPIcard
          title="Rejected"
          value={rejectedProperties}
          icon={
            <XCircle className="text-red-400" />
          }
          color="text-red-400"
        />

        <KPIcard
        title="Pending"
        value={pendingProperties}
        icon={
        <Clock3 className="text-orange-400" />
        }
        color="text-orange-400"
        />

        <KPIcard
          title="Collection"
          value={`₹${totalCollection.toLocaleString(
            "en-IN"
          )}`}
          icon={
            <IndianRupee className="text-yellow-400" />
          }
          color="text-yellow-400"
        />
      </div>

      <KPIcard
  title="Approval Rate"
  value={`${approvalRate}%`}
  icon={
    <CheckCircle2 className="text-emerald-400" />
  }
  color="text-emerald-400"
/>

      {/* CHART */}
      <CollectionChart
        chartData={chartData}
      />

      {/* AI CHAT */}
<ChatAssistant properties={properties} />

<footer className="mt-10 text-center text-slate-500 text-sm">
  Built for NUDM UPYOG Intern Assessment
</footer>
    </div>

  );
}

export default App;