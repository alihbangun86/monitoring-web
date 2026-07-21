"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    router.replace("/auth/login");
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 h-16 px-8 flex items-center justify-between">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Monitoring Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Website Monitoring System
        </p>
      </div>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>

    </nav>
  );
}