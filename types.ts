
export interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  tags: string[];
}

export interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  receivedAt: string;
  isImportant: boolean;
  isRead: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
}

export type AppView = 'notes' | 'outlook' | 'ai' | 'dashboard';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
