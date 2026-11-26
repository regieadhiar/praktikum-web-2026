// File: src/app/login/page.tsx
"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Login Sistem</h1>
        <p className="text-sm text-slate-500 mb-6">Masuk untuk mengakses Dashboard terproteksi.</p>

        {state?.error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="mahasiswa@itg.ac.id"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg cursor-pointer disabled:opacity-60"
          >
            {isPending ? "Memverifikasi..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 space-y-1">
          <p>
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">
              Daftar Akun Baru
            </Link>
          </p>
          <p>
            <Link href="/" className="text-slate-500 hover:underline">
              &larr; Kembali ke Beranda
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
