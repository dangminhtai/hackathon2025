// Service layer cho Career queries và suggestions
import { getPool } from '../db';
import {
  CareerQuery,
  CareerSuggestion,
  CreateCareerQueryDTO,
  CreateCareerSuggestionDTO,
  Subject,
} from '../models';
import mysql from 'mysql2/promise';

export class CareerService {
  // Tạo query mới
  static async createQuery(dto: CreateCareerQueryDTO): Promise<number> {
    const pool = getPool();
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Insert career query
      const [result] = await connection.execute(
        'INSERT INTO career_queries (user_id, query_text) VALUES (?, ?)',
        [dto.user_id || null, dto.query_text || null]
      );
      const queryId = (result as mysql.ResultSetHeader).insertId;

      // Insert subject relationships
      if (dto.subject_ids && dto.subject_ids.length > 0) {
        const subjectValues = dto.subject_ids.map(subjectId => [queryId, subjectId]);
        await connection.query(
          'INSERT INTO career_query_subjects (career_query_id, subject_id) VALUES ?',
          [subjectValues]
        );
      }

      await connection.commit();
      return queryId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Lưu gợi ý nghề nghiệp
  static async createSuggestion(dto: CreateCareerSuggestionDTO): Promise<number> {
    const pool = getPool();
    const [result] = await pool.execute(
      'INSERT INTO career_suggestions (query_id, career_name, description, suitability) VALUES (?, ?, ?, ?)',
      [dto.query_id, dto.career_name, dto.description || null, dto.suitability || null]
    );
    return (result as mysql.ResultSetHeader).insertId;
  }

  // Lấy tất cả suggestions cho một query
  static async getSuggestionsByQueryId(queryId: number): Promise<CareerSuggestion[]> {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM career_suggestions WHERE query_id = ? ORDER BY created_at DESC',
      [queryId]
    );
    return rows as CareerSuggestion[];
  }

  // Lấy query kèm subjects
  static async getQueryWithSubjects(queryId: number): Promise<CareerQuery | null> {
    const pool = getPool();
    const [rows] = await pool.execute(
      `SELECT cq.*, 
        GROUP_CONCAT(s.id) as subject_ids,
        GROUP_CONCAT(s.name) as subject_names
       FROM career_queries cq
       LEFT JOIN career_query_subjects cqs ON cq.id = cqs.career_query_id
       LEFT JOIN subjects s ON cqs.subject_id = s.id
       WHERE cq.id = ?
       GROUP BY cq.id`,
      [queryId]
    );

    const results = rows as any[];
    if (results.length === 0) return null;

    const row = results[0];
    return {
      id: row.id,
      user_id: row.user_id,
      query_text: row.query_text,
      created_at: row.created_at,
      subjects: row.subject_ids
        ? row.subject_ids.split(',').map((id: string, index: number) => ({
            id,
            name: row.subject_names.split(',')[index],
            created_at: new Date(),
            updated_at: new Date(),
          }))
        : [],
    };
  }

  // Lấy recent queries
  static async getRecentQueries(limit: number = 10): Promise<CareerQuery[]> {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT * FROM career_queries ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    return rows as CareerQuery[];
  }
}

