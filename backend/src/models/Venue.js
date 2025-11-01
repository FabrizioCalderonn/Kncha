const pool = require('../config/database');

class Venue {
  // Crear venue
  static async create(data) {
    const { name, description, address, latitude, longitude, phone, owner_id, images } = data;

    const result = await pool.query(
      `INSERT INTO venues (name, description, address, latitude, longitude, phone, owner_id, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, description, address, latitude, longitude, phone, owner_id, images || []]
    );

    return result.rows[0];
  }

  // Obtener todos los venues
  static async findAll(filters = {}) {
    let query = `
      SELECT v.*, u.name as owner_name, u.email as owner_email,
             COUNT(DISTINCT f.id) as fields_count
      FROM venues v
      LEFT JOIN users u ON v.owner_id = u.id
      LEFT JOIN fields f ON f.venue_id = v.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    // Filtro por sport_type
    if (filters.sport_type) {
      query += ` AND EXISTS (
        SELECT 1 FROM fields
        WHERE venue_id = v.id
        AND sport_type ILIKE $${paramCount}
      )`;
      params.push(`%${filters.sport_type}%`);
      paramCount++;
    }

    // Filtro por ubicación (búsqueda en nombre, dirección)
    if (filters.search) {
      query += ` AND (v.name ILIKE $${paramCount} OR v.address ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ` GROUP BY v.id, u.name, u.email ORDER BY v.created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  // Buscar por ID
  static async findById(id) {
    const result = await pool.query(
      `SELECT v.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
       FROM venues v
       LEFT JOIN users u ON v.owner_id = u.id
       WHERE v.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Obtener venues por owner
  static async findByOwner(ownerId) {
    const result = await pool.query(
      `SELECT v.*, COUNT(DISTINCT f.id) as fields_count
       FROM venues v
       LEFT JOIN fields f ON f.venue_id = v.id
       WHERE v.owner_id = $1
       GROUP BY v.id
       ORDER BY v.created_at DESC`,
      [ownerId]
    );
    return result.rows;
  }

  // Actualizar venue
  static async update(id, data) {
    const { name, description, address, latitude, longitude, phone, images } = data;

    const result = await pool.query(
      `UPDATE venues
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           address = COALESCE($3, address),
           latitude = COALESCE($4, latitude),
           longitude = COALESCE($5, longitude),
           phone = COALESCE($6, phone),
           images = COALESCE($7, images)
       WHERE id = $8
       RETURNING *`,
      [name, description, address, latitude, longitude, phone, images, id]
    );

    return result.rows[0];
  }

  // Eliminar venue
  static async delete(id) {
    await pool.query('DELETE FROM venues WHERE id = $1', [id]);
  }

  // Verificar ownership
  static async isOwner(venueId, userId) {
    const result = await pool.query(
      'SELECT owner_id FROM venues WHERE id = $1',
      [venueId]
    );
    return result.rows[0]?.owner_id === userId;
  }
}

module.exports = Venue;
