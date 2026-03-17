"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";

interface Guest {
  id: string;
  name: string;
  email: string | null;
  token: string;
  profileComplete: boolean;
  foodPreference: string | null;
  sleepover: boolean;
  plusOneCount: number;
  plusOneNames: string[];
}

export default function GuestsPage() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function fetchGuests() {
    const res = await fetch("/api/admin/guests");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    setGuests(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchGuests();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "" });
    setShowForm(false);
    fetchGuests();
  }

  async function handleDelete(id: string) {
    if (!confirm("Gast wirklich löschen?")) return;
    await fetch(`/api/admin/guests/${id}`, { method: "DELETE" });
    fetchGuests();
  }

  function copyLink(token: string, id: string) {
    const url = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (loading) {
    return (
      <>
        <AdminNav />
        <div className="p-8 text-warm-500">Laden...</div>
      </>
    );
  }

  return (
    <>
      <AdminNav />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-warm-800">Gäste</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-warm-600 text-white px-4 py-2 rounded-lg hover:bg-warm-700 transition-colors text-sm"
          >
            + Neuer Gast
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl border border-warm-200 mb-6 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  E-Mail (optional)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-warm-600 text-white px-4 py-2 rounded-lg hover:bg-warm-700 transition-colors text-sm"
              >
                Erstellen
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-warm-200 text-warm-600 hover:bg-warm-50 transition-colors text-sm"
              >
                Abbrechen
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {guests.length === 0 && (
            <p className="text-warm-400 text-center py-8">
              Noch keine Gäste erstellt.
            </p>
          )}
          {guests.map((g) => (
            <div
              key={g.id}
              className="bg-white p-4 rounded-xl border border-warm-200 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-warm-800">
                  {g.name}
                  {g.profileComplete && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Profil ausgefüllt
                    </span>
                  )}
                  {g.plusOneCount > 0 && (
                    <span className="ml-2 text-xs bg-warm-100 text-warm-600 px-2 py-0.5 rounded-full">
                      +{g.plusOneCount}{g.plusOneNames.length > 0 ? `: ${g.plusOneNames.join(", ")}` : ""}
                    </span>
                  )}
                </h3>
                {g.email && (
                  <p className="text-sm text-warm-400">{g.email}</p>
                )}
                <p className="text-xs text-warm-300 mt-1 font-mono">
                  /invite/{g.token}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyLink(g.token, g.id)}
                  className="text-sm text-warm-500 hover:text-warm-700 transition-colors"
                >
                  {copiedId === g.id ? "Kopiert!" : "Link kopieren"}
                </button>
                <button
                  onClick={() => handleDelete(g.id)}
                  className="text-sm text-rose-400 hover:text-rose-600 transition-colors"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
