"use client";

import { useEffect, useMemo, useState } from "react";
import SummaryCard from "@/components/SummaryCard";
import ServiceTable from "@/components/ServiceTable";
import ResponseChart from "@/components/ResponseChart";
import ServiceForm from "@/components/ServiceForm";
import { useRouter } from "next/navigation";

import {
  getSummary,
  getServiceStatus,
  getChart,
} from "@/services/dashboardApi";

import socket from "@/services/socket";

interface Summary {
  total: number;
  online: number;
  offline: number;
}

interface Service {
  id: number;
  name: string;
  url: string;
  ip: string | null;
  status: string;
  ping_ms: number | null;
  jitter_ms: number | null;
  response_time: number | null;
  status_code: number | null;
  checked_at: string;

  geoInfo?: {
    location: string;
    organization: string;
    isp: string;
    asn: string;
  };
}
export default function Home() {

  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    router.replace("/auth/login");
  };

  const [summary, setSummary] = useState<Summary>({
    total: 0,
    online: 0,
    offline: 0,
  });

  const [services, setServices] = useState<Service[]>([]);

  const [chartData, setChartData] = useState<
    {
      time: string;
      ping: number;
      jitter: number;
      response: number;
    }[]
  >([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [sortBy, setSortBy] = useState("name");

  const loadDashboard = async () => {
    try {

      const summaryRes = await getSummary();
      console.log(summaryRes.data);


      const serviceRes = await getServiceStatus();
      console.log(serviceRes.data);


      const chartRes = await getChart();
      console.log(chartRes.data);

      setSummary(summaryRes.data);
      setServices(serviceRes.data);
      setChartData(chartRes.data);

    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.replace("/auth/login");
    return;
  }

  loadDashboard();

  socket.on("dashboard-update", loadDashboard);

  return () => {
    socket.off("dashboard-update", loadDashboard);
  };
}, [router]);

  const filteredServices = useMemo(() => {

    return services

      .filter((service) => {

        const matchSearch =
          service.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||

          service.url
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchStatus =
          filter === "All" ||
          service.status === filter;

        return matchSearch && matchStatus;

      })

      .sort((a, b) => {

        switch (sortBy) {

          case "ping":

            return (
              (a.ping_ms ?? 999999) -
              (b.ping_ms ?? 999999)
            );

          case "response":

            return (
              (a.response_time ?? 999999) -
              (b.response_time ?? 999999)
            );

          case "status":

            return a.status.localeCompare(b.status);

          default:

            return a.name.localeCompare(b.name);

        }

      });

  }, [services, search, filter, sortBy]);

    return (
    <div className="min-h-screen bg-gray-100">

      <div className="p-6">

          {/* Form Tambah Service */}
          <div className="mb-6">
            <ServiceForm onSuccess={loadDashboard} />
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

            <SummaryCard
              title="Total Service"
              value={summary.total.toString()}
            />

            <SummaryCard
              title="Online"
              value={summary.online.toString()}
            />

            <SummaryCard
              title="Offline"
              value={summary.offline.toString()}
            />

            <SummaryCard
              title="Availability"
              value={
                summary.total > 0
                  ? `${(
                      (summary.online / summary.total) *
                      100
                    ).toFixed(1)} %`
                  : "0 %"
              }
            />

          </div>

          {/* Chart */}
          <ResponseChart
            data={chartData}
          />

          {/* Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">

            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-5">

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Daftar Service
                  </h2>

                  <p className="text-gray-600 mt-1">
                    Monitoring Web Service secara realtime
                  </p>

                </div>

                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">

                  Total : {filteredServices.length} Service

                </div>

              </div>

            </div>

            {/* Toolbar */}
            <div className="p-6 border-b border-gray-200">

              <div className="flex flex-wrap gap-4">

                <input
                  type="text"
                  placeholder="🔍 Cari Service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-80 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white"
                >
                  <option value="All">
                    Semua Status
                  </option>

                  <option value="Online">
                    Online
                  </option>

                  <option value="Offline">
                    Offline
                  </option>

                </select>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white"
                >

                  <option value="name">
                    Urut Nama
                  </option>

                  <option value="ping">
                    Urut Ping
                  </option>

                  <option value="response">
                    Urut HTTP Response
                  </option>

                  <option value="status">
                    Urut Status
                  </option>

                </select>

              </div>

            </div>

            {/* Isi Table */}

            <div className="p-6">

              {filteredServices.length === 0 ? (

                <div className="text-center py-12">

                  <h3 className="text-xl font-semibold text-gray-700">
                    Tidak ada data
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Service tidak ditemukan.
                  </p>

                </div>

              ) : (

                <ServiceTable
                  services={filteredServices}
                  reload={loadDashboard}
                />

              )}

            </div>

          </div>

      </div>

    </div>
  );

}