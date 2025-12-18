
import { Email, CalendarEvent, Note } from './types';

export const MOCK_EMAILS: Email[] = [
  {
    id: '1',
    sender: 'sarah.jones@corp.com',
    subject: 'Quarterly Project Update',
    body: 'Hi, I wanted to follow up on the Q3 milestones. Are we still on track for the October launch? We need the final documentation by Friday.',
    receivedAt: '2024-05-20T09:30:00Z',
    isImportant: true,
    isRead: false
  },
  {
    id: '2',
    sender: 'it-support@corp.com',
    subject: 'Mandatory Security Training',
    body: 'Please complete the security awareness training by EOD tomorrow to maintain access to internal systems.',
    receivedAt: '2024-05-20T10:15:00Z',
    isImportant: false,
    isRead: true
  },
  {
    id: '3',
    sender: 'mike.ross@design-team.com',
    subject: 'Feedback: New Landing Page',
    body: 'The latest designs look great. One small tweak: can we make the primary CTA button a bit larger on mobile views?',
    receivedAt: '2024-05-19T16:45:00Z',
    isImportant: true,
    isRead: true
  }
];

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Standup Meeting',
    startTime: '2024-05-20T10:00:00Z',
    endTime: '2024-05-20T10:30:00Z',
    location: 'Microsoft Teams'
  },
  {
    id: 'e2',
    title: 'Design Review',
    startTime: '2024-05-20T14:00:00Z',
    endTime: '2024-05-20T15:00:00Z',
    location: 'Conference Room B'
  },
  {
    id: 'e3',
    title: 'Client Demo: Phase 1',
    startTime: '2024-05-21T11:00:00Z',
    endTime: '2024-05-21T12:00:00Z',
    location: 'Zoom'
  }
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Product Roadmap Ideas',
    content: 'Focus on AI integration and mobile-first responsive design for the 2024 H2 roadmap.',
    timestamp: Date.now() - 86400000,
    tags: ['work', 'strategy']
  }
];
