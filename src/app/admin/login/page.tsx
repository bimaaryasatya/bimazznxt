"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Masukkan passkey admin");
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      toast.success("Welcome back!", {
        description: "Redirecting to Curator Studio...",
      });

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Invalid passkey");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-sm">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-cyan-400 dark:hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Archive
        </Link>

        {/* Curator Login Card */}
        <div className="border border-zinc-200 dark:border-white/10 rounded-2xl p-7 bg-white dark:bg-zinc-950/80 shadow-xl dark:shadow-2xl relative">
          {/* Header */}
          <div className="space-y-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black flex items-center justify-center font-bold text-sm mb-4">
              ▲
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Curator Studio Access
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Masukkan passkey admin untuk mengelola arsip.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-medium text-xs block">
                Passkey
              </label>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator passkey..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-300 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 text-white hover:bg-black dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 font-semibold text-xs flex items-center justify-center gap-2 shadow-md dark:shadow-lg transition-all"
            >
              {isLoading ? (
                "Authenticating..."
              ) : (
                <>
                  Continue to Studio
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
