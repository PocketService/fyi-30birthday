import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-warm-800 mb-4">
          Geburtstagsfeier
        </h1>
        <p className="text-warm-600 mb-2 text-lg">19. - 21. Juni</p>
        <p className="text-warm-500 mb-8">
          Hast du eine Einladung erhalten? Nutze den Link aus deiner Einladung,
          um dich anzumelden.
        </p>
        <Link
          href="/admin/login"
          className="text-sm text-warm-400 hover:text-warm-600 transition-colors"
        >
          Admin
        </Link>
      </div>
    </main>
  );
}
