import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Edit,
  LayoutDashboard,
  MessageSquare,
  Moon,
  Sun,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  getAppliedTheme,
  getSettings,
  saveSettings,
} from "../services/httpClient";

import type { SidebarProps } from "../interfaces/components/sidebar-props-interface";

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => getAppliedTheme() === "dark");

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(getAppliedTheme() === "dark");
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    window.addEventListener("theme:changed", syncTheme);
    window.addEventListener("storage", syncTheme);
    mediaQuery.addEventListener("change", syncTheme);

    return () => {
      window.removeEventListener("theme:changed", syncTheme);
      window.removeEventListener("storage", syncTheme);
      mediaQuery.removeEventListener("change", syncTheme);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    const settings = getSettings();
    saveSettings({ ...settings, theme: nextTheme });
  };

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { 
      to: "/editors", 
      icon: Edit, 
      label: "Editors",
      isEditorsLink: true
    },
    { to: "/chat", icon: MessageSquare, label: "Chat" },
  ];

  return (
    <aside
className={twMerge(
  "hidden md:flex fixed left-0 top-0 flex-col w-16 h-full bg-white dark:bg-gray-900/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white transition-all duration-300 z-50",
  className,
)}
    >
      <nav className="flex-1 py-4 flex flex-col gap-4 items-center">
        {navItems.map((item) => {
          // Special handling for editors link
          if (item.isEditorsLink) {
            return (
              <button
                key={item.to}
                onClick={() => {
                  const lastEditor = sessionStorage.getItem('lastEditorPath') || '/editors/salary';
                  navigate(lastEditor);
                }}
                title={item.label}
                className={clsx(
                  "flex items-center justify-center w-10 h-10 rounded-lg transition-colors group cursor-pointer",
                  location.pathname.startsWith(item.to)
                    ? "bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                )}
              >
                <item.icon className="w-6 h-6 shrink-0" />
              </button>
            );
          }
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                clsx(
                  "flex items-center justify-center w-10 h-10 rounded-lg transition-colors group",
                  isActive
                    ? "bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                )}
            >
              <item.icon className="w-6 h-6 shrink-0" />
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 flex justify-center border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};
