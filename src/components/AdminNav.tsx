"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin/activities", label: "Aktivitäten" },
  { href: "/admin/guests", label: "Gäste" },
  { href: "/admin/rsvps", label: "Rückmeldungen" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <nav className="bg-white border-b border-warm-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-bold text-warm-800">Admin</span>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm transition-colors ${
              pathname === link.href
                ? "text-warm-700 font-medium"
                : "text-warm-400 hover:text-warm-600"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-warm-400 hover:text-rose-500 transition-colors"
      >
        Abmelden
      </button>
    </nav>
  );
}
