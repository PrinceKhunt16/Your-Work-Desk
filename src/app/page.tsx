"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Calendar2025 from '../components/Calendar2025';
import TrackSubjects from '../components/TrackSubjects';
import TodoList from '../components/TodoList';

type ActiveSection = 'calendar' | 'subjects' | 'todo';

function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('todo');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['calendar', 'subjects', 'todo'].includes(hash)) {
        setActiveSection(hash as ActiveSection);
      }
    };

    // Run on first load
    handleHashChange();

    // Add event listener
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'calendar':
        return <Calendar2025 />;
      case 'subjects':
        return <TrackSubjects />;
      case 'todo':
        return <TodoList />;
      default:
        return <Calendar2025 />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="lg:ml-80">
        <main className="p-6 lg:p-8">{renderActiveSection()}</main>
      </div>
    </div>
  );
}

export default App;
