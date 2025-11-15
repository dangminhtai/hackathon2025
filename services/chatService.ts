// services/chatService.ts - Frontend service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ChatMessage {
  text: string;
  role: 'user' | 'model';
  timestamp?: Date;
}

export interface SendMessageRequest {
  userId: string;
  channelId: string;
  message: string | Array<{ text?: string; fileData?: { mimeType: string; fileUri: string } }>;
}

export interface ChatHistoryResponse {
  success: boolean;
  data: Array<{
    user: { parts: Array<{ text?: string; fileData?: any }> };
    model: { parts: Array<{ text?: string }> };
    createdAt: string;
  }>;
}

export class ChatService {
  /**
   * Gửi message đến AI
   */
  static async sendMessage(request: SendMessageRequest): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Lỗi khi gửi message');
      }

      const data = await response.json();
      return data.data.text;
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw new Error(error.message || 'Không thể gửi message');
    }
  }

  /**
   * Lấy lịch sử chat
   */
  static async getHistory(userId: string, channelId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chat/history?userId=${userId}&channelId=${channelId}`
      );

      if (!response.ok) {
        throw new Error('Lỗi khi lấy lịch sử');
      }

      const data: ChatHistoryResponse = await response.json();
      
      // Chuyển đổi format từ server sang frontend
      const messages: ChatMessage[] = [];
      data.data.forEach((turn) => {
        // User message
        const userText = turn.user.parts.find(p => p.text)?.text || '';
        if (userText) {
          messages.push({
            text: userText,
            role: 'user',
            timestamp: new Date(turn.createdAt),
          });
        }

        // Model message
        const modelText = turn.model.parts.find(p => p.text)?.text || '';
        if (modelText) {
          messages.push({
            text: modelText,
            role: 'model',
            timestamp: new Date(turn.createdAt),
          });
        }
      });

      return messages;
    } catch (error: any) {
      console.error('Error getting history:', error);
      throw new Error(error.message || 'Không thể lấy lịch sử');
    }
  }

  /**
   * Xóa lịch sử chat
   */
  static async clearHistory(userId: string, channelId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, channelId }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi xóa lịch sử');
      }
    } catch (error: any) {
      console.error('Error clearing history:', error);
      throw new Error(error.message || 'Không thể xóa lịch sử');
    }
  }
}

