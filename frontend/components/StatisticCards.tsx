"use client";

interface Statistics {
  total_check: number;
  average_ping: number;
  average_response: number;
  min_ping: number;
  max_ping: number;
  min_response: number;
  max_response: number;
  availability: number;
}

interface Props {
  statistics: Statistics;
}

export default function StatisticCards({
  statistics,
}: Props) {

  const cards = [
    {
      title: "Availability",
      value: `${statistics.availability}%`,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    {
      title: "Average Ping",
      value: `${statistics.average_ping} ms`,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      title: "Average Response",
      value: `${statistics.average_response} ms`,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      title: "Total Check",
      value: statistics.total_check,
      color: "text-gray-700",
      bg: "bg-gray-50",
      border: "border-gray-200",
    },
    {
      title: "Minimum Ping",
      value: `${statistics.min_ping} ms`,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      title: "Maximum Ping",
      value: `${statistics.max_ping} ms`,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
    {
      title: "Minimum Response",
      value: `${statistics.min_response} ms`,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      border: "border-cyan-200",
    },
    {
      title: "Maximum Response",
      value: `${statistics.max_response} ms`,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
  ];

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

      {cards.map((card, index) => (

        <div
          key={index}
          className={`rounded-xl border ${card.border} ${card.bg} shadow-sm hover:shadow-md transition-all duration-300 p-6`}
        >

          <p className="text-sm font-medium text-gray-500">

            {card.title}

          </p>

          <h2
            className={`mt-3 text-3xl font-bold ${card.color}`}
          >

            {card.value}

          </h2>

        </div>

      ))}

    </div>

  );

}