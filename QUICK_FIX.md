# 🔧 Quick Fix - Lỗi Chat AI

## Vấn đề
Lỗi: `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

## Nguyên nhân
Server backend chưa chạy, nên frontend nhận HTML (404 page) thay vì JSON.

## Giải pháp

### 1. Kiểm tra Server có đang chạy không

Mở terminal mới và chạy:

```bash
npm run dev:server
```

Bạn sẽ thấy:
```
✅ Đã kết nối với MongoDB Database
🚀 Server đang chạy tại http://localhost:3001
```

### 2. Kiểm tra MongoDB

Đảm bảo MongoDB đang chạy:

**Windows:**
```bash
# Kiểm tra service
net start MongoDB

# Hoặc start manually
mongod
```

**Mac/Linux:**
```bash
# Kiểm tra
brew services list  # Mac
# hoặc
sudo systemctl status mongod  # Linux
```

### 3. Kiểm tra file .env

Tạo file `.env` trong thư mục root với:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/smart_university

# Gemini API Key
GEMINI_API_KEY=your_api_key_here

# Server Port
PORT=3001
```

### 4. Chạy cả Frontend và Backend

**Option 1: Chạy riêng (2 terminals)**

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
npm run dev:server
```

**Option 2: Chạy cùng lúc (1 terminal)**

**Với npm script:**
```bash
npm run dev:all
```

**Hoặc dùng PowerShell script:**
```powershell
.\start-dev.ps1
```

**Hoặc dùng Batch file (Windows):**
```cmd
start-dev.bat
```

### 5. Test Server

Mở browser và vào: `http://localhost:3001/health`

Nếu thấy:
```json
{"status":"ok","message":"Server is running"}
```

Thì server đã chạy đúng! ✅

## Nếu vẫn lỗi

1. **Kiểm tra port 3001 có bị chiếm không:**
   ```bash
   # Windows
   netstat -ano | findstr :3001
   
   # Mac/Linux
   lsof -i :3001
   ```

2. **Kiểm tra console log:**
   - Mở DevTools (F12)
   - Xem tab Console và Network
   - Kiểm tra request đến `/api/chat/send` có lỗi gì không

3. **Kiểm tra MongoDB connection:**
   - Đảm bảo MongoDB đang chạy
   - Kiểm tra `MONGO_URI` trong `.env` đúng chưa

## Lưu ý

- Server phải chạy trước khi chat
- Nếu không có MongoDB, server vẫn sẽ chạy nhưng không lưu được lịch sử
- API URL mặc định: `http://localhost:3001`
- Có thể thay đổi bằng biến `VITE_API_URL` trong `.env`

