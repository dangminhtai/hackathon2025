// server/services/chatService.js
import { GoogleGenAI } from "@google/genai";
import ChatHistory from "../models/ChatHistory.js";
import { ERROR_MESSAGES } from "../config/errors.js";

export class ChatService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY không được tìm thấy trong environment variables");
        }
        this.ai = new GoogleGenAI({ apiKey });
    }

    /**
     * Lấy hoặc tạo chat history
     */
    async getOrCreateChat(userId, channelId) {
        let chat = await ChatHistory.findOne({ userId, channelId });
        
        if (!chat) {
            // Tạo chat mới với system instruction
            chat = new ChatHistory({
                userId,
                channelId,
                turns: [],
            });
            await chat.save();
        }
        
        return chat;
    }

    /**
     * Chuyển đổi turns từ DB sang format của Gemini
     */
    convertTurnsToHistory(turns) {
        return turns.map(turn => [
            {
                role: "user",
                parts: turn.user.parts,
            },
            {
                role: "model",
                parts: turn.model.parts,
            }
        ]).flat();
    }

    /**
     * Tạo chat session với Gemini
     */
    async createChatSession(userId, channelId) {
        const chatDoc = await this.getOrCreateChat(userId, channelId);
        
        // Chuyển đổi history từ DB
        const history = this.convertTurnsToHistory(chatDoc.turns);
        
        // Khởi tạo chat với Gemini
        const chat = this.ai.chats.create({
            model: "gemini-2.0-flash",
            history: history,
            config: {
                systemInstruction: "Bạn là trợ lý AI định hướng nghề nghiệp cho học sinh, sinh viên. Bạn giúp họ khám phá con đường học tập và sự nghiệp phù hợp. Hãy đưa ra lời khuyên hữu ích, thực tế và động viên họ.",
            }
        });

        return { chat, chatDoc };
    }

    /**
     * Gửi message và lưu vào database
     */
    async sendMessage(userId, channelId, messageParts) {
        try {
            const { chat, chatDoc } = await this.createChatSession(userId, channelId);
            
            // Gửi message đến Gemini
            const response = await chat.sendMessage({
                message: messageParts,
            });

            // Lưu turn vào database
            const newTurn = {
                user: {
                    parts: messageParts,
                },
                model: {
                    parts: [{ text: response.text }],
                },
                createdAt: new Date(),
            };

            chatDoc.turns.push(newTurn);
            await chatDoc.save();

            return {
                text: response.text,
                turnId: chatDoc.turns[chatDoc.turns.length - 1]._id,
            };
        } catch (error) {
            console.error("Lỗi khi gửi message:", error);
            throw new Error(error.message || ERROR_MESSAGES.GENERIC_ERROR);
        }
    }

    /**
     * Lấy lịch sử chat
     */
    async getChatHistory(userId, channelId) {
        const chat = await ChatHistory.findOne({ userId, channelId });
        return chat ? chat.turns : [];
    }

    /**
     * Xóa lịch sử chat
     */
    async clearChatHistory(userId, channelId) {
        await ChatHistory.deleteOne({ userId, channelId });
        return { success: true };
    }
}

