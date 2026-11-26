// File: src/actions/auth.ts
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AuthState = { error?: string };

export async function registerAction(
  prevState: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const name = formData.get("name") as string;
  const nim = (formData.get("nim") as string | null)?.trim() || null;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Semua kolom wajib diisi!" };
  }

  if (password.length < 6) {
    return { error: "Password minimal 6 karakter!" };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return { error: "Email sudah terdaftar! Silakan gunakan email lain." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      nim,
      email,
      password: hashedPassword,
    },
  });

  redirect("/login");
}

export async function loginAction(
  prevState: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi!" };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "Email tidak ditemukan dalam sistem!" };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return { error: "Password yang Anda masukkan salah!" };
  }

  const sessionPayload = JSON.stringify({
    id: user.id,
    name: user.name,
    nim: user.nim,
    email: user.email,
    role: user.role,
    loginAt: new Date().toISOString(),
  });

  const cookieStore = await cookies();

  cookieStore.set("praktikum_session", sessionPayload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("praktikum_session");
  redirect("/login");
}
