import React from 'react';
import { Calendar, BookOpen, CheckSquare, Menu, X } from 'lucide-react';

type ActiveSection = 'calendar' | 'subjects' | 'todo';

interface SidebarProps {
    activeSection: ActiveSection;
    onSectionChange: (section: ActiveSection) => void;
    isOpen: boolean;
    onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeSection,
    onSectionChange,
    isOpen,
    onToggle,
}) => {
    const menuItems = [
        {
            id: 'todo' as ActiveSection,
            label: 'Todos',
            icon: CheckSquare,
            description: 'Track your tasks',
        },
        {
            id: 'calendar' as ActiveSection,
            label: 'Calendar 2025',
            icon: Calendar,
            description: 'View yearly calendar',
        },
        {
            id: 'subjects' as ActiveSection,
            label: 'Track Subjects',
            icon: BookOpen,
            description: 'Manage your subjects',
        },
    ];

    return (
        <>
            {/* Mobile toggle button */}
            <button
                onClick={onToggle}
                className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2  shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full bg-white shadow-xl border-r border-slate-200 transition-transform z-50 w-80 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Your Work Desk</h1>
                    <p className="text-slate-600 text-sm mb-8">Organize your academic life</p>

                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        window.location.hash = item.id;
                                        onSectionChange(item.id);
                                        if (window.innerWidth < 1024) {
                                            onToggle();
                                        }
                                    }}
                                    className={`w-full cursor-pointer flex items-center gap-3 p-4  text-left transition-all duration-200 group ${isActive
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                        }`}
                                >
                                    <Icon
                                        size={20}
                                        className={`${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                                            } transition-colors`}
                                    />
                                    <div className="flex-1">
                                        <div className={`font-medium ${isActive ? 'text-blue-700' : ''}`}>
                                            {item.label}
                                        </div>
                                        <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-600' : 'text-slate-500'
                                            }`}>
                                            {item.description}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200">
                    <div className="text-xs text-slate-500 text-center">
                        Academic Year 2025
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;