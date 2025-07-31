import React from 'react';

const Calendar2025: React.FC = () => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const renderMonthGrid = (monthIndex: number) => {
        const daysInMonth = getDaysInMonth(monthIndex, 2025);
        const firstDay = getFirstDayOfMonth(monthIndex, 2025);
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="h-10 w-10"></div>
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = new Date().getDate() === day &&
                new Date().getMonth() === monthIndex &&
                new Date().getFullYear() === 2025;

            days.push(
                <div
                    key={day}
                    className={`h-10 w-10 flex items-center justify-center text-sm  cursor-pointer transition-colors ${isToday
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                >
                    {day}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {daysOfWeek.map((day) => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-slate-600">
                        {day}
                    </div>
                ))}
                {/* Calendar days */}
                {days}
            </div>
        );
    };

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Calendar 2025</h1>
                <p className="text-slate-600">Academic year calendar view</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0">
                {months.map((month, index) => (
                    <div key={month} className="bg-white border border-slate-200">
                        <div className="p-4 bg-slate-50 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-800">{month}</h3>
                        </div>

                        <div className="p-4">
                            {renderMonthGrid(index)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar2025;