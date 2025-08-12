"use client";

import React, { useState, useEffect } from "react";
import { IconArrowUp, IconPaperclip } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import PromptTray from "@/components/ui/prompt-tray";

interface AI_PromptProps {
  value?: string;
  onChange?: (v: string) => void;
  onSend?: () => void;
  disabled?: boolean;
}

export default function AI_Prompt(props: AI_PromptProps) {
  const [internalValue, setInternalValue] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 72,
    maxHeight: 150,
  });

  const value = props.value !== undefined ? props.value : internalValue;
  const setValue = props.onChange ? props.onChange : setInternalValue;

  // Detect if device supports touch (mobile/tablet)
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };

    checkTouchDevice();
    window.addEventListener("resize", checkTouchDevice);

    return () => window.removeEventListener("resize", checkTouchDevice);
  }, []);

  const handlePromptSelect = (prompt: string) => {
    setValue(prompt);
    textareaRef.current?.focus();
    setTimeout(() => adjustHeight(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // For touch devices (mobile/tablet), Enter key should create new line
    if (isTouchDevice) {
      // Allow Enter key to create new lines on touch devices
      return;
    }

    // For desktop devices, Enter sends message (unless Shift+Enter for new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        handleSendMessage();
      }
    }
  };

  const handleSendMessage = () => {
    if (value.trim()) {
      if (props.onSend) {
        props.onSend();
      } else {
        // fallback for standalone usage
        setInternalValue("");
      }
      setTimeout(() => adjustHeight(true), 0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };

  return (
    <div className="w-full space-y-3">
      {/* Main Input Field */}
      <div className="rounded border bg-white">
        <div className="relative">
          <div className="relative flex flex-col">
            <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
              <Textarea
                id="ai-input-15"
                value={value}
                placeholder={
                  isTouchDevice
                    ? "How can I help you today?"
                    : "How can I help you today?"
                }
                className={cn(
                  "w-full rounded px-4 py-3 !bg-white border-0 text-black placeholder:text-gray-500 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none caret-blue-600",
                  "min-h-[72px]"
                )}
                style={{ fontSize: "16px", backgroundColor: "white" }}
                ref={textareaRef}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                disabled={props.disabled}
              />
            </div>

            <div className="h-14 bg-white rounded flex items-center border-0">
              <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                <div className="flex items-center gap-2">
                  <label
                    className={cn(
                      "rounded px-2 py-1 bg-transparent cursor-pointer",
                      "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
                      "text-gray-500 hover:text-black"
                    )}
                    aria-label="Attach file"
                  >
                    <input type="file" className="hidden" />
                    <div className="flex items-center gap-1">
                      <IconPaperclip className="w-4 h-4 transition-colors" />
                      Attach
                    </div>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className={cn(
                    "rounded p-2 transition-colors",
                    value.trim()
                      ? "bg-gray-900 hover:bg-black text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                  aria-label="Send message"
                  disabled={props.disabled || !value.trim()}
                >
                  <IconArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt Tray Component */}
      <PromptTray onPromptSelect={handlePromptSelect} />
    </div>
  );
}
