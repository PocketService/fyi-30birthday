"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/admin/activities");
    } else {
      setError("Ungültige Anmeldedaten");
    }
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-warm-800 mb-6 text-center">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">
              Benutzername
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white"
              required
            />
          </div>
          {error && <p className="text-rose-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-warm-600 text-white py-2 px-4 rounded-lg hover:bg-warm-700 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Anmelden"}
          </button>
        </form>
      </div>
    </main>
  );
}
