# Hướng dẫn Setup Dự án

## 1. Cài đặt Dependencies

```bash
npm install
```

## 2. Cấu hình Environment Variables

Tạo file `.env` trong thư mục gốc của dự án:

```env
# Gemini API Key (BẮT BUỘC phải có prefix VITE_ để Vite expose ra client-side)
VITE_GEMINI_API_KEY=your_api_key_here

# Database Configuration (nếu sử dụng MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_university
DB_CONNECTION_LIMIT=10
```

### ⚠️ Lưu ý quan trọng về API Key:

**Vite chỉ expose các biến môi trường có prefix `VITE_` ra client-side.**

Nếu file `.env` của bạn có `GEMINI_API_KEY` (không có prefix VITE_), bạn cần:

**Cách 1: Đổi tên biến (Khuyến nghị)**
```env
# Thay đổi từ:
GEMINI_API_KEY=your_key

# Thành:
VITE_GEMINI_API_KEY=your_key
```

**Cách 2: Thêm biến mới**
```env
# Giữ nguyên GEMINI_API_KEY cho backend (nếu có)
GEMINI_API_KEY=your_key

# Thêm VITE_GEMINI_API_KEY cho frontend
VITE_GEMINI_API_KEY=your_key
```

Sau khi thay đổi, **khởi động lại dev server**:
```bash
# Dừng server (Ctrl+C) và chạy lại
npm run dev
```

## 3. Setup Database MySQL (Tùy chọn)

### Tạo Database:
```bash
mysql -u root -p < database/schema.sql
```

### Seed dữ liệu:
```bash
mysql -u root -p < database/seed.sql
```

Hoặc chạy trong MySQL:
```sql
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

## 4. Chạy Dự án

```bash
npm run dev
```

Dự án sẽ chạy tại: `http://localhost:3000` (hoặc port khác nếu 3000 đã được sử dụng)

## 5. Kiểm tra Lỗi

### Lỗi "Không thể nhận được gợi ý chuyên ngành":

1. **Kiểm tra API Key:**
   - Mở Console trong trình duyệt (F12)
   - Xem có warning về API Key không
   - Đảm bảo biến có prefix `VITE_`

2. **Kiểm tra file .env:**
   - File `.env` phải ở thư mục gốc của dự án
   - Không có khoảng trắng thừa: `VITE_GEMINI_API_KEY=your_key` (không có dấu cách)

3. **Restart dev server:**
   - Vite chỉ đọc `.env` khi khởi động
   - Sau khi sửa `.env`, phải restart server

4. **Kiểm tra API Key hợp lệ:**
   - Lấy API key từ: https://aistudio.google.com/apikey
   - Đảm bảo API key còn hiệu lực

## 6. Cấu trúc Database

Xem chi tiết trong `database/README.md`

## Troubleshooting

### Port đã được sử dụng:
Vite sẽ tự động chọn port khác. Kiểm tra terminal để xem port mới.

### Lỗi import module:
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi TypeScript:
```bash
# Kiểm tra tsconfig.json
# Đảm bảo đã cài đúng types
npm install --save-dev @types/node
```

