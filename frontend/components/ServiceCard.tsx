"use client";

import StatusBadge from "./StatusBadge";
import { deleteService } from "@/services/serviceApi";

interface Props {
  id: number;
  name: string;
  url: string;
  status: string;
  statusCode: number | null;
  responseTime: number | null;
  pingMs: number | null;
  checkedAt: string;
  reload: () => void;
}

export default function ServiceCard({
  id,
  name,
  url,
  status,
  statusCode,
  responseTime,
  pingMs,
  checkedAt,
  reload,
}: Props) {
  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus service ini?")) return;

    try {
      await deleteService(id);
      reload();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus service.");
    }
  };

  const getPingBadge = () => {
    if (pingMs === null) {
      return (
        <span className="px-3 py-1 rounded-full bg-red-600 text-white text-sm font-semibold">
          RTO
        </span>
      );
    }

    if (pingMs < 50) {
      return (
        <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm font-semibold">
          {pingMs} ms
        </span>
      );
    }

    if (pingMs < 100) {
      return (
        <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-sm font-semibold">
          {pingMs} ms
        </span>
      );
    }

    if (pingMs < 300) {
      return (
        <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-semibold">
          {pingMs} ms
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-semibold">
        {pingMs} ms
      </span>
    );
  };

  const getResponseBadge = () => {
    if (responseTime === null) {
      return (
        <span className="px-3 py-1 rounded-full bg-red-600 text-white text-sm font-semibold">
          RTO
        </span>
      );
    }

    if (responseTime < 300) {
      return (
        <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm font-semibold">
          {responseTime} ms
        </span>
      );
    }

    if (responseTime < 1000) {
      return (
        <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-sm font-semibold">
          {responseTime} ms
        </span>
      );
    }

    if (responseTime < 3000) {
      return (
        <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-semibold">
          {responseTime} ms
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-semibold">
        {responseTime} ms
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition">

      {/* Header */}
      <div className="flex justify-between items-start mb-5">

        <div>
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>

          <p className="text-sm text-gray-500 mt-1 break-all">
            {url}
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* Detail */}
      <div className="space-y-4">

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">
            📡 Ping
          </span>

          {getPingBadge()}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">
            🌐 HTTP Response
          </span>

          {getResponseBadge()}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">
            📄 HTTP Status
          </span>

          <span className="font-semibold text-gray-800">
            {statusCode ?? "-"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">
            🕒 Last Check
          </span>

          <span className="text-gray-800 text-sm">
            {checkedAt
              ? new Date(checkedAt).toLocaleString("id-ID")
              : "-"}
          </span>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end">

        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2 rounded-lg font-medium"
        >
          Delete
        </button>

      </div>
    </div>
  );
}