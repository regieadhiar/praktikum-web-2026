// File: src/app/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("praktikum_session");

  if (!sessionCookie) redirect("/login");

  const userData = JSON.parse(sessionCookie.value);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-2">
              HALAMAN TERPROTEKSI (MYSQL SESSION)
            </span>
            <h1 className="text-2xl font-bold text-slate-800">Selamat Datang, {userData.name}</h1>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer"
            >
              Keluar (Logout)
            </button>
          </form>
        </div>

        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-2 text-sm text-slate-700">
          <h2 className="font-bold text-base text-slate-800 mb-3">Informasi Sesi Aktif:</h2>
          <p>
            <strong>ID Pengguna (MySQL):</strong> #{userData.id}
          </p>
          <p>
            <strong>Nama Lengkap:</strong> {userData.name}
          </p>
          <p>
            <strong>NIM:</strong> {userData.nim || "-"}
          </p>
          <p>
            <strong>Email Terdaftar:</strong> {userData.email}
          </p>
          <p>
            <strong>Hak Akses:</strong> {userData.role}
          </p>
          <p>
            <strong>Waktu Login:</strong> {new Date(userData.loginAt).toLocaleString("id-ID")}
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/dashboard/profile"
            className="inline-block bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            Lihat Halaman Profil &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
