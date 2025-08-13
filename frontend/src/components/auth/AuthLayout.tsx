import React from "react";
import { VercelIcon, KimiIcon } from "./AuthIcons";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Vertical Grid Lines - Hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div className="h-full w-px bg-grid-border absolute left-[15%]"></div>
        <div className="h-full w-px bg-grid-border absolute right-[15%]"></div>
      </div>

      {/* Horizontal Grid Lines - Responsive positioning */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-px bg-grid-border absolute top-[9%] md:top-[9%] lg:top-[9%]"></div>
        <div className="w-full h-px bg-grid-border absolute bottom-[9%] md:bottom-[9%] lg:bottom-[9%]"></div>
      </div>

      {/* 3x3 Grid Layout Container - Responsive */}
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[15%_1fr_15%] grid-rows-[10%_1fr_10%] md:grid-rows-[15%_1fr_15%] lg:grid-rows-[10%_1fr_10%] relative z-10">
        {/* Top Left - Empty (Hidden on mobile) */}
        <div className="hidden md:block"></div>

        {/* Top - Logo */}
        <div className="flex items-center justify-start p-6">
          <h1 className="font-pecita text-start text-2xl sm:text-2xl md:text-3xl lg:text-3xl">
            Just an <span className="text-blue-500 font-semibold">Agent</span>
          </h1>
        </div>

        {/* Top Right - Empty (Hidden on mobile) */}
        <div className="hidden md:block"></div>

        {/* Middle Left - Empty (Hidden on mobile) */}
        <div className="hidden md:block"></div>

        {/* Middle Center - Main Content */}
        <div className="flex items-center justify-center p-4 md:p-8">
          {children}
        </div>

        {/* Middle Right - Empty (Hidden on mobile) */}
        <div className="hidden md:block"></div>

        {/* Bottom Left - Empty (Hidden on mobile) */}
        <div className="hidden md:block"></div>

        {/* Bottom Center - Footer */}
        <div className="flex items-center justify-between p-4 md:p-7">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-xs sm:text-sm text-muted-foreground">
              Hosted on
            </span>
            <VercelIcon />
            <span className="text-xs sm:text-sm font-medium text-foreground">
              Vercel
            </span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-xs sm:text-sm text-muted-foreground">
              Powered by
            </span>
            <KimiIcon />
          </div>
        </div>

        {/* Bottom Right - Empty (Hidden on mobile) */}
        <div className="hidden md:block"></div>
      </div>
    </div>
  );
};
