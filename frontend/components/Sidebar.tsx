import {
  FaHome,
  FaServer,
  FaBell,
  FaGlobe,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen">

      <div className="text-2xl font-bold p-6">
        Monitor
      </div>

      <ul className="space-y-2">

        <li className="hover:bg-slate-700 p-4 cursor-pointer">
          <FaHome className="inline mr-3" />
          Dashboard
        </li>

        <li className="hover:bg-slate-700 p-4 cursor-pointer">
          <FaGlobe className="inline mr-3" />
          Website
        </li>

        <li className="hover:bg-slate-700 p-4 cursor-pointer">
          <FaServer className="inline mr-3" />
          Server
        </li>

        <li className="hover:bg-slate-700 p-4 cursor-pointer">
          <FaBell className="inline mr-3" />
          Alerts
        </li>

      </ul>

    </aside>
  );
}