// server/models/ChatHistory.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessagePart {
    text?: string;
    fileData?: {
        mimeType?: string;
        fileUri?: string;
    };
}

export interface IChatTurn {
    user: {
        parts: IMessagePart[];
    };
    model: {
        parts: IMessagePart[];
    };
    createdAt: Date;
}

export interface IChatHistory extends Document {
    userId: string;
    channelId: string;
    turns: IChatTurn[];
    createdAt: Date;
    updatedAt: Date;
}

const messagePartSchema = new Schema<IMessagePart>({
    text: String,
    fileData: {
        mimeType: String,
        fileUri: String,
    },
}, { _id: false });

const chatTurnSchema = new Schema<IChatTurn>({
    user: {
        parts: [messagePartSchema],
    },
    model: {
        parts: [messagePartSchema],
    },
    createdAt: { type: Date, default: Date.now },
}, { _id: false });

const chatSchema = new Schema<IChatHistory>({
    userId: { type: String, required: true },
    channelId: { type: String, required: true },
    turns: [chatTurnSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

chatSchema.index({ userId: 1, channelId: 1 });

// Update updatedAt before saving
chatSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const ChatHistory: Model<IChatHistory> = mongoose.model<IChatHistory>("ChatHistory", chatSchema);

export default ChatHistory;

