interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {

  let color = "bg-gray-500";

  switch (status) {
    case "Online":
      color = "bg-green-500";
      break;

    case "Redirect":
      color = "bg-blue-500";
      break;

    case "Forbidden":
    case "Unauthorized":
      color = "bg-yellow-500";
      break;

    case "Not Found":
      color = "bg-orange-500";
      break;

    case "Server Error":
      color = "bg-red-500";
      break;

    case "Timeout":
    case "DNS Error":
    case "Connection Refused":
    case "Offline":
      color = "bg-red-600";
      break;

    default:
      color = "bg-gray-500";
  }

  return (
    <span
      className={`${color} text-white px-4 py-2 rounded-full text-sm font-semibold`}
    >
      {status}
    </span>
  );
}