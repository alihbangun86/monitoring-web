"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      router.push("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Username atau Password salah"
      );
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200"
      >

        {/* Judul lebih kontras */}
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Login Admin
        </h1>

        {/* Pesan Error lebih jelas */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 font-medium rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Field Username */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Masukkan username"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Field Password */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Masukkan password"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Tombol Login */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg transition duration-200 shadow-md disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>

      </form>

    </div>
  );
}