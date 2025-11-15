// Database Models/Interfaces cho MySQL

export interface Roadmap {
  id: string;
  name: string;
  description: string | null;
  icon_name: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Subject {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  email: string | null;
  name: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface MajorQuery {
  id: number;
  roadmap_id: string;
  user_id: number | null;
  query_text: string | null;
  created_at: Date;
}

export interface MajorSuggestion {
  id: number;
  query_id: number;
  major_name: string;
  description: string | null;
  created_at: Date;
  skills?: MajorSkill[];
}

export interface MajorSkill {
  id: number;
  major_suggestion_id: number;
  skill_name: string;
  created_at: Date;
}

export interface CareerQuery {
  id: number;
  user_id: number | null;
  query_text: string | null;
  created_at: Date;
  subjects?: Subject[];
}

export interface CareerSuggestion {
  id: number;
  query_id: number;
  career_name: string;
  description: string | null;
  suitability: string | null;
  created_at: Date;
}

export interface CareerQuerySubject {
  id: number;
  career_query_id: number;
  subject_id: string;
}

// DTOs (Data Transfer Objects) cho API
export interface CreateMajorQueryDTO {
  roadmap_id: string;
  user_id?: number;
  query_text?: string;
}

export interface CreateMajorSuggestionDTO {
  query_id: number;
  major_name: string;
  description?: string;
  skills: string[];
}

export interface CreateCareerQueryDTO {
  user_id?: number;
  query_text?: string;
  subject_ids: string[];
}

export interface CreateCareerSuggestionDTO {
  query_id: number;
  career_name: string;
  description?: string;
  suitability?: string;
}

