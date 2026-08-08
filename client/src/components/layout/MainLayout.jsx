import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AIAssistantDrawer } from '../ai/AIAssistantDrawer';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

import { ErrorBoundary } from './ErrorBoundary';

export const MainLayout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const fetchInitialData = useAppStore((state) => state.fetchInitialData);

    useEffect(() => {
        if (fetchInitialData) fetchInitialData();
    }, [fetchInitialData]);

    return (<div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-6">
          <ErrorBoundary>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              {children}
            </motion.div>
          </ErrorBoundary>
        </main>
      </div>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer />
    </div>);
};
