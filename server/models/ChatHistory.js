// server/models/ChatHistory.js
import mongoose from "mongoose";

const messagePartSchema = new mongoose.Schema({
    text: String,
    fileData: {
        mimeType: String,
        fileUri: String,
    },
}, { _id: false });

const chatTurnSchema = new mongoose.Schema({
    user: {
        parts: [messagePartSchema],
    },
    model: {
        parts: [messagePartSchema],
    },
    createdAt: { type: Date, default: Date.now },
}, { _id: false });

const chatSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    channelId: { type: String, required: true },
    turns: [chatTurnSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

chatSchema.index({ userId: 1, channelId: 1 });

// Update updatedAt before saving
chatSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model("ChatHistory", chatSchema);

