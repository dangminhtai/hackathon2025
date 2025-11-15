// services/chatService.ts - Chat gọi Gemini trực tiếp, lưu history vào MongoDB
import { GoogleGenAI } from "@google/genai";
import { getApiKey } from "../config/api";
import { ERROR_MESSAGES } from "../config/errors";

export interface ChatMessage {
  text: string;
  role: 'user' | 'model';
  timestamp: Date;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Initialize Gemini AI
const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export class ChatService {
  /**
   * Gửi message đến AI (gọi Gemini trực tiếp từ frontend)
   */
  static async sendMessage(
    userId: string,
    channelId: string,
    message: string
  ): Promise<string> {
    if (!apiKey || !ai) {
      throw new Error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
    }

    try {
      // Load history từ MongoDB
      const history = await this.getHistory(userId, channelId);
      
      // Chuyển đổi history sang format Gemini
      const geminiHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Tạo chat session với Gemini
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

      // Lưu vào MongoDB
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

      await this.saveHistory(userId, channelId, newMessages);

      return responseText;
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw new Error(error?.message || ERROR_MESSAGES.GENERIC_ERROR);
    }
  }

  /**
   * Lấy lịch sử chat từ MongoDB
   */
  static async getHistory(userId: string, channelId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chat/history?userId=${userId}&channelId=${channelId}`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      if (!data.success) return [];

      // Convert timestamp strings back to Date objects
      return data.data.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  /**
   * Lưu lịch sử chat vào MongoDB
   */
  static async saveHistory(userId: string, channelId: string, messages: ChatMessage[]): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/chat/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, channelId, messages }),
      });
    } catch (error) {
      console.error('Error saving history:', error);
      // Không throw error để không ảnh hưởng đến chat
    }
  }

  /**
   * Xóa lịch sử chat
   */
  static async clearHistory(userId: string, channelId: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/chat/history`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, channelId }),
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      throw new Error('Không thể xóa lịch sử');
    }
  }
}
