"use client";
import React from "react";
import { motion } from "framer-motion";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-[9999]">
      <motion.div
        className="w-16 h-16 border-4 border-t-[#F4400D] border-gray-300 rounded-full animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
      <motion.p
        className="mt-4 text-lg font-semibold text-[#2F2A76] dark:text-white tracking-wide"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Loading Edura...
      </motion.p>
    </div>
  );
};

export default Loader;
