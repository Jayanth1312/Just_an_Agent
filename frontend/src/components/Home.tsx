"use client";

import React, { useState } from "react";
import { BottomGrid } from "@/components/ui/footer";
import LeftNav from "@/components/ui/left-nav";
import AI_Prompt from "./kokonutui/ai-prompt";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [promptValue, setPromptValue] = useState("");

  const handleSend = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);
    // Simulate LLM response (replace with real API call)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Echo: ${message}` },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handlePrompt = (message: string) => {
    setDrawerOpen(true);
    handleSend(message);
    setPromptValue("");
  };

  const handleNewChat = () => {
    setMessages([]);
    setDrawerOpen(true);
  };

  const handleHistory = () => {
    // handle history logic
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col homepage-grid">
      {/* Left Navigation */}
      <LeftNav onNewChat={handleNewChat} onHistory={handleHistory} />

      {/* Title Section */}
      <div className="h-20 sm:h-24 md:h-28 lg:h-32"></div>
      <div className="flex-shrink-0 flex items-center justify-center pt-32 pb-8">
        <div className="text-center">
          <h1 className="font-pecita text-3xl sm:text-3xl md:text-4xl lg:text-4xl text-foreground">
            Just an <span className="text-blue-500 font-semibold">Agent</span>
          </h1>
        </div>
      </div>

      {/* Main Content - AI Prompt as trigger */}
      <div className="flex-1 flex flex-col px-4">
        <div className="w-full max-w-2xl mx-auto">
          <AI_Prompt
            value={promptValue}
            onChange={setPromptValue}
            onSend={() => {
              if (promptValue.trim()) {
                handlePrompt(promptValue);
              }
            }}
            disabled={loading}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 pb-20">
        <BottomGrid />
      </div>
    </div>
  );
}
