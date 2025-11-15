# Database Setup - MySQL

## Cấu trúc Database

Database được thiết kế để lưu trữ:
- **Roadmaps**: Lộ trình học tập (Tech, Business, Arts)
- **Subjects**: Môn học
- **Major Queries & Suggestions**: Lịch sử và gợi ý chuyên ngành từ AI
- **Career Queries & Suggestions**: Lịch sử và gợi ý nghề nghiệp từ AI
- **Users**: Người dùng (tùy chọn, có thể mở rộng)

## Cài đặt

### 1. Tạo Database

```bash
mysql -u root -p < database/schema.sql
```

### 2. Seed dữ liệu ban đầu

```bash
mysql -u root -p < database/seed.sql
```

Hoặc chạy trực tiếp trong MySQL:

```sql
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

### 3. Cấu hình Environment Variables

Thêm vào file `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_university
DB_CONNECTION_LIMIT=10
```

## Cấu trúc Tables

### Core Tables
- `roadmaps` - Lộ trình học tập
- `subjects` - Môn học

### Query & Suggestion Tables
- `major_queries` - Lịch sử truy vấn chuyên ngành
- `major_suggestions` - Gợi ý chuyên ngành từ AI
- `major_skills` - Kỹ năng cốt lõi của từng chuyên ngành
- `career_queries` - Lịch sử truy vấn nghề nghiệp
- `career_query_subjects` - Quan hệ giữa career queries và subjects
- `career_suggestions` - Gợi ý nghề nghiệp từ AI

### User Management (Optional)
- `users` - Thông tin người dùng

## Sử dụng Services

### Major Service
```typescript
import { MajorService } from './database/services/majorService';

// Tạo query mới
const queryId = await MajorService.createQuery({
  roadmap_id: 'tech',
  query_text: 'User selected tech roadmap'
});

// Lưu suggestions
await MajorService.createSuggestion({
  query_id: queryId,
  major_name: 'Khoa học Máy tính',
  description: 'Mô tả...',
  skills: ['Lập trình', 'Thuật toán', 'Cấu trúc dữ liệu']
});

// Lấy suggestions
const suggestions = await MajorService.getSuggestionsByQueryId(queryId);
```

### Career Service
```typescript
import { CareerService } from './database/services/careerService';

// Tạo query với subjects
const queryId = await CareerService.createQuery({
  subject_ids: ['math', 'physics', 'oop'],
  query_text: 'User selected subjects'
});

// Lưu suggestions
await CareerService.createSuggestion({
  query_id: queryId,
  career_name: 'Software Engineer',
  description: 'Mô tả...',
  suitability: 'Lý do phù hợp...'
});
```

### Roadmap & Subject Services
```typescript
import { RoadmapService, SubjectService } from './database/services/roadmapService';

const roadmaps = await RoadmapService.getAll();
const subjects = await SubjectService.getAll();
```

## Migration & Maintenance

### Backup Database
```bash
mysqldump -u root -p smart_university > backup.sql
```

### Restore Database
```bash
mysql -u root -p smart_university < backup.sql
```

## Notes

- Database sử dụng UTF8MB4 để hỗ trợ tiếng Việt đầy đủ
- Tất cả timestamps tự động được quản lý
- Foreign keys được thiết lập với CASCADE/SET NULL phù hợp
- Indexes được tạo cho các trường thường xuyên query

