"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  _count?: { rsvps: number };
}

export default function ActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  async function fetchActivities() {
    const res = await fetch("/api/admin/activities");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    setActivities(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  function resetForm() {
    setForm({ title: "", description: "", date: "", time: "", location: "" });
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(a: Activity) {
    setForm({
      title: a.title,
      description: a.description || "",
      date: a.date.split("T")[0],
      time: a.time,
      location: a.location,
    });
    setEditing(a);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editing) {
      await fetch(`/api/admin/activities/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    resetForm();
    fetchActivities();
  }

  async function handleDelete(id: string) {
    if (!confirm("Aktivität wirklich löschen?")) return;
    await fetch(`/api/admin/activities/${id}`, { method: "DELETE" });
    fetchActivities();
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
          <h1 className="text-2xl font-bold text-warm-800">Aktivitäten</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-warm-600 text-white px-4 py-2 rounded-lg hover:bg-warm-700 transition-colors text-sm"
          >
            + Neue Aktivität
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl border border-warm-200 mb-6 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  Titel
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  Beschreibung
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  Datum
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  Uhrzeit
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) =>
                    setForm({ ...form, time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-warm-700 mb-1">
                  Ort
                </label>
                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-warm-600 text-white px-4 py-2 rounded-lg hover:bg-warm-700 transition-colors text-sm"
              >
                {editing ? "Speichern" : "Erstellen"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-warm-200 text-warm-600 hover:bg-warm-50 transition-colors text-sm"
              >
                Abbrechen
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {activities.length === 0 && (
            <p className="text-warm-400 text-center py-8">
              Noch keine Aktivitäten erstellt.
            </p>
          )}
          {activities.map((a) => (
            <div
              key={a.id}
              className="bg-white p-4 rounded-xl border border-warm-200 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-warm-800">{a.title}</h3>
                <p className="text-sm text-warm-500">
                  {new Date(a.date).toLocaleDateString("de-DE")} um {a.time} Uhr
                  &middot; {a.location}
                </p>
                {a.description && (
                  <p className="text-sm text-warm-400 mt-1">{a.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(a)}
                  className="text-sm text-warm-500 hover:text-warm-700 transition-colors"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
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
