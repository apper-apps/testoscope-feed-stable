import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import "@/index.css";
import WizardNavigation from "@/components/organisms/WizardNavigation";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* Header */}
      <header className="bg-white border-b border-surface-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">TestoScope</h1>
              <span className="ml-2 text-sm text-surface-500">AI-Powered Hormone Analysis</span>
            </div>
          </div>
          <WizardNavigation />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Layout;