import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

export default function Layout() {
  return (
    <div>
      <Header />

      <div className="min-h-screen bg-background md:mt-[56px]">
        <Sidebar />
        <div className="md:pl-64 overflow-x-hidden">
          <Outlet />
        </div>
        {/* Add padding bottom for mobile to account for bottom navigation */}
        <div className="h-16 md:hidden" />
      </div>
    </div>
  );
}