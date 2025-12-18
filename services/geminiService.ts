
import { GoogleGenAI, Type } from "@google/genai";
import { Email, CalendarEvent, Note } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private buildSystemInstruction(context: {
    emails: Email[];
    calendar: CalendarEvent[];
    notes: Note[];
  }) {
    return `You are "OmniWork Assistant", a high-performance productivity partner. 
    You have access to the user's workspace context:
    - EMAILS: ${JSON.stringify(context.emails)}
    - CALENDAR: ${JSON.stringify(context.calendar)}
    - NOTES: ${JSON.stringify(context.notes)}
    
    Guidelines:
    1. Help the user summarize long emails or busy days.
    2. Answer specific questions about their schedule or communications.
    3. Act like a "Granola" app assistant - when asked for meeting notes or summaries, be concise and structured.
    4. If the user asks to look for something, search the provided context first.
    5. Be professional but helpful and proactive.`;
  }

  async chat(
    message: string, 
    context: { emails: Email[]; calendar: CalendarEvent[]; notes: Note[] },
    history: { role: 'user' | 'assistant'; content: string }[] = []
  ) {
    const chat = this.ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: this.buildSystemInstruction(context),
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  }

  async transcribeAudio(base64Audio: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Audio, mimeType: 'audio/pcm;rate=16000' } },
          { text: "Please transcribe this audio accurately. If it's a meeting, format it with speaker labels if possible and bullet points for key takeaways." }
        ]
      }
    });
    return response.text;
  }
}
