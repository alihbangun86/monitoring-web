"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { me } from "@/services/authService";

const AuthContext = createContext<any>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const res = await me();

      setAdmin(res.data.admin);

    } catch {

      localStorage.removeItem("token");

      router.replace("/login");

    } finally {

      setLoading(false);

    }
  }

  function logout() {

    localStorage.clear();

    router.replace("/login");

  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);