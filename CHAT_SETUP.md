# Hướng dẫn Setup Chat với MongoDB

## Tổng quan

Hệ thống chat AI đã được tích hợp để hỗ trợ học sinh/sinh viên chat với AI về định hướng nghề nghiệp. Lịch sử chat được lưu vào MongoDB.

## Cấu trúc

```
server/                    # Backend Express server
├── index.js              # Entry point
├── db.js                 # MongoDB connection
├── models/
│   └── ChatHistory.js    # Mongoose model
├── services/
│   └── chatService.js    # Chat logic với Gemini
└── routes/
    └── chatRoutes.js     # API endpoints

components/
└── ChatBot.tsx          # Frontend chat component

services/
└── chatService.ts        # Frontend service để gọi API
```

## Cài đặt

### 1. Cài đặt Dependencies

```bash
npm install
```

### 2. Cấu hình MongoDB

#### Option A: MongoDB Local

1. Cài đặt MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Tạo file `.env` trong thư mục root:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/smart_university

# Gemini API Key (cho server)
GEMINI_API_KEY=your_api_key_here

# Server Port
PORT=3001

# Frontend API URL (optional)
VITE_API_URL=http://localhost:3001
```

#### Option B: MongoDB Atlas (Cloud)

1. Tạo account tại https://www.mongodb.com/cloud/atlas
2. Tạo cluster mới
3. Lấy connection string
4. Thêm vào `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_university
```

### 3. Chạy Server

```bash
# Chỉ chạy backend server
npm run dev:server

# Hoặc chạy cả frontend và backend cùng lúc
npm run dev:all
```

## Sử dụng

### Frontend

ChatBot component đã được tích hợp vào App. Nó sẽ xuất hiện dưới dạng floating button ở góc dưới bên phải.

**Features:**
- ✅ Chat với AI về định hướng nghề nghiệp
- ✅ Lưu lịch sử chat vào MongoDB
- ✅ Tải lại lịch sử khi mở chat
- ✅ Xóa lịch sử chat
- ✅ UI responsive và đẹp

### API Endpoints

#### POST `/api/chat/send`
Gửi message đến AI

```javascript
fetch('http://localhost:3001/api/chat/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    channelId: 'career-guidance',
    message: 'Tôi muốn học về công nghệ thông tin'
  })
});
```

#### GET `/api/chat/history`
Lấy lịch sử chat

```javascript
fetch('http://localhost:3001/api/chat/history?userId=user123&channelId=career-guidance');
```

#### DELETE `/api/chat/clear`
Xóa lịch sử chat

```javascript
fetch('http://localhost:3001/api/chat/clear', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    channelId: 'career-guidance'
  })
});
```

## Customization

### Thay đổi System Instruction

Sửa trong `server/services/chatService.js`:

```javascript
config: {
  systemInstruction: "Bạn là trợ lý AI định hướng nghề nghiệp...",
}
```

### Thay đổi Model

Sửa trong `server/services/chatService.js`:

```javascript
model: "gemini-2.0-flash", // hoặc "gemini-2.5-flash"
```

### Customize ChatBot UI

Sửa trong `components/ChatBot.tsx`:
- Thay đổi màu sắc, kích thước
- Thêm features mới
- Customize messages

## Troubleshooting

### Lỗi kết nối MongoDB

1. Kiểm tra MongoDB đang chạy
2. Kiểm tra `MONGO_URI` trong `.env`
3. Kiểm tra firewall/network

### Lỗi API Key

1. Đảm bảo `GEMINI_API_KEY` có trong `.env`
2. Restart server sau khi thay đổi `.env`

### CORS Error

Server đã cấu hình CORS. Nếu vẫn lỗi:
- Kiểm tra `VITE_API_URL` trong frontend
- Đảm bảo server đang chạy

## Notes

- Chat history được lưu tự động sau mỗi message
- Mỗi user có thể có nhiều channels (career-guidance, general, etc.)
- System instruction được tối ưu cho định hướng nghề nghiệp
- Có thể mở rộng để hỗ trợ file upload (images, documents)

