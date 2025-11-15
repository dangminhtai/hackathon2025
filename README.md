# Update README.md for hackathon
# Configuration Files

Thư mục này chứa tất cả các file cấu hình cho dự án, giúp loại bỏ hardcode và tập trung quản lý cấu hình.

## Cấu trúc

```
config/
├── index.ts              # Export tất cả config (centralized)
├── api.ts                # API configuration (API keys, endpoints)
├── errors.ts             # Error messages
├── ui.ts                 # UI messages và labels
├── constants.ts          # Constants (ROADMAPS, SUBJECTS)
└── prompt/
    ├── majors/
    │   └── gemini_conf.ts  # Gemini prompt config cho majors
    └── careers/
        └── gemini_conf.ts  # Gemini prompt config cho careers
```

## Sử dụng

### Import từ config

```typescript
// Import tất cả từ một nơi
import { ERROR_MESSAGES, UI_MESSAGES, geminiMajorPrompt } from '../config';

// Hoặc import riêng lẻ
import { ERROR_MESSAGES } from '../config/errors';
import { UI_MESSAGES } from '../config/ui';
import { geminiMajorPrompt } from '../config/prompt/majors/gemini_conf';
```

### Ví dụ sử dụng

#### Error Messages
```typescript
import { ERROR_MESSAGES } from '../config/errors';

if (!apiKey) {
  throw new Error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
}
```

#### UI Messages
```typescript
import { UI_MESSAGES } from '../config/ui';

<h2>{UI_MESSAGES.CAREER_PATHFINDER.TITLE}</h2>
```

#### Gemini Prompts
```typescript
import { geminiMajorPrompt } from '../config/prompt/majors/gemini_conf';

const response = await ai.models.generateContent({
  model: geminiMajorPrompt.model,
  contents: geminiMajorPrompt.contents.replace("{{roadmapName}}", roadmapName),
  config: geminiMajorPrompt.resSchema,
});
```

## Thêm cấu hình mới

1. **Error messages**: Thêm vào `config/errors.ts`
2. **UI messages**: Thêm vào `config/ui.ts`
3. **API config**: Thêm vào `config/api.ts`
4. **Prompts**: Tạo file mới trong `config/prompt/`
5. **Constants**: Thêm vào `config/constants.ts`

Sau đó export từ `config/index.ts` để dễ import.

## Lợi ích

- ✅ Không hardcode strings trong code
- ✅ Dễ dàng thay đổi messages/prompts
- ✅ Hỗ trợ đa ngôn ngữ (có thể mở rộng)
- ✅ Type-safe với TypeScript
- ✅ Tập trung quản lý cấu hình
