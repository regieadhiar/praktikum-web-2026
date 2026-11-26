// File: src/app/dashboard/profile/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("praktikum_session");

  if (!sessionCookie) redirect("/login");

  const userData = JSON.parse(sessionCookie.value);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-2">
          PROFIL TERPROTEKSI
        </span>
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Profil Pengguna</h1>

        <dl className="divide-y divide-slate-200 text-sm text-slate-700">
          <div className="flex justify-between gap-4 py-3">
            <dt className="font-semibold text-slate-800">Nama Lengkap</dt>
            <dd>{userData.name}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="font-semibold text-slate-800">NIM</dt>
            <dd>{userData.nim || "-"}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="font-semibold text-slate-800">Email</dt>
            <dd>{userData.email}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="font-semibold text-slate-800">Hak Akses</dt>
            <dd>{userData.role}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <Link href="/dashboard" className="text-blue-600 font-semibold hover:underline text-sm">
            &larr; Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
