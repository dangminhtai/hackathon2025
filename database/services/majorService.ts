// Service layer cho Major queries và suggestions
import mysql from 'mysql2/promise';
import { getPool } from '../db';
import {
  MajorQuery,
  MajorSuggestion,
  MajorSkill,
  CreateMajorQueryDTO,
  CreateMajorSuggestionDTO,
} from '../models';

export class MajorService {
  // Tạo query mới
  static async createQuery(dto: CreateMajorQueryDTO): Promise<number> {
    const pool = getPool();
    const [result] = await pool.execute(
      'INSERT INTO major_queries (roadmap_id, user_id, query_text) VALUES (?, ?, ?)',
      [dto.roadmap_id, dto.user_id || null, dto.query_text || null]
    );
    return (result as mysql.ResultSetHeader).insertId;
  }

  // Lưu gợi ý chuyên ngành
  static async createSuggestion(dto: CreateMajorSuggestionDTO): Promise<number> {
    const pool = getPool();
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Insert major suggestion
      const [result] = await connection.execute(
        'INSERT INTO major_suggestions (query_id, major_name, description) VALUES (?, ?, ?)',
        [dto.query_id, dto.major_name, dto.description || null]
      );
      const suggestionId = (result as mysql.ResultSetHeader).insertId;

      // Insert skills
      if (dto.skills && dto.skills.length > 0) {
        const skillValues = dto.skills.map(skill => [suggestionId, skill]);
        await connection.query(
          'INSERT INTO major_skills (major_suggestion_id, skill_name) VALUES ?',
          [skillValues]
        );
      }

      await connection.commit();
      return suggestionId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Lấy tất cả suggestions cho một query
  static async getSuggestionsByQueryId(queryId: number): Promise<MajorSuggestion[]> {
    const pool = getPool();
    const [rows] = await pool.execute(
      `SELECT ms.*, 
        GROUP_CONCAT(mks.skill_name ORDER BY mks.id SEPARATOR ',') as skills
       FROM major_suggestions ms
       LEFT JOIN major_skills mks ON ms.id = mks.major_suggestion_id
       WHERE ms.query_id = ?
       GROUP BY ms.id
       ORDER BY ms.created_at DESC`,
      [queryId]
    );

    return (rows as any[]).map(row => ({
      id: row.id,
      query_id: row.query_id,
      major_name: row.major_name,
      description: row.description,
      created_at: row.created_at,
      skills: row.skills
        ? row.skills.split(',').map((skill: string) => ({
            id: 0,
            major_suggestion_id: row.id,
            skill_name: skill,
            created_at: new Date(),
          }))
        : [],
    }));
  }

  // Lấy query theo roadmap_id (có thể dùng để cache)
  static async getRecentQueriesByRoadmap(roadmapId: string, limit: number = 10): Promise<MajorQuery[]> {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM major_queries WHERE roadmap_id = ? ORDER BY created_at DESC LIMIT ?',
      [roadmapId, limit]
    );
    return rows as MajorQuery[];
  }
}

