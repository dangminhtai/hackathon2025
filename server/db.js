// server/db.js
import mongoose from "mongoose";

mongoose.set('strictQuery', true);

async function connectDB() {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI không được tìm thấy trong environment variables");
        }
        await mongoose.connect(mongoUri);
        console.log('✅ Đã kết nối với MongoDB Database');
    } catch (err) {
        console.error('❌ Lỗi kết nối với Database:', err);
        throw err;
    }
}

export { connectDB };

