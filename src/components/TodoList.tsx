import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Clock, Filter } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdAt: Date;
    priority: 'low' | 'medium' | 'high';
}

const TodoList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    // Load tasks from localStorage on component mount
    useEffect(() => {
        const stored = localStorage.getItem('sms_tasks');
        if (stored) {
            const parsedTasks = JSON.parse(stored).map((task: {
                id: string;
                text: string;
                completed: boolean;
                createdAt: string;
                // add other properties as needed
            }) => ({
                ...task,
                createdAt: new Date(task.createdAt)
            }));
            setTasks(parsedTasks);
        }
    }, []);

    // Save tasks to localStorage whenever tasks change
    useEffect(() => {
        localStorage.setItem('sms_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (newTask.trim()) {
            const task: Task = {
                id: Date.now().toString(),
                text: newTask.trim(),
                completed: false,
                createdAt: new Date(),
                priority: newPriority
            };
            setTasks([task, ...tasks]);
            setNewTask('');
        }
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const filteredTasks = tasks.filter(task => {
        switch (filter) {
            case 'active':
                return !task.completed;
            case 'completed':
                return task.completed;
            default:
                return true;
        }
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-l-red-500 bg-red-50';
            case 'medium': return 'border-l-yellow-500 bg-yellow-50';
            case 'low': return 'border-l-green-500 bg-green-50';
            default: return 'border-l-slate-500 bg-slate-50';
        }
    };

    const getPriorityBadgeColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const activeCount = tasks.filter(task => !task.completed).length;
    const completedCount = tasks.filter(task => task.completed).length;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-yellow-500 text-3xl font-bold mb-2">Todos</h1>
                <p className="text-violet-600">Manage your tasks and stay organized</p>
            </div>

            {/* Add new task */}
            <div className="bg-white shadow-sm border border-slate-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-indigo-500 mb-4">Add New Task</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Enter a new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                        className="text-rose-500 flex-1 px-4 py-2 border border-slate-300  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Select
                        value={newPriority}
                        onValueChange={(value) => setNewPriority(value as "low" | "medium" | "high")}
                    >
                        <SelectTrigger className="w-full sm:w-[200px] cursor-pointer px-4 py-5 rounded-none hover:rounded-none border border-gray-300 shadow-none">
                            <SelectValue
                                placeholder="Select Priority"
                                className={
                                    newPriority === "low"
                                        ? "text-green-500"
                                        : newPriority === "medium"
                                            ? "text-yellow-500"
                                            : newPriority === "high"
                                                ? "text-red-500"
                                                : ""
                                }
                            />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="low" className='hover:rounded-none cursor-pointer'>
                                <span className="text-green-500">Low Priority</span>
                            </SelectItem>
                            <SelectItem value="medium" className='hover:rounded-none cursor-pointer'>
                                <span className="text-yellow-500">Medium Priority</span>
                            </SelectItem>
                            <SelectItem value="high" className='hover:rounded-none cursor-pointer'>
                                <span className="text-red-500">High Priority</span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <button
                        onClick={addTask}
                        className="cursor-pointer px-6 py-2 bg-blue-600 text-white  hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add Task
                    </button>
                </div>
            </div>

            {/* Stats and filters */}
            <div className="bg-white  shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-blue-600" />
                            <span className="text-slate-600">Active: <span className="font-semibold text-slate-800">{activeCount}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check size={16} className="text-green-600" />
                            <span className="text-slate-600">Completed: <span className="font-semibold text-slate-800">{completedCount}</span></span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-slate-600" />
                        <Select
                            value={filter}
                            onValueChange={(value) => setFilter(value as 'all' | 'active' | 'completed')}
                        >
                            <SelectTrigger className="w-full sm:w-[180px] px-4 py-5 cursor-pointer rounded-none hover:rounded-none border border-gray-300 shadow-none">
                                <SelectValue
                                    placeholder="Select Priority"
                                    className={
                                        filter === "all"
                                            ? "text-green-500"
                                            : filter === "active"
                                                ? "text-yellow-500"
                                                : filter === "completed"
                                                    ? "text-blue-500"
                                                    : ""
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                <SelectItem value="all" className="hover:rounded-none cursor-pointer">
                                    <span className="text-green-500">All</span>
                                </SelectItem>
                                <SelectItem value="active" className="hover:rounded-none cursor-pointer">
                                    <span className="text-yellow-500">Active</span>
                                </SelectItem>
                                <SelectItem value="completed" className="hover:rounded-none cursor-pointer">
                                    <span className="text-blue-500">Completed</span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Tasks list */}
            <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                    <div className="bg-white  shadow-sm border border-slate-200 p-8 text-center">
                        <Clock size={48} className="mx-auto text-slate-400 mb-4" />
                        <p className="text-slate-600">
                            {filter === 'all' ? 'No tasks yet. Add your first task above!' :
                                filter === 'active' ? 'No active tasks. Great job!' :
                                    'No completed tasks yet.'}
                        </p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className={`bg-white  shadow-sm border-l-4 ${getPriorityColor(task.priority)} p-4 transition-all hover:shadow-md`}
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`cursor-pointer flex-shrink-0 w-5 h-5 rounded-none border-2 flex items-center justify-center transition-all ${task.completed
                                        ? 'bg-green-600 border-green-600 text-white'
                                        : 'border-slate-300 hover:border-green-500'
                                        }`}
                                >
                                    {task.completed && <Check size={12} />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div className={`text-slate-800 ${task.completed ? 'line-through text-slate-500' : ''}`}>
                                        {task.text}
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`px-2 py-1 text-xs font-medium  ${getPriorityBadgeColor(task.priority)}`}>
                                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {task.createdAt.toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="cursor-pointer flex-shrink-0 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50  transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Quick actions */}
            {tasks.length > 0 && (
                <div className="mt-6 bg-white  shadow-sm border border-slate-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                            onClick={() => setTasks(tasks.filter(task => !task.completed))}
                            className="cursor-pointer px-4 py-2 text-slate-600 border border-slate-300  hover:bg-slate-50 transition-colors text-sm"
                        >
                            Clear Completed
                        </button>
                        <button
                            onClick={() => setTasks([])}
                            className="cursor-pointer px-4 py-2 text-red-600 border border-red-300  hover:bg-red-50 transition-colors text-sm"
                        >
                            Clear All Tasks
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoList;