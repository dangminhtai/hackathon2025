# Backend Server - Chat API

Server Express.js để xử lý chat với AI và lưu trữ lịch sử vào MongoDB.

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `server/` (hoặc root):

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/smart_university
# Hoặc MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_university

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port
PORT=3001
```

### 3. Chạy Server

```bash
# Chỉ chạy server
npm run dev:server

# Hoặc chạy cả frontend và backend
npm run dev:all
```

Server sẽ chạy tại: `http://localhost:3001`

## API Endpoints

### POST `/api/chat/send`
Gửi message đến AI

**Request:**
```json
{
  "userId": "user123",
  "channelId": "career-guidance",
  "message": "Tôi muốn học về công nghệ thông tin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Công nghệ thông tin là một lĩnh vực rất thú vị...",
    "turnId": "..."
  }
}
```

### GET `/api/chat/history`
Lấy lịch sử chat

**Query Parameters:**
- `userId`: ID người dùng
- `channelId`: ID kênh chat

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user": {
        "parts": [{ "text": "Xin chào" }]
      },
      "model": {
        "parts": [{ "text": "Chào bạn!" }]
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### DELETE `/api/chat/clear`
Xóa lịch sử chat

**Request:**
```json
{
  "userId": "user123",
  "channelId": "career-guidance"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true
  }
}
```

## Cấu trúc

```
server/
├── index.js              # Entry point
├── db.js                 # MongoDB connection
├── models/
│   └── ChatHistory.js    # Mongoose model
├── services/
│   └── chatService.js    # Chat service logic
└── routes/
    └── chatRoutes.js     # API routes
```

## MongoDB Setup

### Local MongoDB
```bash
# Install MongoDB
# Start MongoDB service
mongod
```

### MongoDB Atlas (Cloud)
1. Tạo account tại https://www.mongodb.com/cloud/atlas
2. Tạo cluster mới
3. Lấy connection string
4. Thêm vào `.env` file

## Notes

- Server sử dụng CORS để cho phép frontend gọi API
- Chat history được lưu tự động sau mỗi message
- System instruction được cấu hình trong `chatService.js`

