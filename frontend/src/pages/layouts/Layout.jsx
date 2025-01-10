import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function Layout() {
  let { user } = useContext(AuthContext);
  
  return (
    <div>
      {/* {user && <Header />} */}
      <Header />
      <div
        // className={`min-h-screen bg-background ${user ? "md:mt-[56px]" : ""}`}
        className={`min-h-screen bg-background md:mt-[56px]`}
      >
        {/* {user && <Sidebar />} */}
        <Sidebar />
        {/* <div className={`${user ? "md:pl-64 " : " "} overflow-x-hidden`}> */}
        <div className={`md:pl-64 overflow-x-hidden`}>
          <Outlet />
        </div>
        {/* Add padding bottom for mobile to account for bottom navigation */}
        <div className="h-16 md:hidden" />
      </div>
    </div>
  );
}
