import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { BottomMenu } from "../components/BottomMenu";


export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  return (
    <div className="flex w-full min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-16 md:p-8 pb-16 md:pb-8">
        <Outlet />
      </main>
      <BottomMenu hidden={isChatPage} />
    </div>
  );
};
