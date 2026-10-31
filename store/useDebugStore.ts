import { create } from 'zustand';

interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

interface DebugState {
  isDebugMode: boolean;
  logs: LogEntry[];
  toggleDebugMode: () => void;
  addLog: (message: string, type?: LogEntry['type']) => void;
  clearLogs: () => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  isDebugMode: false,
  logs: [],
  toggleDebugMode: () => set((state) => ({ isDebugMode: !state.isDebugMode })),
  addLog: (message, type = 'info') => set((state) => ({
    logs: [...state.logs, {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      message,
      type
    }].slice(-50) // keep only last 50 logs
  })),
  clearLogs: () => set({ logs: [] })
}));
