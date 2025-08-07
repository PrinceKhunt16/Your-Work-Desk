import React, { useState, useEffect } from 'react';

interface CalendarMessage {
    date: string;
    message: string;
}

const Calendar2025: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<CalendarMessage[]>([]);
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);

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

    const formatDateKey = (day: number, month: number, year: number) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    // const normalizeDate = (dateString: string) => {
    //     // Ensure consistent date format for comparison
    //     const date = new Date(dateString);
    //     const year = date.getFullYear();
    //     const month = String(date.getMonth() + 1).padStart(2, '0');
    //     const day = String(date.getDate()).padStart(2, '0');
    //     return `${year}-${month}-${day}`;
    // };

    const getMessageForDate = (day: number, month: number) => {
        const dateKey = formatDateKey(day, month, 2025);
        return messages.find(msg => msg.date === dateKey);
    };

    const handleSaveMessage = () => {
        if (selectedDate && message.trim()) {
            const newMessage: CalendarMessage = {
                date: selectedDate, // Already normalized by date input
                message: message.trim(),
            };
    
            const existingIndex = messages.findIndex(msg => msg.date === selectedDate);
            if (existingIndex >= 0) {
                const updatedMessages = [...messages];
                updatedMessages[existingIndex] = newMessage;
                setMessages(updatedMessages);
                localStorage.setItem('calendarMessages', JSON.stringify(updatedMessages));
            } else {
                setMessages([...messages, newMessage]);
                localStorage.setItem('calendarMessages', JSON.stringify([...messages, newMessage]));
            }
            
            setMessage('');
            setSelectedDate('');
        }
    };

    const handleDateClick = (day: number, month: number) => {
        const dateKey = formatDateKey(day, month, 2025);
        const existingMessage = messages.find(msg => msg.date === dateKey);
    
        setSelectedDate(dateKey);
        setMessage(existingMessage ? existingMessage.message : '');
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
            
            const dateMessage = getMessageForDate(day, monthIndex);
            const dateKey = formatDateKey(day, monthIndex, 2025);
            const isHovered = hoveredDate === dateKey;

            days.push(
                <div
                    key={day}
                    className={`h-10 w-10 m-auto flex items-center justify-center text-sm cursor-pointer transition-colors relative ${
                        isToday
                            ? 'bg-cyan-500 text-white font-semibold'
                            : dateMessage
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'hover:bg-slate-100 text-sky-500'
                    }`}
                    onClick={() => handleDateClick(day, monthIndex)}
                    onMouseEnter={() => setHoveredDate(dateKey)}
                    onMouseLeave={() => setHoveredDate(null)}
                >
                    {day}
                    {dateMessage && isHovered && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs whitespace-nowrap z-10">
                            {dateMessage.message}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {daysOfWeek.map((day) => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-indigo-500">
                        {day}
                    </div>
                ))}
                {/* Calendar days */}
                {days}
            </div>
        );
    };

    // Load messages from localStorage on component mount
    useEffect(() => {
        const savedMessages = localStorage.getItem('calendarMessages');
        if (savedMessages) {
            try {
                const parsedMessages: CalendarMessage[] = JSON.parse(savedMessages);
                setMessages(parsedMessages);
            } catch (error) {
                console.error('Failed to parse calendar messages:', error);
                setMessages([]);
            }
        }
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-yellow-500 text-3xl font-bold mb-2">Calendar 2025</h1>
                <p className="text-violet-500">Academic year calendar view</p>
            </div>

            {/* Input Section */}
            <div className="mb-8 bg-white border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-lime-500 mb-4">Add/Edit Message</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="date" className="block text-sm font-bold text-fuchsia-500 mb-2">
                            Select Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 text-cyan-600 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="message" className="block text-sm font-bold text-fuchsia-500 mb-2">
                            Message
                        </label>
                        <input
                            type="text"
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your message..."
                            className="w-full px-3 py-2 border border-gray-300 text-cyan-600 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleSaveMessage}
                            disabled={!selectedDate || !message.trim()}
                            className="cursor-pointer px-6 py-2 bg-blue-500 text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0">
                {months.map((month, index) => (
                    <div key={month} className="bg-white border border-slate-200">
                        <div className="p-4 bg-slate-50 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-rose-500">{month}</h3>
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