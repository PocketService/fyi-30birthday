"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Guest {
  id: string;
  name: string;
  foodPreference: string | null;
  allergies: string | null;
  sleepover: boolean;
  sleepoverFrom: string | null;
  sleepoverTo: string | null;
  plusOneCount: number;
  plusOneNames: string[];
  profileComplete: boolean;
}

interface ActivityWithRsvp {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  rsvps: { status: string }[];
}

const FOOD_OPTIONS = [
  { value: "MEAT", label: "FLEISCH", icon: "\u{1F356}" },
  { value: "VEGETARIAN", label: "VEGGIE", icon: "\u{1F966}" },
  { value: "VEGAN", label: "VEGAN", icon: "\u{1F331}" },
];

const DAY_TABS = [
  { date: "2026-06-19", label: "FR 19.", full: "Freitag, 19. Juni" },
  { date: "2026-06-20", label: "SA 20.", full: "Samstag, 20. Juni" },
  { date: "2026-06-21", label: "SO 21.", full: "Sonntag, 21. Juni" },
];

const TAB_COLORS = ["bg-pink", "bg-navy", "bg-olive"];
const TAB_ACTIVE = ["bg-pink text-cream", "bg-navy text-cream", "bg-olive text-cream"];

/* ============ Accordion ============ */
function Accordion({
  title,
  tag,
  children,
  defaultOpen = false,
  shadowClass = "brutal-card-navy",
  tagBg = "bg-gold text-navy",
  borderColor = "border-navy",
}: {
  title: string;
  tag?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  shadowClass?: string;
  tagBg?: string;
  borderColor?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`${shadowClass} mb-5 overflow-hidden`}>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black text-navy uppercase">{title}</h2>
          {tag && (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-navy ${tagBg}`}>
              {tag}
            </span>
          )}
        </div>
        <span className={`text-2xl font-black text-navy ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className={`px-5 pb-5 border-t-[3px] ${borderColor}`}>
          <div className="pt-4">{children}</div>
        </div>
      )}
    </section>
  );
}

