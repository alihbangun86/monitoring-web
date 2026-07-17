"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import StatisticCards from "@/components/StatisticCards";

import HistoryTable from "@/components/HistoryTable";
import PerformanceChart from "@/components/PerformanceChart";

import {
  getServiceDetail,
} from "@/services/serviceApi";

import socket from "@/services/socket";

/* =====================================
   INTERFACE
===================================== */

interface Service {
  id: number;
  name: string;
  url: string;
  status: string;
  ping_ms: number | null;
  jitter_ms: number | null;
  packet_loss: number | null;
  response_time: number | null;
  status_code: number | null;
  checked_at: string;
}

interface Statistics {
  total_check: number;

  average_ping: number;
  average_jitter: number;
  average_packet_loss: number;
  average_response: number;

  min_ping: number;
  max_ping: number;

  min_jitter: number;
  max_jitter: number;

  min_response: number;
  max_response: number;

  availability: number;
}

interface History {
  checked_at: string;

  ping_ms: number | null;
  jitter_ms: number | null;
  packet_loss: number | null;
  response_time: number | null;

  status: string;
  status_code: number | null;
}

/* =====================================
   PAGE
===================================== */

export default function ServiceDetail() {

  const params = useParams();

  const id = Number(params.id);

  const [service, setService] =
    useState<Service | null>(null);

  const [statistics, setStatistics] =
    useState<Statistics | null>(null);

  const [history, setHistory] =
    useState<History[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* =====================================
     LOAD DATA
  ===================================== */

  const loadData = async () => {

    try {

      const res = await getServiceDetail(id);

      setService(res.data.service);

      setStatistics(res.data.statistics);

      setHistory(res.data.history);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  /* =====================================
     SOCKET.IO
  ===================================== */

  useEffect(() => {

    if (!id) return;

    loadData();

    socket.on("dashboard-update", () => {

      loadData();

    });

    return () => {

      socket.off("dashboard-update");

    };

  }, [id]);

  /* =====================================
     LOADING
  ===================================== */

  if (loading) {

    return (

      <div className="flex justify-center items-center h-screen">

        <h2 className="text-xl font-semibold">

          Loading...

        </h2>

      </div>

    );

  }

  /* =====================================
     NOT FOUND
  ===================================== */

  if (!service || !statistics) {

    return (

      <div className="flex justify-center items-center h-screen">

        <h2 className="text-xl text-red-600">

          Service tidak ditemukan.

        </h2>

      </div>

    );

  }

    /* =====================================
     CHART DATA
  ===================================== */


  const performanceData = history
  .slice()
  .reverse()
  .map((item) => ({
    time: new Date(item.checked_at).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    ping: item.ping_ms ?? 0,
    response: item.response_time ?? 0,
    jitter: item.jitter_ms ?? 0,
  }));

  const pingData = history
    .slice()
    .reverse()
    .map((item) => ({
      time: new Date(item.checked_at).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: item.ping_ms ?? 0,
    }));

  const responseData = history
    .slice()
    .reverse()
    .map((item) => ({
      time: new Date(item.checked_at).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: item.response_time ?? 0,
    }));

  const jitterData = history
    .slice()
    .reverse()
    .map((item) => ({
      time: new Date(item.checked_at).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: item.jitter_ms ?? 0,
    }));

  const packetLossData = history
    .slice()
    .reverse()
    .map((item) => ({
      time: new Date(item.checked_at).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: item.packet_loss ?? 0,
    }));

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <main className="p-6">

          {/* =====================================
              HEADER
          ===================================== */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

            <div>

              <Link
                href="/"
                className="text-blue-600 hover:underline text-sm"
              >
                ← Kembali ke Dashboard
              </Link>

              <h1 className="text-3xl font-bold text-gray-900 mt-2">

                {service.name}

              </h1>

              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >

                {service.url}

              </a>

            </div>

            <div>

              <span
                className={`inline-flex items-center px-5 py-3 rounded-full text-white font-semibold shadow ${
                  service.status === "Online"
                    ? "bg-green-500"
                    : service.status === "Redirect"
                    ? "bg-blue-500"
                    : "bg-red-500"
                }`}
              >

                {service.status}

              </span>

            </div>

          </div>

          {/* =====================================
              CURRENT STATUS
          ===================================== */}

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">

              <div>

                <p className="text-sm text-gray-500 mb-2">

                  Ping

                </p>

                <h2 className="text-3xl font-bold text-green-600">

                  {service.ping_ms ?? "-"} ms

                </h2>

              </div>

              <div>

                <p className="text-sm text-gray-500 mb-2">

                  HTTP Response

                </p>

                <h2 className="text-3xl font-bold text-blue-600">

                  {service.response_time ?? "-"} ms

                </h2>

              </div>

              <div>

                <p className="text-sm text-gray-500 mb-2">

                  Jitter

                </p>

                <h2 className="text-3xl font-bold text-purple-600">

                  {service.jitter_ms ?? "-"} ms

                </h2>

              </div>

              <div>

                <p className="text-sm text-gray-500 mb-2">

                  Packet Loss

                </p>

                <h2 className="text-3xl font-bold text-red-600">

                  {service.packet_loss ?? 0} %

                </h2>

              </div>

              <div>

                <p className="text-sm text-gray-500 mb-2">

                  HTTP Status

                </p>

                <h2
                  className={`text-3xl font-bold ${
                    service.status_code &&
                    service.status_code >= 200 &&
                    service.status_code < 300
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >

                  {service.status_code ?? "-"}

                </h2>

              </div>

              <div>

                <p className="text-sm text-gray-500 mb-2">

                  Last Check

                </p>

                <h2 className="text-base font-semibold text-gray-700">

                  {new Date(service.checked_at).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}

                </h2>

              </div>

            </div>

          </div>

          {/* =====================================
              STATISTIC CARDS
          ===================================== */}

          <StatisticCards
            statistics={statistics}
          />

          {/* =====================================
              PERFORMANCE MONITORING
          ===================================== */}

          <div className="mt-8">

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">

              <div className="mb-6">

                <h2 className="text-2xl font-bold text-gray-900">

                  Monitoring Performance

                </h2>

                <p className="text-gray-500 mt-1">

                  Ping, Jitter dan HTTP Response 30 Menit Terakhir

                </p>

              </div>

              <PerformanceChart
                data={performanceData}
              />

            </div>

          </div>
          {/* =====================================
              SUMMARY STATISTICS
          ===================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 mt-8">

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">

              <p className="text-sm text-gray-500">

                Average Ping

              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-2">

                {statistics.average_ping ?? 0} ms

              </h2>

            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">

              <p className="text-sm text-gray-500">

                Average Response

              </p>

              <h2 className="text-3xl font-bold text-blue-600 mt-2">

                {statistics.average_response ?? 0} ms

              </h2>

            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">

              <p className="text-sm text-gray-500">

                Average Jitter

              </p>

              <h2 className="text-3xl font-bold text-purple-600 mt-2">

                {statistics.average_jitter ?? 0} ms

              </h2>

            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">

              <p className="text-sm text-gray-500">

                Average Packet Loss

              </p>

              <h2 className="text-3xl font-bold text-red-600 mt-2">

                {statistics.average_packet_loss ?? 0} %

              </h2>

            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">

              <p className="text-sm text-gray-500">

                Availability

              </p>

              <h2 className="text-3xl font-bold text-emerald-600 mt-2">

                {statistics.availability ?? 0} %

              </h2>

            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">

              <p className="text-sm text-gray-500">

                Total Monitoring

              </p>

              <h2 className="text-3xl font-bold text-indigo-600 mt-2">

                {statistics.total_check ?? 0}

              </h2>

            </div>

          </div>
          {/* =====================================
              MIN & MAX STATISTICS
          ===================================== */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

            {/* Ping */}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">

              <h2 className="text-lg font-bold text-gray-900 mb-6">

                Ping Statistics

              </h2>

              <div className="space-y-5">

                <div className="flex justify-between items-center">

                  <span className="text-gray-600">

                    Minimum Ping

                  </span>

                  <span className="font-bold text-green-600">

                    {statistics.min_ping ?? 0} ms

                  </span>

                </div>

                <div className="border-t"></div>

                <div className="flex justify-between items-center">

                  <span className="text-gray-600">

                    Maximum Ping

                  </span>

                  <span className="font-bold text-red-600">

                    {statistics.max_ping ?? 0} ms

                  </span>

                </div>

              </div>

            </div>

            {/* HTTP Response */}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">

              <h2 className="text-lg font-bold text-gray-900 mb-6">

                HTTP Response Statistics

              </h2>

              <div className="space-y-5">

                <div className="flex justify-between items-center">

                  <span className="text-gray-600">

                    Minimum Response

                  </span>

                  <span className="font-bold text-green-600">

                    {statistics.min_response ?? 0} ms

                  </span>

                </div>

                <div className="border-t"></div>

                <div className="flex justify-between items-center">

                  <span className="text-gray-600">

                    Maximum Response

                  </span>

                  <span className="font-bold text-red-600">

                    {statistics.max_response ?? 0} ms

                  </span>

                </div>

              </div>

            </div>

            {/* Jitter */}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">

              <h2 className="text-lg font-bold text-gray-900 mb-6">

                Jitter Statistics

              </h2>

              <div className="space-y-5">

                <div className="flex justify-between items-center">

                  <span className="text-gray-600">

                    Minimum Jitter

                  </span>

                  <span className="font-bold text-green-600">

                    {statistics.min_jitter ?? 0} ms

                  </span>

                </div>

                <div className="border-t"></div>

                <div className="flex justify-between items-center">

                  <span className="text-gray-600">

                    Maximum Jitter

                  </span>

                  <span className="font-bold text-red-600">

                    {statistics.max_jitter ?? 0} ms

                  </span>

                </div>

              </div>

            </div>

          </div>
          {/* =====================================
              MONITORING HISTORY
          ===================================== */}

          <div className="mt-8">

            <div className="bg-white rounded-xl shadow-lg border border-gray-200">

              {/* Header */}

              <div className="border-b border-gray-200 px-6 py-5 flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">

                    Monitoring History

                  </h2>

                  <p className="text-gray-500 mt-1">

                    100 riwayat monitoring terakhir

                  </p>

                </div>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">

                  {history.length} Records

                </span>

              </div>

              {/* Table */}

              <div className="p-6">

                {history.length === 0 ? (

                  <div className="text-center py-20">

                    <h3 className="text-xl font-semibold text-gray-700">

                      Belum ada riwayat monitoring

                    </h3>

                    <p className="text-gray-500 mt-2">

                      Scheduler monitoring belum menghasilkan data.

                    </p>

                  </div>

                ) : (

                  <HistoryTable
                    history={history}
                  />

                )}

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>

  );

}