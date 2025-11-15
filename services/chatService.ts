// services/chatService.ts - Simple chat service với localStorage
import { GoogleGenAI } from "@google/genai";
import { getApiKey } from "../config/api";
import { ERROR_MESSAGES } from "../config/errors";

export interface ChatMessage {
  text: string;
  role: 'user' | 'model';
  timestamp: Date;
}

const STORAGE_KEY = 'chat_history';

// Initialize Gemini AI
const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Get storage key for user/channel
const getStorageKey = (userId: string, channelId: string): string => {
  return `${STORAGE_KEY}_${userId}_${channelId}`;
};

export class ChatService {
  /**
   * Gửi message đến AI và lưu vào localStorage
   */
  static async sendMessage(
    userId: string,
    channelId: string,
    message: string
  ): Promise<string> {
    if (!apiKey) {
      throw new Error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
    }

    if (!ai) {
      throw new Error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
    }

    try {
      // Load history từ localStorage
      const history = this.getHistory(userId, channelId);
      
      // Chuyển đổi history sang format Gemini
      const geminiHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Tạo chat session
      const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: geminiHistory,
        config: {
          systemInstruction: "Bạn là trợ lý AI định hướng nghề nghiệp cho học sinh, sinh viên. Bạn giúp họ khám phá con đường học tập và sự nghiệp phù hợp. Hãy đưa ra lời khuyên hữu ích, thực tế và động viên họ.",
        }
      });

      // Gửi message
      const response = await chat.sendMessage({
        message: [{ text: message }],
      });

      const responseText = response.text;

      // Lưu vào localStorage
      const newMessages: ChatMessage[] = [
        ...history,
        {
          text: message,
          role: 'user',
          timestamp: new Date(),
        },
        {
          text: responseText,
          role: 'model',
          timestamp: new Date(),
        }
      ];

      localStorage.setItem(
        getStorageKey(userId, channelId),
        JSON.stringify(newMessages)
      );

      return responseText;
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw new Error(error?.message || ERROR_MESSAGES.GENERIC_ERROR);
    }
  }

  /**
   * Lấy lịch sử chat từ localStorage
   */
  static getHistory(userId: string, channelId: string): ChatMessage[] {
    try {
      const stored = localStorage.getItem(getStorageKey(userId, channelId));
      if (!stored) return [];
      
      const messages = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  /**
   * Xóa lịch sử chat
   */
  static clearHistory(userId: string, channelId: string): void {
    localStorage.removeItem(getStorageKey(userId, channelId));
  }
}