export default function InvitePage() {
  const params = useParams();
  const token = params.token as string;

  const [guest, setGuest] = useState<Guest | null>(null);
  const [activities, setActivities] = useState<ActivityWithRsvp[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [foodPreference, setFoodPreference] = useState("MEAT");
  const [allergies, setAllergies] = useState("");
  const [sleepover, setSleepover] = useState(false);
  const [sleepoverFrom, setSleepoverFrom] = useState("2026-06-19");
  const [sleepoverTo, setSleepoverTo] = useState("2026-06-21");
  const [plusOneCount, setPlusOneCount] = useState(0);
  const [plusOneNames, setPlusOneNames] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(DAY_TABS[0].date);

  const fetchActivities = useCallback(async () => {
    const res = await fetch(`/api/invite/${token}/activities`);
    if (res.ok) setActivities(await res.json());
  }, [token]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/invite/${token}`);
      if (!res.ok) { setError("Ungültiger Einladungslink."); setLoading(false); return; }
      const data: Guest = await res.json();
      setGuest(data);
      if (data.profileComplete) {
        setFoodPreference(data.foodPreference || "MEAT");
        setAllergies(data.allergies || "");
        setSleepover(data.sleepover);
        if (data.sleepoverFrom) setSleepoverFrom(data.sleepoverFrom.split("T")[0]);
        if (data.sleepoverTo) setSleepoverTo(data.sleepoverTo.split("T")[0]);
        setPlusOneCount(data.plusOneCount);
        setPlusOneNames(data.plusOneNames);
      }
      await fetchActivities();
      setLoading(false);
    }
    load();
  }, [token, fetchActivities]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setSaved(false);
    await fetch(`/api/invite/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        foodPreference, allergies, sleepover,
        sleepoverFrom: sleepover ? sleepoverFrom : null,
        sleepoverTo: sleepover ? sleepoverTo : null,
        plusOneCount, plusOneNames: plusOneNames.slice(0, plusOneCount),
      }),
    });
    const res = await fetch(`/api/invite/${token}`);
    setGuest(await res.json());
    await fetchActivities();
    setSaving(false); setSaved(true);
  }

  function setPlusOneName(index: number, name: string) {
    setPlusOneNames((prev) => { const next = [...prev]; next[index] = name; return next; });
  }
  function handlePlusOneCountChange(count: number) {
    setPlusOneCount(count);
    setPlusOneNames((prev) => { const next = [...prev]; while (next.length < count) next.push(""); return next; });
  }
  function getActivitiesForDate(dateStr: string) {
    return activities.filter((a) => a.date.startsWith(dateStr)).sort((a, b) => a.time.localeCompare(b.time));
  }

  if (loading) {
    return (
      <div className="guest-bg min-h-screen flex items-center justify-center">
        <p className="text-navy font-mono text-lg font-bold uppercase tracking-widest">Laden...</p>
      </div>
    );
  }
  if (error || !guest) {
    return (
      <div className="guest-bg min-h-screen flex items-center justify-center p-6">
        <div className="brutal-card p-8 max-w-sm text-center">
          <h1 className="text-2xl font-black text-navy uppercase mb-2">FEHLER</h1>
          <p className="text-navy font-mono text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guest-bg min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-8 md:py-12">

        {/* HEADER */}
        <header className="mb-10">
          <div className="brutal-badge mb-4">19.&ndash;21. Juni 2026</div>
          <h1 className="text-5xl md:text-6xl font-black text-navy uppercase leading-none mb-3 tracking-tight">
            Hallo<br />
            <span className="text-pink">{guest.name}</span>
            <span className="text-gold">!</span>
          </h1>
          <p className="text-navy/70 font-mono text-sm max-w-md leading-relaxed">
            Du bist eingeladen zur Geburtstagsfeier. Füll das hier aus,
            damit wir planen können.
          </p>
        </header>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* Essen */}
          <Accordion title="Essen"
            tag={foodPreference ? FOOD_OPTIONS.find((o) => o.value === foodPreference)?.label : undefined}
            defaultOpen={!guest.profileComplete}
            shadowClass="brutal-card-pink" tagBg="bg-pink text-cream" borderColor="border-pink">
            <p className="text-navy/60 font-mono text-xs mb-4">Was darf&apos;s sein?</p>
            <div className="grid grid-cols-3 gap-3">
              {FOOD_OPTIONS.map((opt) => (
                <label key={opt.value}
                  className={`flex flex-col items-center gap-2 py-4 px-2 cursor-pointer text-sm ${
                    foodPreference === opt.value ? "brutal-pill-pink" : "brutal-pill"
                  }`}>
                  <input type="radio" name="food" value={opt.value} checked={foodPreference === opt.value}
                    onChange={(e) => setFoodPreference(e.target.value)} className="sr-only" />
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="font-black text-xs tracking-wider">{opt.label}</span>
                </label>
              ))}
            </div>
          </Accordion>

          {/* Allergien */}
          <Accordion title="Allergien" tag={allergies ? "ausgefüllt" : undefined}
            defaultOpen={!guest.profileComplete}
            shadowClass="brutal-card-gold" tagBg="bg-gold text-navy" borderColor="border-gold">
            <p className="text-navy/60 font-mono text-xs mb-3">Unverträglichkeiten? Lass es uns wissen.</p>
            <textarea value={allergies} onChange={(e) => setAllergies(e.target.value)}
              placeholder="Laktose, Nüsse, Gluten..." className="brutal-input w-full resize-none" rows={2} />
          </Accordion>

          {/* Begleitung */}
          <Accordion title="Begleitung" tag={plusOneCount > 0 ? `+${plusOneCount}` : undefined}
            defaultOpen={!guest.profileComplete}
            shadowClass="brutal-card-olive" tagBg="bg-olive text-cream" borderColor="border-olive">
            <p className="text-navy/60 font-mono text-xs mb-4">Wie viele Personen bringst du mit?</p>
            <div className="flex items-center gap-4 mb-4">
              <button type="button" onClick={() => handlePlusOneCountChange(Math.max(0, plusOneCount - 1))}
                className="brutal-pill w-12 h-12 flex items-center justify-center text-2xl font-black">&minus;</button>
              <div className="brutal-card-accent w-16 h-12 flex items-center justify-center">
                <span className="text-2xl font-black">{plusOneCount}</span>
              </div>
              <button type="button" onClick={() => handlePlusOneCountChange(plusOneCount + 1)}
                className="brutal-pill w-12 h-12 flex items-center justify-center text-2xl font-black">+</button>
            </div>
            {plusOneCount > 0 && (
              <div className="space-y-2">
                <p className="text-navy font-mono text-xs font-bold uppercase">Namen (optional)</p>
                {Array.from({ length: plusOneCount }).map((_, i) => (
                  <input key={i} value={plusOneNames[i] || ""} onChange={(e) => setPlusOneName(i, e.target.value)}
                    placeholder={`Person ${i + 1}`} className="brutal-input w-full" />
                ))}
              </div>
            )}
          </Accordion>

          {/* Übernachtung */}
          <Accordion title="Übernachtung" tag={sleepover ? "ja" : undefined}
            defaultOpen={!guest.profileComplete}
            shadowClass="brutal-card-wine" tagBg="bg-wine text-cream" borderColor="border-wine">
            <p className="text-navy/60 font-mono text-xs mb-4">Platz ist da &mdash; bleib doch!</p>
            <div className="grid grid-cols-2 gap-3">
              <label className={`py-3 cursor-pointer text-sm ${sleepover ? "brutal-pill-olive" : "brutal-pill"}`}>
                <input type="radio" name="sleepover" checked={sleepover} onChange={() => setSleepover(true)} className="sr-only" />
                <span className="font-black">JA!</span>
              </label>
              <label className={`py-3 cursor-pointer text-sm ${!sleepover ? "brutal-pill-pink" : "brutal-pill"}`}>
                <input type="radio" name="sleepover" checked={!sleepover} onChange={() => setSleepover(false)} className="sr-only" />
                <span className="font-black">NEIN</span>
              </label>
            </div>
            {sleepover && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-navy font-mono text-xs font-bold uppercase mb-2">Anreise</p>
                  <input type="date" value={sleepoverFrom} min="2026-06-19" max="2026-06-21"
                    onChange={(e) => setSleepoverFrom(e.target.value)} className="brutal-input w-full" />
                </div>
                <div>
                  <p className="text-navy font-mono text-xs font-bold uppercase mb-2">Abreise</p>
                  <input type="date" value={sleepoverTo} min={sleepoverFrom} max="2026-06-22"
                    onChange={(e) => setSleepoverTo(e.target.value)} className="brutal-input w-full" />
                </div>
              </div>
            )}
          </Accordion>

          {/* Submit */}
          <button type="submit" disabled={saving}
            className="btn-brutal w-full py-4 px-6 text-lg mt-2 disabled:opacity-50">
            {saving ? "SPEICHERN..." : guest.profileComplete ? "ÄNDERUNGEN SPEICHERN" : "ABSCHICKEN!"}
          </button>
          {saved && (
            <div className="brutal-card-accent mt-4 px-4 py-3 text-center">
              <p className="font-black uppercase text-sm tracking-wider">Gespeichert!</p>
            </div>
          )}
        </form>

        {/* ACTIVITIES TAB VIEW */}
        {guest.profileComplete && activities.length > 0 && (
          <section className="mt-12">
            <div className="zigzag mb-6" />
            <h2 className="text-3xl font-black text-navy uppercase mb-6 tracking-tight">Programm</h2>

            {/* Tab bar */}
            <div className="flex overflow-hidden" style={{ border: "3px solid #033F63" }}>
              {DAY_TABS.map((tab, idx) => {
                const isActive = activeTab === tab.date;
                const count = getActivitiesForDate(tab.date).length;
                return (
                  <button key={tab.date} type="button" onClick={() => setActiveTab(tab.date)}
                    className={`flex-1 py-3 px-2 text-center font-black uppercase text-sm ${
                      isActive ? TAB_ACTIVE[idx] : "bg-cream text-navy hover:bg-cream-dark"
                    }`}
                    style={idx < 2 ? { borderRight: "3px solid #033F63" } : {}}>
                    <span className="block">{tab.label}</span>
                    {count > 0 && (
                      <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 font-black ${
                        isActive ? "bg-cream text-navy" : "bg-gold text-navy"
                      }`}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="bg-cream p-4" style={{ border: "3px solid #033F63", borderTop: "none" }}>
              {(() => {
                const dayActivities = getActivitiesForDate(activeTab);
                const activeTabInfo = DAY_TABS.find((t) => t.date === activeTab);
                const tabIdx = DAY_TABS.findIndex((t) => t.date === activeTab);
                const stripColor = TAB_COLORS[tabIdx];

                if (dayActivities.length === 0) {
                  return (
                    <div className="py-8 text-center">
                      <p className="text-navy/50 font-mono text-sm">
                        Noch nichts geplant für {activeTabInfo?.full}.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {dayActivities.map((a) => {
                      const rsvp = a.rsvps[0];
                      return (
                        <Link key={a.id} href={`/invite/${token}/activity/${a.id}`}
                          className="brutal-card block p-0 overflow-hidden">
                          <div className="flex">
                            <div className={`${stripColor} flex flex-col items-center justify-center px-3 py-3 min-w-[72px]`}
                              style={{ borderRight: "3px solid #033F63" }}>
                              <span className="font-mono text-[11px] text-cream font-bold">
                                {a.time.split(" - ")[0]}
                              </span>
                              {a.time.includes(" - ") && (
                                <>
                                  <span className="text-cream/50 text-[10px]">|</span>
                                  <span className="font-mono text-[11px] text-cream font-bold">
                                    {a.time.split(" - ")[1]}
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-black text-navy uppercase text-base mb-1">{a.title}</h3>
                                  <p className="font-mono text-xs text-navy/50">{a.location}</p>
                                </div>
                                {rsvp ? (
                                  <span className={`text-xs font-black uppercase px-2 py-1 border-2 border-navy whitespace-nowrap ${
                                    rsvp.status === "ATTENDING" ? "bg-olive text-cream" : "bg-pink text-cream"
                                  }`}>
                                    {rsvp.status === "ATTENDING" ? "DABEI" : "ABSAGE"}
                                  </span>
                                ) : (
                                  <span className="text-xs font-black uppercase px-2 py-1 border-2 border-navy bg-gold text-navy whitespace-nowrap">
                                    OFFEN
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </section>
        )}

        {/* FOOTER */}
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
