const pool = require('../config/database');

class Field {
  // Crear field
  static async create(data) {
    const { venue_id, name, sport_type, surface_type, dimensions, capacity, price_per_hour, has_lighting, has_roof } = data;

    const result = await pool.query(
      `INSERT INTO fields
       (venue_id, name, sport_type, surface_type, dimensions, capacity, price_per_hour, has_lighting, has_roof)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [venue_id, name, sport_type, surface_type, dimensions, capacity, price_per_hour, has_lighting, has_roof]
    );

    return result.rows[0];
  }

  // Obtener fields por venue
  static async findByVenue(venueId) {
    const result = await pool.query(
      'SELECT * FROM fields WHERE venue_id = $1 ORDER BY name',
      [venueId]
    );
    return result.rows;
  }

  // Buscar por ID
  static async findById(id) {
    const result = await pool.query(
      `SELECT f.*, v.name as venue_name, v.address as venue_address
       FROM fields f
       LEFT JOIN venues v ON f.venue_id = v.id
       WHERE f.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Actualizar field
  static async update(id, data) {
    const { name, sport_type, surface_type, dimensions, capacity, price_per_hour, has_lighting, has_roof, is_available } = data;

    const result = await pool.query(
      `UPDATE fields
       SET name = COALESCE($1, name),
           sport_type = COALESCE($2, sport_type),
           surface_type = COALESCE($3, surface_type),
           dimensions = COALESCE($4, dimensions),
           capacity = COALESCE($5, capacity),
           price_per_hour = COALESCE($6, price_per_hour),
           has_lighting = COALESCE($7, has_lighting),
           has_roof = COALESCE($8, has_roof),
           is_available = COALESCE($9, is_available)
       WHERE id = $10
       RETURNING *`,
      [name, sport_type, surface_type, dimensions, capacity, price_per_hour, has_lighting, has_roof, is_available, id]
    );

    return result.rows[0];
  }

  // Eliminar field
  static async delete(id) {
    await pool.query('DELETE FROM fields WHERE id = $1', [id]);
  }

  // Verificar disponibilidad
  static async checkAvailability(fieldId, date, startTime, endTime) {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM bookings
       WHERE field_id = $1
       AND booking_date = $2
       AND status != 'cancelled'
       AND (
         (start_time < $4 AND end_time > $3) OR
         (start_time >= $3 AND start_time < $4) OR
         (end_time > $3 AND end_time <= $4)
       )`,
      [fieldId, date, startTime, endTime]
    );

    return result.rows[0].count === '0';
  }

  // Obtener horarios ocupados
  static async getBookedSlots(fieldId, date) {
    const result = await pool.query(
      `SELECT start_time, end_time
       FROM bookings
       WHERE field_id = $1
       AND booking_date = $2
       AND status != 'cancelled'
       ORDER BY start_time`,
      [fieldId, date]
    );
    return result.rows;
  }
}

module.exports = Field;
