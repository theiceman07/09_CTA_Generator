"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export function DashboardLayout({
  children,
  breadcrumbs = [],
  action,
}: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090d16]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Checking credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#090d16]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header breadcrumbs={breadcrumbs} action={action} />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
