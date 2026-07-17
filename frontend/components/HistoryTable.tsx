"use client";

interface History {
  status: string;
  status_code: number | null;
  ping_ms: number | null;
  response_time: number | null;
  jitter_ms: number | null;
  packet_loss: number | null;
  checked_at: string;
}

interface Props {
  history: History[];
}

export default function HistoryTable({
  history,
}: Props) {

  const renderStatus = (status: string) => {

    switch (status) {

      case "Online":
        return (
          <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
            Online
          </span>
        );

      case "Redirect":
        return (
          <span className="inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
            Redirect
          </span>
        );

      case "Timeout":
        return (
          <span className="inline-flex px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
            Timeout
          </span>
        );

      default:
        return (
          <span className="inline-flex px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
            {status}
          </span>
        );

    }

  };

  return (

    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">

      <table className="min-w-full text-sm">

        <thead className="sticky top-0 bg-slate-800 text-white z-10">

          <tr>

            <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
              Status
            </th>

            <th className="px-6 py-4 text-center font-semibold whitespace-nowrap">
              HTTP
            </th>

            <th className="px-6 py-4 text-center font-semibold whitespace-nowrap">
              Ping
            </th>

            <th className="px-6 py-4 text-center font-semibold whitespace-nowrap">
              Response
            </th>

            <th className="px-6 py-4 text-center font-semibold whitespace-nowrap">
              Jitter
            </th>

            <th className="px-6 py-4 text-center font-semibold whitespace-nowrap">
              Packet Loss
            </th>

            <th className="px-6 py-4 text-center font-semibold whitespace-nowrap">
              Waktu Monitoring
            </th>

          </tr>

        </thead>

        <tbody>

          {history.map((item, index) => (

            <tr
              key={index}
              className={`border-b transition-colors duration-200 hover:bg-blue-50 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >

              <td className="px-6 py-4 whitespace-nowrap">

                {renderStatus(item.status)}

              </td>

              <td className="px-6 py-4 text-center text-gray-800 font-semibold whitespace-nowrap font-mono">

                {item.status_code ?? "-"}

              </td>

              <td className="px-6 py-4 text-center text-gray-800 whitespace-nowrap font-mono">

                {item.ping_ms !== null
                  ? `${item.ping_ms} ms`
                  : "RTO"}

              </td>

              <td className="px-6 py-4 text-center text-gray-800 whitespace-nowrap font-mono">

                {item.response_time !== null
                  ? `${item.response_time} ms`
                  : "Timeout"}

              </td>

              <td className="px-6 py-4 text-center text-gray-800 whitespace-nowrap font-mono">

                {item.jitter_ms !== null
                  ? `${item.jitter_ms} ms`
                  : "-"}

              </td>

              <td className="px-6 py-4 text-center text-gray-800 whitespace-nowrap font-mono">

                {item.packet_loss ?? 0} %

              </td>

              <td className="px-6 py-4 text-center text-gray-700 whitespace-nowrap">

                {new Date(item.checked_at).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}