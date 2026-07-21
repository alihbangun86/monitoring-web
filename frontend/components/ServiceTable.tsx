"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { deleteService } from "@/services/serviceApi";

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

interface Props {
  services: Service[];
  reload: () => void;
}

export default function ServiceTable({
  services,
  reload,
}: Props) {

  const handleDelete = async (id: number) => {

    if (!confirm("Yakin ingin menghapus service ini?")) return;

    try {

      await deleteService(id);

      reload();

    } catch (err) {

      console.error(err);

      alert("Gagal menghapus service.");

    }

  };

  const renderPing = (ping: number | null) => {

    if (ping === null) {

      return (
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
          RTO
        </span>
      );

    }

    if (ping < 50) {

      return (
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
          {ping} ms
        </span>
      );

    }

    if (ping < 100) {

      return (
        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
          {ping} ms
        </span>
      );

    }

    if (ping < 300) {

      return (
        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">
          {ping} ms
        </span>
      );

    }

    return (
      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
        {ping} ms
      </span>
    );

  };

  const renderJitter = (jitter: number | null) => {

  if (jitter === null) {
    return (
      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold whitespace-nowrap">
        -
      </span>
    );
  }

  if (jitter < 10) {
    return (
      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold whitespace-nowrap">
        {jitter} ms
      </span>
    );
  }

  if (jitter < 30) {
    return (
      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold whitespace-nowrap">
        {jitter} ms
      </span>
    );
  }

  if (jitter < 50) {
    return (
      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold whitespace-nowrap">
        {jitter} ms
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold whitespace-nowrap">
      {jitter} ms
    </span>
  );

};

  const renderResponse = (response: number | null) => {

    if (response === null) {

      return (
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
          Timeout
        </span>
      );

    }

    if (response < 300) {

      return (
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
          {response} ms
        </span>
      );

    }

    if (response < 1000) {

      return (
        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
          {response} ms
        </span>
      );

    }

    if (response < 3000) {

      return (
        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">
          {response} ms
        </span>
      );

    }

    return (
      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
        {response} ms
      </span>
    );

  };

  const renderHttpStatus = (code: number | null) => {

    if (code === null) {

      return (
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold">
          -
        </span>
      );

    }

    if (code >= 200 && code < 300) {

      return (
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
          {code}
        </span>
      );

    }

    if (code >= 300 && code < 400) {

      return (
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
          {code}
        </span>
      );

    }

    if (code >= 400 && code < 500) {

      return (
        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">
          {code}
        </span>
      );

    }

    return (
      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
        {code}
      </span>
    );

  };

  return (

    <div className="overflow-x-auto overflow-y-auto max-h-[700px] rounded-xl border border-gray-200 shadow-sm">

      <table className="min-w-full whitespace-nowrap">

        <thead className="bg-gray-100 sticky top-0 z-10">

          <tr className="border-b text-gray-800">

            <th className="px-6 py-4 text-left font-semibold">
              Service
            </th>

            <th className="px-6 py-4 text-left font-semibold">
              URL
            </th>

            <th className="px-6 py-4 text-center font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-center font-semibold">
              Ping
            </th>

            <th className="px-6 py-4 text-center font-semibold whitespace-nowrap">
              Jitter
            </th>

            <th className="px-6 py-4 text-center font-semibold">
              HTTP Response
            </th>

            <th className="px-6 py-4 text-center font-semibold">
              HTTP Status
            </th>

            <th className="px-6 py-4 text-center font-semibold">
              Last Check
            </th>

            <th className="px-6 py-4 text-center font-semibold">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {services.length === 0 ? (

            <tr>

              <td
                colSpan={8}
                className="text-center py-12 text-gray-500"
              >
                Belum ada service.
              </td>

            </tr>

          ) : (

            services.map((service) => (

              <tr
                key={service.id}
                className="border-b hover:bg-slate-50 transition-colors duration-200"
              >

                <td className="px-6 py-5">

                  <Link
                    href={`/service/${service.id}`}
                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {service.name}
                  </Link>

                </td>

                <td className="px-6 py-5">

                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                  >
                    {service.url}
                  </a>

                  <div className="mt-1 text-xs text-slate-500">
                    <strong>IP :</strong> {service.ip ?? "-"}
                  </div>

                  {service.geoInfo && (
                    <div className="mt-2 text-xs text-slate-500 space-y-1">

                      <div>
                        <strong>Location :</strong> {service.geoInfo.location}
                      </div>

                      <div>
                        <strong>ASN :</strong> {service.geoInfo.asn}
                      </div>

                      <div>
                        <strong>Organization :</strong> {service.geoInfo.organization}
                      </div>

                    </div>
                  )}

                </td>

                <td className="px-6 py-5 text-center">

                  <StatusBadge
                    status={service.status}
                  />

                </td>

                <td className="px-6 py-5 text-center whitespace-nowrap">

                  {renderPing(service.ping_ms)}

                </td>

                <td className="px-6 py-5 text-center whitespace-nowrap">
                  {renderJitter(service.jitter_ms)}
                </td>

                <td className="px-6 py-5 text-center whitespace-nowrap">

                  {renderResponse(
                    service.response_time
                  )}

                </td>

                <td className="px-6 py-5 text-center whitespace-nowrap">

                  {renderHttpStatus(
                    service.status_code
                  )}

                </td>

                <td className="px-6 py-5 text-center whitespace-nowrap text-gray-700">

                  {service.checked_at
                    ? new Date(
                        service.checked_at
                      ).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "-"}

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-center gap-2">

                    <Link
                      href={`/service/${service.id}`}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                    >
                      View
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(service.id)
                      }
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}