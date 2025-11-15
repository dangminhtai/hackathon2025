
import { GoogleGenAI, Type } from "@google/genai";
import { MajorSuggestion, CareerSuggestion } from '../types';

// Vite chỉ expose các biến có prefix VITE_ ra client-side
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ GEMINI_API_KEY không được tìm thấy. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const suggestMajorsForRoadmap = async (roadmapName: string): Promise<MajorSuggestion[]> => {
  try {
    if (!apiKey) {
      throw new Error("API Key chưa được cấu hình. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `Dựa trên lộ trình học tập "${roadmapName}", hãy đề xuất 5 chuyên ngành đại học phù hợp. Với mỗi chuyên ngành, cung cấp một mô tả ngắn gọn (2-3 câu) và danh sách các kỹ năng cốt lõi cần có.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              majorName: {
                type: Type.STRING,
                description: "Tên của chuyên ngành được đề xuất.",
              },
              description: {
                type: Type.STRING,
                description: "Mô tả ngắn gọn về chuyên ngành.",
              },
              coreSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Danh sách các kỹ năng cốt lõi cần thiết cho chuyên ngành.",
              },
            },
            required: ["majorName", "description", "coreSkills"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const suggestions: MajorSuggestion[] = JSON.parse(jsonText);
    return suggestions;
  } catch (error: any) {
    console.error("Lỗi khi gọi Gemini API để gợi ý chuyên ngành:", error);
    const errorMessage = error?.message || "Không thể nhận được gợi ý chuyên ngành. Vui lòng thử lại.";
    throw new Error(errorMessage);
  }
};

export const suggestCareersForSubjects = async (subjectNames: string[]): Promise<CareerSuggestion[]> => {
  try {
    if (!apiKey) {
      throw new Error("API Key chưa được cấu hình. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `Tôi là một sinh viên đại học và các môn học yêu thích của tôi là: ${subjectNames.join(', ')}. Dựa trên những sở thích này, hãy đề xuất 5 định hướng nghề nghiệp tiềm năng. Với mỗi định hướng, cung cấp một mô tả ngắn gọn về công việc và lý do tại sao nó phù hợp với các môn học đã chọn.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              careerName: {
                type: Type.STRING,
                description: "Tên của định hướng nghề nghiệp.",
              },
              description: {
                type: Type.STRING,
                description: "Mô tả ngắn gọn về công việc và triển vọng.",
              },
              suitability: {
                type: Type.STRING,
                description: "Giải thích tại sao nghề nghiệp này lại phù hợp với các môn học đã chọn.",
              },
            },
            required: ["careerName", "description", "suitability"],
          },
        },
      },
    });
    
    const jsonText = response.text.trim();
    const suggestions: CareerSuggestion[] = JSON.parse(jsonText);
    return suggestions;
  } catch (error: any) {
    console.error("Lỗi khi gọi Gemini API để gợi ý nghề nghiệp:", error);
    const errorMessage = error?.message || "Không thể nhận được gợi ý nghề nghiệp. Vui lòng thử lại.";
    throw new Error(errorMessage);
  }
};
