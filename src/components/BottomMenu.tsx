import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Edit,
  MessageSquare,
} from "lucide-react";
import clsx from "clsx";

import type { BottomMenuProps } from "../interfaces/components/bottom-menu-props-interface";

export const BottomMenu: React.FC<BottomMenuProps> = ({ hidden = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

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

  if (hidden) {
    return null;
  }

  return (
    <nav
      className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[85vw] max-w-[300px] z-[1000] flex justify-around gap-1 bg-white dark:bg-gray-900 shadow-lg py-2 px-2 rounded-[2rem] border border-gray-200 dark:border-gray-800 pointer-events-auto touch-manipulation"
      style={{ zIndex: 99999 }}
    >
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
              className={clsx(
                "flex flex-col items-center justify-center flex-1 py-1 text-xs rounded-3xl transition-all cursor-pointer pointer-events-auto",
                location.pathname.startsWith(item.to)
                  ? "bg-emerald-200 dark:bg-emerald-600/40 text-emerald-800 dark:text-emerald-300"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-700/70 hover:text-emerald-800"
              )}
            >
              <div className="flex flex-col items-center justify-center">
                <item.icon className="w-6 h-6 mb-0.5" />
                <span className="text-[10px] font-medium mt-0.5 leading-tight text-center">{item.label}</span>
              </div>
            </button>
          );
        }
        
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center justify-center flex-1 py-1 text-xs rounded-3xl transition-all pointer-events-auto",
                isActive
                  ? "bg-emerald-200 dark:bg-emerald-600/40 text-emerald-800 dark:text-emerald-300"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-700/70 hover:text-emerald-800"
              )
            }
          >
            <div className="flex flex-col items-center justify-center">
              <item.icon className="w-6 h-6 mb-0.5" />
              <span className="text-[10px] font-medium mt-0.5 leading-tight text-center">{item.label}</span>
            </div>
          </NavLink>
        );
      })}
    </nav>
  );
};
