import database from "../config/database.js";
import { URL, CreateURLDTO } from "../types/index.js";

class URLRepository {
  /**
   * Create a new URL entry
   */
  async create(data: {
    short_code: string;
    original_url: string;
    alias: boolean;
    user_id: string | undefined;
    expires_at: Date;
  }): Promise<URL> {
    const query = `
        INSERT INTO urls (short_code, original_url, alias, user_id, expires_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;

    const values = [data.short_code, data.original_url, data.alias, data.user_id || null, data.expires_at || null];

    const result = await database.query(query, values);

    return result.rows[0];
  }

  /**
   * Find URL by short code
   */
  async findByShortCode(shortCode: string): Promise<URL | null> {
    const query = `
        SELECT * FROM urls
        WHERE short_code = $1 AND active = true
    `;

    const result = await database.query(query, [shortCode]);

    return result.rows[0] || null;
  }

  /**
   * Find URL by ID
   */
  async findById(id: number): Promise<URL | null> {
    const query = `
        SELECT * FROM urls
        WHERE id = $1
    `;

    const result = await database.query(query, [id]);

    return result.rows[0] || null;
  }

  /**
   * Check if short code exists
   */
  async existsByShortCode(shortCode: string): Promise<boolean> {
    const query = `
      SELECT EXISTS(SELECT 1 FROM urls WHERE short_code = $1)
    `;

    const result = await database.query(query, [shortCode]);
    return result.rows[0].exists;
  }

  /**
   * Find all URLs by user ID
   */
  async findByUserId(userId: string, limit: number = 50, offset: number = 0): Promise<URL[]> {
    const query = `
      SELECT * FROM urls 
      WHERE user_id = $1 AND active = true
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await database.query(query, [userId, limit, offset]);
    return result.rows;
  }

  /**
   * Count URLs by user ID
   */
  async countByUserId(userId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) FROM urls WHERE user_id = $1
    `;

    const result = await database.query(query, [userId]);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Update URL
   */
  async update(id: number, data: Partial<URL>): Promise<URL | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE urls 
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await database.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Soft delete URL (set active to false)
   */
  async softDelete(id: number): Promise<boolean> {
    const query = `
      UPDATE urls 
      SET active = false 
      WHERE id = $1
      RETURNING id
    `;

    const result = await database.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Hard delete URL
   */
  async delete(id: number): Promise<boolean> {
    const query = `
      DELETE FROM urls WHERE id = $1
    `;

    const result = await database.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Find expired URLs
   */
  async findExpired(): Promise<URL[]> {
    const query = `
      SELECT * FROM urls 
      WHERE expires_at IS NOT NULL 
      AND expires_at < NOW() 
      AND active = true
    `;

    const result = await database.query(query);
    return result.rows;
  }

  /**
   * Deactivate expired URLs
   */
  async deactivateExpired(): Promise<number> {
    const query = `
      UPDATE urls 
      SET active = false 
      WHERE expires_at IS NOT NULL 
      AND expires_at < NOW() 
      AND active = true
    `;

    const result = await database.query(query);
    return result.rowCount || 0;
  }

  /**
   * Get URL statistics
   */
  async getStats(shortCode: string): Promise<any> {
    const query = `
      SELECT 
        u.*,
        COUNT(c.id) as total_clicks,
        MAX(c.clicked_at) as last_clicked
      FROM urls u
      LEFT JOIN clicks c ON u.id = c.url_id
      WHERE u.short_code = $1
      GROUP BY u.id
    `;

    const result = await database.query(query, [shortCode]);
    return result.rows[0] || null;
  }
}

export default new URLRepository();
