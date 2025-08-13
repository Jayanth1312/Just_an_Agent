"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DynamicText from "@/components/ui/dynamic-text";
import Home from "@/components/Home";

const WelcomePage = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleDynamicTextComplete = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowWelcome(false);
    }, 800);
  };

  if (!showWelcome) {
    return <Home />;
  }

  const curtainVariants = {
    initial: { y: 0 },
    exit: { y: "-100%" },
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <Home />
      </div>

      {/* Welcome page curtain */}
      <AnimatePresence>
        {!isClosing && (
          <motion.div
            className="absolute inset-0 bg-white flex items-center justify-center z-10"
            initial="initial"
            exit="exit"
            variants={curtainVariants}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          >
            <DynamicText onComplete={handleDynamicTextComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomePage;
