"use client";

import React, { useRef, useState } from "react";
import { PlusIcon, type PlusIconHandle } from "./plus";
import { HistoryIcon, type HistoryIconHandle } from "./history";
import { CogIcon, type CogIconHandle } from "./cog";
import { LogoutIcon, type LogoutIconHandle } from "./logout";
import HistoryDrawer from "./history-drawer";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth";

interface LeftNavProps {
  onNewChat?: () => void;
  onHistory?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
}

export default function LeftNav({
  onNewChat,
  onHistory,
  onSettings,
  onLogout,
}: LeftNavProps) {
  const plusIconRef = useRef<PlusIconHandle>(null);
  const historyIconRef = useRef<HistoryIconHandle>(null);
  const cogIconRef = useRef<CogIconHandle>(null);
  const logoutIconRef = useRef<LogoutIconHandle>(null);

  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      onLogout?.();
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie =
          name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/sign-in");
    }
  };

  return (
    <div
      className={cn(
        "fixed left-4 top-1/2 -translate-y-1/2",
        isHistoryDrawerOpen ? "z-0" : "z-[60]"
      )}
    >
      <div className="flex flex-col gap-3 bg-transparent p-2">
        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          onMouseEnter={() => plusIconRef.current?.startAnimation()}
          onMouseLeave={() => plusIconRef.current?.stopAnimation()}
          className={cn(
            "flex items-center justify-center w-12 h-12",
            "transition-all duration-200 cursor-pointer",
            "text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded"
          )}
          aria-label="New Chat"
          title="New Chat"
        >
          <PlusIcon ref={plusIconRef} size={20} />
        </button>

        {/* History Button */}
        <HistoryDrawer
          onOpenChange={(open) => {
            setIsHistoryDrawerOpen(open);
            if (open) {
              historyIconRef.current?.startAnimation();
            } else {
              historyIconRef.current?.stopAnimation();
            }
            onHistory?.();
          }}
        >
          <button
            onMouseEnter={() => historyIconRef.current?.startAnimation()}
            onMouseLeave={() => historyIconRef.current?.stopAnimation()}
            className={cn(
              "flex items-center justify-center w-12 h-12",
              "transition-all duration-200 cursor-pointer",
              "text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
            )}
            aria-label="History"
            title="History"
          >
            <HistoryIcon ref={historyIconRef} size={20} />
          </button>
        </HistoryDrawer>
        <button
          onClick={onSettings}
          onMouseEnter={() => cogIconRef.current?.startAnimation()}
          onMouseLeave={() => cogIconRef.current?.stopAnimation()}
          className={cn(
            "flex items-center justify-center w-12 h-12",
            "transition-all duration-200 cursor-pointer",
            "text-gray-600 hover:text-amber-700 hover:bg-amber-50 rounded"
          )}
          aria-label="Settings"
          title="Settings"
        >
          <CogIcon ref={cogIconRef} size={20} />
        </button>
        <button
          onClick={handleLogout}
          onMouseEnter={() => logoutIconRef.current?.startAnimation()}
          onMouseLeave={() => logoutIconRef.current?.stopAnimation()}
          className={cn(
            "flex items-center justify-center w-12 h-12",
            "transition-all duration-200 cursor-pointer",
            "text-gray-600 hover:text-red-500 hover:bg-red-50 rounded"
          )}
          aria-label="Logout"
          title="Logout"
        >
          <LogoutIcon ref={logoutIconRef} size={20} />
        </button>
      </div>
    </div>
  );
}
