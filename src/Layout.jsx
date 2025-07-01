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

      {/* Footer */}
      <footer className="bg-surface-50 border-t border-surface-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex flex-wrap justify-center items-center gap-4 mb-4 text-sm text-surface-600">
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <span className="text-surface-300">•</span>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <span className="text-surface-300">•</span>
              <a href="#" className="hover:text-primary transition-colors">Cookie Declaration</a>
            </div>
            <p className="text-xs text-surface-500 max-w-4xl mx-auto leading-relaxed">
              The information, content, and materials presented here are for informational and educational purposes only. 
              They do not constitute medical advice, diagnosis, or treatment, and should not be considered a substitute for professional medical
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;