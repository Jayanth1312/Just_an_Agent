"use client";

import { Drawer } from "vaul";
import { HistoryIcon, type HistoryIconHandle } from "./history";
import { useRef } from "react";

interface HistoryDrawerProps {
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export default function HistoryDrawer({
  children,
  onOpenChange,
}: HistoryDrawerProps) {
  const historyIconRef = useRef<HistoryIconHandle>(null);

  return (
    <Drawer.Root direction="right" onOpenChange={onOpenChange}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content
          className="right-2 top-2 bottom-2 fixed z-50 outline-none w-[420px] flex"
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
        >
          <div className="bg-zinc-50 h-full w-full grow p-5 flex flex-col rounded">
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-medium mb-4 text-zinc-900 flex items-center gap-2">
                <HistoryIcon ref={historyIconRef} size={20} />
                Chat History
              </Drawer.Title>
              <Drawer.Description className="text-zinc-600 mb-4">
                View your previous conversations and chat history.
              </Drawer.Description>

              {/* History content will go here */}
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Today</p>
                    <p className="text-sm font-medium">
                      Previous conversation...
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Yesterday</p>
                    <p className="text-sm font-medium">
                      Another conversation...
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Last week</p>
                    <p className="text-sm font-medium">Older conversation...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
