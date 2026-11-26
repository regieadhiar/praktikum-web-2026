// File: src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-3">
          {process.env.APP_NAME || "Praktikum Pemrograman Web - Next.js 16"}
        </h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Modul 8: Pengenalan Next.js 16, Koneksi Database MySQL, Implementasi Login, Session Cookie,
          serta Proteksi Halaman dengan proxy.ts.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/register"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg"
          >
            Registrasi Akun
          </Link>
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg"
          >
            Login Sistem
          </Link>
          <Link
            href="/dashboard"
            className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-5 py-2.5 rounded-lg"
          >
            Akses Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
