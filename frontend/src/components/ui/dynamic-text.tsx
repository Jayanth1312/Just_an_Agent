"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Greeting {
  text: string;
  language: string;
}

interface DynamicTextProps {
  onComplete?: () => void;
}

const greetings: Greeting[] = [
  { text: "Hello", language: "English" },
  { text: "नमस्ते", language: "Hindi" },
  { text: "こんにちは", language: "Japanese" },
  { text: "Bonjour", language: "French" },
  { text: "Hola", language: "Spanish" },
  { text: "Ciao", language: "Italian" },
  { text: "Just an Agent", language: "English" },
];

const DynamicText = ({ onComplete }: DynamicTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(
      () => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;

          if (nextIndex >= greetings.length) {
            clearInterval(interval);
            setIsAnimating(false);
            setTimeout(() => {
              onComplete?.();
            }, 900);
            return prevIndex;
          }

          return nextIndex;
        });
      },
      currentIndex === greetings.length - 2 ? 300 : 300
    );

    return () => clearInterval(interval);
  }, [isAnimating, currentIndex]);

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
  };

  return (
    <section
      className="flex min-h-[200px] items-center justify-center gap-1 p-4"
      aria-label="Rapid greetings in different languages"
    >
      <div className="relative h-16 w-60 flex items-center justify-center overflow-visible">
        {isAnimating ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentIndex}
              className={`absolute flex items-center gap-2 font-medium text-black ${
                greetings[currentIndex].text === "Just an Agent"
                  ? "font-pecita text-3xl"
                  : "text-2xl"
              }`}
              aria-live="off"
              initial={textVariants.hidden}
              animate={textVariants.visible}
              exit={textVariants.exit}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {greetings[currentIndex].text !== "Just an Agent" && (
                <div
                  className="h-2 w-2 rounded-full bg-black"
                  aria-hidden="true"
                />
              )}
              {greetings[currentIndex].text}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div
            className={`flex items-center gap-2 font-medium text-black ${
              greetings[currentIndex].text === "Just an Agent"
                ? "font-pecita text-3xl"
                : "text-2xl"
            }`}
          >
            {greetings[currentIndex].text !== "Just an Agent" && (
              <div
                className="h-2 w-2 rounded-full bg-black"
                aria-hidden="true"
              />
            )}
            {greetings[currentIndex].text}
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicText;
