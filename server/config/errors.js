// server/config/errors.js (for server-side only)
export const ERROR_MESSAGES = {
  API_KEY_NOT_CONFIGURED: "API Key chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào file .env",
  API_KEY_NOT_FOUND: "GEMINI_API_KEY không được tìm thấy. Vui lòng thêm GEMINI_API_KEY vào file .env",
  MAJOR_SUGGESTION_FAILED: "Không thể nhận được gợi ý chuyên ngành. Vui lòng thử lại.",
  CAREER_SUGGESTION_FAILED: "Không thể nhận được gợi ý nghề nghiệp. Vui lòng thử lại.",
  GENERIC_ERROR: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
  NO_SUBJECTS_SELECTED: "Vui lòng chọn ít nhất một môn học.",
};

