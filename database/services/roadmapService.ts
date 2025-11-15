// Service layer cho Roadmaps và Subjects
import { getPool } from '../db';
import { Roadmap, Subject } from '../models';

export class RoadmapService {
  // Lấy tất cả roadmaps
  static async getAll(): Promise<Roadmap[]> {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM roadmaps ORDER BY id');
    return rows as Roadmap[];
  }

  // Lấy roadmap theo ID
  static async getById(id: string): Promise<Roadmap | null> {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM roadmaps WHERE id = ?', [id]);
    const results = rows as Roadmap[];
    return results.length > 0 ? results[0] : null;
  }
}

export class SubjectService {
  // Lấy tất cả subjects
  static async getAll(): Promise<Subject[]> {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM subjects ORDER BY name');
    return rows as Subject[];
  }

  // Lấy subject theo ID
  static async getById(id: string): Promise<Subject | null> {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM subjects WHERE id = ?', [id]);
    const results = rows as Subject[];
    return results.length > 0 ? results[0] : null;
  }

  // Lấy subjects theo IDs
  static async getByIds(ids: string[]): Promise<Subject[]> {
    if (ids.length === 0) return [];
    const pool = getPool();
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await pool.execute(
      `SELECT * FROM subjects WHERE id IN (${placeholders})`,
      ids
    );
    return rows as Subject[];
  }
}

