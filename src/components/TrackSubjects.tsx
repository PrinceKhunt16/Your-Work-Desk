import React, { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'tracked_folders';

// Extend Window interface to include showDirectoryPicker
declare global {
    interface Window {
        showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
    }
}

const TrackSubjects: React.FC = () => {
    const [folderHandle, setFolderHandle] = useState<FileSystemDirectoryHandle | null>(null);
    const [folderName, setFolderName] = useState<string>('');
    const [fileList, setFileList] = useState<FileSystemFileHandle[]>([]);
    const [newFileName, setNewFileName] = useState<string>('');
    const [selectedFileHandle, setSelectedFileHandle] = useState<FileSystemFileHandle | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [folderHistory, setFolderHistory] = useState<string[]>([]);

    const handleCreateFile = async () => {
        if (!folderHandle || !newFileName) return;
        try {
            const fileHandle = await folderHandle.getFileHandle(`${newFileName}.txt`, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write('');
            await writable.close();
            setNewFileName('');
            await listFiles(folderHandle);
        } catch (err) {
            console.error('File creation error:', err);
        }
    };

    const handleOpenFile = async (fileHandle: FileSystemFileHandle) => {
        const file = await fileHandle.getFile();
        const text = await file.text();
        setSelectedFileHandle(fileHandle);
        setFileContent(text);
    };

    const handleSaveFile = async () => {
        if (!selectedFileHandle) return;
        const writable = await selectedFileHandle.createWritable();
        await writable.write(fileContent);
        await writable.close();
        alert('File saved successfully!');
    };

    const handleDeleteFile = async (fileHandle: FileSystemFileHandle) => {
        if (!folderHandle) return;
        const confirmDelete = window.confirm(`Are you sure you want to delete ${fileHandle.name}?`);
        if (!confirmDelete) return;
        await folderHandle.removeEntry(fileHandle.name);
        setSelectedFileHandle(null);
        setFileContent('');
        await listFiles(folderHandle);
    };

    const saveToHistory = (name: string) => {
        const updated = [name, ...folderHistory.filter((f) => f !== name)].slice(0, 5);
        setFolderHistory(updated);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    };

    const handleFolderPick = async () => {
        try {
            const handle = await window.showDirectoryPicker();
            setFolderHandle(handle);
            setFolderName(handle.name);
            saveToHistory(handle.name);
            await listFiles(handle);
        } catch (err) {
            console.error('Folder selection error:', err);
        }
    };

    const listFiles = async (handle: FileSystemDirectoryHandle) => {
        const files: FileSystemFileHandle[] = [];

        try {
            const directoryHandle = handle as FileSystemDirectoryHandle & {
                entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
            };

            for await (const [, entry] of directoryHandle.entries()) {
                if (entry.kind === 'file' && entry.name.endsWith('.txt')) {
                    files.push(entry as FileSystemFileHandle);
                }
            }
        } catch (error) {
            console.error('Error listing files:', error);
        }

        setFileList(files);
    };

    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            setFolderHistory(JSON.parse(saved));
        }
    }, []);

    return (
        <div className="w-full px-4 py-6 md:px-10 lg:px-36 xl:px-48">
            {!folderHandle ? (
                <div className="text-center mt-10">
                    <h2 className="text-2xl font-semibold mb-4">Select Folder to Track Subjects</h2>
                    <button
                        onClick={handleFolderPick}
                        className="cursor-pointer bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition"
                    >
                        📁 Pick Folder
                    </button>

                    {folderHistory.length > 0 && (
                        <div className="mt-6 text-left max-w-md mx-auto">
                            <h3 className="text-lg font-medium mb-2">📜 History</h3>
                            <ul className="space-y-2">
                                {folderHistory.map((name, idx) => (
                                    <li
                                        key={idx}
                                        className="bg-gray-100 px-4 py-2 shadow-sm cursor-pointer hover:bg-gray-200"
                                        onClick={handleFolderPick}
                                        title="Click to reopen folder manually"
                                    >
                                        {name}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-sm text-gray-500 mt-2">⚠️ You&apos;ll need to select the folder again due to browser security.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h2 className="text-xl font-bold mb-4">📂 Folder: {folderName}</h2>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Enter new file name"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            className="border px-3 py-2 w-full sm:w-auto"
                        />
                        <button
                            onClick={handleCreateFile}
                            className="cursor-pointer bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
                        >
                            ➕ Create File
                        </button>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-medium mb-2">📄 Your Files</h3>
                        <ul className="space-y-2">
                            {fileList.map((file, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between bg-gray-100 p-3 shadow-sm"
                                >
                                    <span className="font-mono text-gray-800">{file.name}</span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleOpenFile(file)}
                                            className="cursor-pointer bg-blue-500 text-white px-3 py-1 hover:bg-blue-600"
                                        >
                                            Open
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFile(file)}
                                            className="cursor-pointer bg-red-500 text-white px-3 py-1 hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {selectedFileHandle && (
                        <div className="mt-10">
                            <h3 className="text-lg font-semibold mb-2">Editing: {selectedFileHandle.name}</h3>
                            <textarea
                                className="w-full border p-3 mb-4 min-h-[200px]"
                                value={fileContent}
                                onChange={(e) => setFileContent(e.target.value)}
                            />
                            <button
                                onClick={handleSaveFile}
                                className="cursor-pointer bg-purple-600 text-white px-5 py-2 hover:bg-purple-700"
                            >
                                💾 Save Changes
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrackSubjects;