"use client";

import {
  IconCode,
  IconCalculator,
  IconPencil,
  IconCoffee,
  IconLanguage,
  IconChevronDown,
} from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PromptTrayProps {
  onPromptSelect: (prompt: string) => void;
}

export default function PromptTray({ onPromptSelect }: PromptTrayProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const promptCategories = [
    {
      icon: IconCode,
      text: "Code",
      category: "code",
      prompts: [
        "Help me debug this code",
        "Review my code for best practices",
        "Explain how this code works",
        "Optimize this code for performance",
        "Convert this code to another language",
      ],
    },
    {
      icon: IconCalculator,
      text: "Math",
      category: "math",
      prompts: [
        "Solve this math problem step by step",
        "Explain this mathematical concept",
        "Help me with calculus problems",
        "Verify my calculations",
        "Create practice problems for me",
      ],
    },
    {
      icon: IconPencil,
      text: "Write",
      category: "write",
      prompts: [
        "Help me write an essay",
        "Improve my writing style",
        "Create a summary of this content",
        "Write a professional email",
        "Generate creative content",
      ],
    },
    {
      icon: IconCoffee,
      text: "Life",
      category: "life",
      prompts: [
        "Give me life advice",
        "Help me make a decision",
        "Suggest productivity tips",
        "Plan my daily routine",
        "Recommend healthy habits",
      ],
    },
    {
      icon: IconLanguage,
      text: "Learn",
      category: "learn",
      prompts: [
        "Explain this topic simply",
        "Create a study plan",
        "Quiz me on this subject",
        "Translate this text",
        "Teach me something new",
      ],
    },
  ];

  const handlePromptClick = (prompt: string) => {
    onPromptSelect(prompt);
    setOpenDropdown(null);
  };

  const toggleDropdown = (category: string) => {
    setOpenDropdown(openDropdown === category ? null : category);
  };

  return (
    <div className="px-2 sm:px-4" ref={dropdownRef}>
      <div className="flex flex-wrap justify-center gap-2 xs:gap-3 sm:gap-4">
        {promptCategories.map((category, index) => {
          const IconComponent = category.icon;
          const isOpen = openDropdown === category.category;

          return (
            <div key={index} className="relative">
              <button
                onClick={() => toggleDropdown(category.category)}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-white",
                  "text-gray-600 hover:text-black",
                  "transition-all duration-200 cursor-pointer",
                  "text-xs sm:text-sm md:text-base",
                  isOpen ? "border-gray-300" : "border-gray-200"
                )}
              >
                <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">{category.text}</span>
                <IconChevronDown
                  className={cn(
                    "w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-200",
                    isOpen ? "rotate-180" : ""
                          )}
                          stroke={2}
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute top-full left-0 mt-1 min-w-48 sm:min-w-64 bg-white border rounded-md shadow-sm z-20">
                  <div className="py-1">
                    {category.prompts.map((prompt, promptIndex) => (
                      <button
                        key={promptIndex}
                        onClick={() => handlePromptClick(prompt)}
                        className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
