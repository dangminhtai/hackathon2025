// server/routes/chatRoutes.ts
import express, { Request, Response, Router } from "express";
import { ChatService } from "../services/chatService";

const router: Router = express.Router();
const chatService = new ChatService();

interface SendMessageRequest extends Request {
    body: {
        userId: string;
        channelId: string;
        message: string | Array<{ text?: string; fileData?: { mimeType: string; fileUri: string } }>;
    };
}

interface HistoryRequest extends Request {
    query: {
        userId: string;
        channelId: string;
    };
}

interface ClearRequest extends Request {
    body: {
        userId: string;
        channelId: string;
    };
}

/**
 * POST /api/chat/send
 * Gửi message đến AI
 */
router.post("/send", async (req: SendMessageRequest, res: Response) => {
    try {
        const { userId, channelId, message } = req.body;

        if (!userId || !channelId || !message) {
            return res.status(400).json({
                error: "Thiếu thông tin: userId, channelId, và message là bắt buộc"
            });
        }

        // Chuyển đổi message thành messageParts
        const messageParts = Array.isArray(message) 
            ? message 
            : [{ text: message as string }];

        const response = await chatService.sendMessage(userId, channelId, messageParts);

        res.json({
            success: true,
            data: response,
        });
    } catch (error: any) {
        console.error("Error in /api/chat/send:", error);
        res.status(500).json({
            success: false,
            error: error?.message || "Lỗi khi gửi message",
        });
    }
});

/**
 * GET /api/chat/history
 * Lấy lịch sử chat
 */
router.get("/history", async (req: HistoryRequest, res: Response) => {
    try {
        const { userId, channelId } = req.query;

        if (!userId || !channelId) {
            return res.status(400).json({
                error: "Thiếu thông tin: userId và channelId là bắt buộc"
            });
        }

        const history = await chatService.getChatHistory(userId, channelId);

        res.json({
            success: true,
            data: history,
        });
    } catch (error: any) {
        console.error("Error in /api/chat/history:", error);
        res.status(500).json({
            success: false,
            error: error?.message || "Lỗi khi lấy lịch sử",
        });
    }
});

/**
 * DELETE /api/chat/clear
 * Xóa lịch sử chat
 */
router.delete("/clear", async (req: ClearRequest, res: Response) => {
    try {
        const { userId, channelId } = req.body;

        if (!userId || !channelId) {
            return res.status(400).json({
                error: "Thiếu thông tin: userId và channelId là bắt buộc"
            });
        }

        const result = await chatService.clearChatHistory(userId, channelId);

        res.json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        console.error("Error in /api/chat/clear:", error);
        res.status(500).json({
            success: false,
            error: error?.message || "Lỗi khi xóa lịch sử",
        });
    }
});

export default router;

