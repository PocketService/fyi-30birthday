"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";

interface GuestInfo {
  id: string;
  name: string;
  foodPreference: string | null;
  allergies: string | null;
  sleepover: boolean;
  sleepoverFrom: string | null;
  sleepoverTo: string | null;
  plusOneCount: number;
  plusOneNames: string[];
}

interface Rsvp {
  id: string;
  status: "ATTENDING" | "DECLINED";
  guest: GuestInfo;
}

interface ActivityWithRsvps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  rsvps: Rsvp[];
}

const foodLabels: Record<string, string> = {
  MEAT: "Fleisch",
  VEGETARIAN: "Vegetarisch",
  VEGAN: "Vegan",
};

export default function RsvpsPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityWithRsvps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/rsvps");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      setActivities(await res.json());
      setLoading(false);
    }
    load();
  }, []);

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
        <h1 className="text-2xl font-bold text-warm-800 mb-6">
          Rückmeldungen
        </h1>

        {activities.length === 0 && (
          <p className="text-warm-400 text-center py-8">
            Noch keine Aktivitäten vorhanden.
          </p>
        )}

        {activities.map((activity) => {
          const attending = activity.rsvps.filter(
            (r) => r.status === "ATTENDING"
          );
          const declined = activity.rsvps.filter(
            (r) => r.status === "DECLINED"
          );

          return (
            <div
              key={activity.id}
              className="bg-white rounded-xl border border-warm-200 mb-6 overflow-hidden"
            >
              <div className="p-4 border-b border-warm-100 bg-warm-50">
                <h2 className="font-semibold text-warm-800">
                  {activity.title}
                </h2>
                <p className="text-sm text-warm-500">
                  {new Date(activity.date).toLocaleDateString("de-DE")} um{" "}
                  {activity.time} Uhr &middot; {activity.location}
                </p>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-medium text-green-700 mb-2">
                  Zusagen ({attending.length})
                </h3>
                {attending.length === 0 ? (
                  <p className="text-sm text-warm-300 mb-4">Keine Zusagen</p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {attending.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between text-sm bg-green-50 px-3 py-2 rounded-lg"
                      >
                        <span className="font-medium text-warm-700">
                          {r.guest.name}
                          {r.guest.plusOneCount > 0 && (
                            <span className="ml-1 text-warm-400 font-normal">
                              (+{r.guest.plusOneCount}{r.guest.plusOneNames.length > 0 ? ` ${r.guest.plusOneNames.join(", ")}` : ""})
                            </span>
                          )}
                        </span>
                        <div className="flex gap-3 text-warm-500 text-xs">
                          {r.guest.foodPreference && (
                            <span>
                              {foodLabels[r.guest.foodPreference]}
                            </span>
                          )}
                          {r.guest.allergies && (
                            <span>Allergien: {r.guest.allergies}</span>
                          )}
                          {r.guest.sleepover && (
                            <span>
                              Übernachtung:{" "}
                              {r.guest.sleepoverFrom && new Date(r.guest.sleepoverFrom).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                              {r.guest.sleepoverTo && ` – ${new Date(r.guest.sleepoverTo).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}`}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="text-sm font-medium text-rose-600 mb-2">
                  Absagen ({declined.length})
                </h3>
                {declined.length === 0 ? (
                  <p className="text-sm text-warm-300">Keine Absagen</p>
                ) : (
                  <div className="space-y-2">
                    {declined.map((r) => (
                      <div
                        key={r.id}
                        className="text-sm bg-rose-50 px-3 py-2 rounded-lg text-warm-500"
                      >
                        {r.guest.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
