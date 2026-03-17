"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface ActivityDetail {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  myStatus: "ATTENDING" | "DECLINED" | null;
  attendees: string[];
  attendeeCount: number;
}

export default function ActivityRsvpPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const activityId = params.activityId as string;

  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function fetchActivity() {
    const res = await fetch(`/api/invite/${token}/activities/${activityId}`);
    if (res.ok) setActivity(await res.json());
  }

  useEffect(() => {
    async function load() {
      const guestRes = await fetch(`/api/invite/${token}`);
      if (!guestRes.ok) { router.push("/"); return; }
      const guest = await guestRes.json();
      if (!guest.profileComplete) { router.push(`/invite/${token}`); return; }
      await fetchActivity();
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, activityId]);

  async function handleToggle() {
    if (!activity) return;
    setSubmitting(true);
    const newStatus = activity.myStatus === "ATTENDING" ? "DECLINED" : "ATTENDING";
    await fetch(`/api/invite/${token}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId, status: newStatus }),
    });
    await fetchActivity();
    setSubmitting(false);
  }

  if (loading || !activity) {
    return (
      <div className="guest-bg min-h-screen flex items-center justify-center">
        <p className="text-navy font-mono text-lg font-bold uppercase tracking-widest">Laden...</p>
      </div>
    );
  }

  const dateFormatted = new Date(activity.date).toLocaleDateString("de-DE", {
    weekday: "long", day: "numeric", month: "long",
  });
  const isAttending = activity.myStatus === "ATTENDING";

  const attendeeColors = [
    "bg-pink-pale text-wine", "bg-gold-pale text-navy", "bg-olive-pale text-olive",
    "bg-navy-pale text-navy", "bg-wine-pale text-wine",
  ];

  return (
    <div className="guest-bg min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-8 md:py-12">

        <Link href={`/invite/${token}`}
          className="inline-flex items-center gap-2 font-mono text-sm font-bold text-navy/50 hover:text-pink mb-8 uppercase tracking-wider">
          <span className="text-lg">&larr;</span> Zurück
        </Link>

        <div className="brutal-card overflow-hidden">
          {/* Header */}
          <div className="bg-navy px-6 py-5" style={{ borderBottom: "3px solid #033F63" }}>
            <p className="font-mono text-xs text-gold uppercase tracking-widest mb-1">{dateFormatted}</p>
            <h1 className="text-3xl font-black text-cream uppercase tracking-tight leading-tight">
              {activity.title}
            </h1>
          </div>

          <div className="p-6">
            {/* Info blocks */}
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="px-4 py-3 bg-gold" style={{ border: "3px solid #033F63" }}>
                <p className="font-mono text-[10px] text-navy/60 uppercase tracking-wider mb-0.5">Uhrzeit</p>
                <p className="font-black text-navy text-base tracking-tight">{activity.time}</p>
              </div>
              <div className="px-4 py-3 bg-olive-pale" style={{ border: "3px solid #033F63" }}>
                <p className="font-mono text-[10px] text-navy/60 uppercase tracking-wider mb-0.5">Ort</p>
                <p className="font-black text-navy text-base tracking-tight">{activity.location}</p>
              </div>
            </div>

            {activity.description && (
              <div className="border-l-4 border-pink pl-4 mb-6">
                <p className="text-navy/70 text-sm leading-relaxed whitespace-pre-line">
                  {activity.description}
                </p>
              </div>
            )}

            <div className="zigzag my-6" />

            {/* Toggle button */}
            <button onClick={handleToggle} disabled={submitting}
              className={`w-full py-5 text-lg cursor-pointer disabled:opacity-50 ${
                isAttending ? "brutal-pill-olive" : "btn-brutal"
              }`}>
              <span className="font-black block uppercase">
                {submitting ? "..." : isAttending ? "BIN DABEI!" : "ICH BIN DABEI"}
              </span>
            </button>

            {isAttending && (
              <button onClick={handleToggle} disabled={submitting} type="button"
                className="w-full mt-2 py-2 font-mono text-xs text-navy/40 hover:text-pink uppercase tracking-wider cursor-pointer bg-transparent border-none">
                Doch nicht &rarr; absagen
              </button>
            )}

            {/* Attendees */}
            {activity.attendees.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-black text-navy uppercase text-sm">Dabei</h3>
                  <span className="text-xs font-black px-2 py-0.5 bg-olive text-cream"
                    style={{ border: "2px solid #033F63" }}>
                    {activity.attendeeCount}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activity.attendees.map((name, i) => (
                    <span key={name}
                      className={`font-mono text-sm font-bold px-3 py-1.5 ${attendeeColors[i % attendeeColors.length]}`}
                      style={{ border: "2px solid #033F63" }}>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-14 mb-6">
          <div className="zigzag mb-4" />
          <p className="font-mono text-xs text-navy/40 text-center uppercase tracking-widest">
            Geburtstagsfeier &middot; Juni 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
