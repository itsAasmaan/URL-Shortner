import database from "../config/database.js";
import { Click, CreateClickDTO, ClickStats } from "../types/index.js";

class ClickRepository {
  /**
   * Record a click
   */
  async create(data: CreateClickDTO): Promise<Click> {
    const query = `
      INSERT INTO clicks (url_id, ip_address, user_agent, referrer, country)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      data.url_id,
      data.ip_address || null,
      data.user_agent || null,
      data.referrer || null,
      data.country || null,
    ];

    const result = await database.query(query, values);
    return result.rows[0];
  }

  /**
   * Get total clicks for a URL
   */
  async countByUrlId(urlId: number): Promise<number> {
    const query = `
      SELECT COUNT(*) FROM clicks WHERE url_id = $1
    `;

    const result = await database.query(query, [urlId]);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Get clicks by URL ID with pagination
   */
  async findByUrlId(urlId: number, limit: number = 100, offset: number = 0): Promise<Click[]> {
    const query = `
      SELECT * FROM clicks 
      WHERE url_id = $1 
      ORDER BY clicked_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await database.query(query, [urlId, limit, offset]);
    return result.rows;
  }

  /**
   * Get click statistics for a URL
   */
  async getStatsByUrlId(urlId: number, days: number = 30): Promise<ClickStats> {
    const totalQuery = `
      SELECT COUNT(*) as total FROM clicks WHERE url_id = $1
    `;
    const totalResult = await database.query(totalQuery, [urlId]);
    const totalClicks = parseInt(totalResult.rows[0].total, 10);

    const dayQuery = `
      SELECT 
        DATE(clicked_at) as date,
        COUNT(*) as count
      FROM clicks
      WHERE url_id = $1 
      AND clicked_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(clicked_at)
      ORDER BY date DESC
    `;
    const dayResult = await database.query(dayQuery, [urlId]);
    const clicksByDay = dayResult.rows.map((row) => ({
      date: row.date,
      count: parseInt(row.count, 10),
    }));

    const referrerQuery = `
      SELECT 
        COALESCE(referrer, 'Direct') as referrer,
        COUNT(*) as count
      FROM clicks
      WHERE url_id = $1
      GROUP BY referrer
      ORDER BY count DESC
      LIMIT 10
    `;
    const referrerResult = await database.query(referrerQuery, [urlId]);
    const topReferrers = referrerResult.rows.map((row) => ({
      referrer: row.referrer,
      count: parseInt(row.count, 10),
    }));

    const countryQuery = `
      SELECT 
        COALESCE(country, 'Unknown') as country,
        COUNT(*) as count
      FROM clicks
      WHERE url_id = $1
      GROUP BY country
      ORDER BY count DESC
      LIMIT 10
    `;
    const countryResult = await database.query(countryQuery, [urlId]);
    const topCountries = countryResult.rows.map((row) => ({
      country: row.country,
      count: parseInt(row.count, 10),
    }));

    return {
      totalClicks,
      clicksByDay,
      topReferrers,
      topCountries,
    };
  }

  /**
   * Get clicks in date range
   */
  async findByDateRange(urlId: number, startDate: Date, endDate: Date): Promise<Click[]> {
    const query = `
      SELECT * FROM clicks 
      WHERE url_id = $1 
      AND clicked_at BETWEEN $2 AND $3
      ORDER BY clicked_at DESC
    `;

    const result = await database.query(query, [urlId, startDate, endDate]);
    return result.rows;
  }

  /**
   * Delete all clicks for a URL
   */
  async deleteByUrlId(urlId: number): Promise<number> {
    const query = `
      DELETE FROM clicks WHERE url_id = $1
    `;

    const result = await database.query(query, [urlId]);
    return result.rowCount || 0;
  }

  /**
   * Get recent clicks across all URLs
   */
  async getRecentClicks(limit: number = 10): Promise<any[]> {
    const query = `
      SELECT 
        c.*,
        u.short_code,
        u.original_url
      FROM clicks c
      JOIN urls u ON c.url_id = u.id
      ORDER BY c.clicked_at DESC
      LIMIT $1
    `;

    const result = await database.query(query, [limit]);
    return result.rows;
  }
}

export default new ClickRepository();
