"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";

export default function SidebarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <main className="w-full">{children}</main>
    </div>
  );
}
