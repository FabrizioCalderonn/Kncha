const pool = require('../config/database');

class Booking {
  // Crear booking
  static async create(data) {
    const {
      user_id, field_id, booking_date, start_time, end_time,
      total_hours, total_price, payment_method, notes
    } = data;

    const result = await pool.query(
      `INSERT INTO bookings
       (user_id, field_id, booking_date, start_time, end_time, total_hours, total_price, payment_method, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
       RETURNING *`,
      [user_id, field_id, booking_date, start_time, end_time, total_hours, total_price, payment_method, notes]
    );

    return result.rows[0];
  }

  // Obtener bookings por usuario
  static async findByUser(userId) {
    const result = await pool.query(
      `SELECT b.*,
              f.name as field_name, f.sport_type,
              v.name as venue_name, v.address as venue_address,
              v.phone as venue_phone
       FROM bookings b
       LEFT JOIN fields f ON b.field_id = f.id
       LEFT JOIN venues v ON f.venue_id = v.id
       WHERE b.user_id = $1
       ORDER BY b.booking_date DESC, b.start_time DESC`,
      [userId]
    );
    return result.rows;
  }

  // Obtener bookings por field
  static async findByField(fieldId) {
    const result = await pool.query(
      `SELECT b.*,
              u.name as user_name, u.email as user_email, u.phone as user_phone
       FROM bookings b
       LEFT JOIN users u ON b.user_id = u.id
       WHERE b.field_id = $1
       ORDER BY b.booking_date DESC, b.start_time DESC`,
      [fieldId]
    );
    return result.rows;
  }

  // Obtener bookings por venue (para owners)
  static async findByVenue(venueId) {
    const result = await pool.query(
      `SELECT b.*,
              f.name as field_name, f.sport_type,
              u.name as user_name, u.email as user_email, u.phone as user_phone
       FROM bookings b
       LEFT JOIN fields f ON b.field_id = f.id
       LEFT JOIN users u ON b.user_id = u.id
       WHERE f.venue_id = $1
       ORDER BY b.booking_date DESC, b.start_time DESC`,
      [venueId]
    );
    return result.rows;
  }

  // Buscar por ID
  static async findById(id) {
    const result = await pool.query(
      `SELECT b.*,
              f.name as field_name, f.sport_type,
              v.name as venue_name, v.address as venue_address, v.phone as venue_phone,
              u.name as user_name, u.email as user_email, u.phone as user_phone
       FROM bookings b
       LEFT JOIN fields f ON b.field_id = f.id
       LEFT JOIN venues v ON f.venue_id = v.id
       LEFT JOIN users u ON b.user_id = u.id
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Actualizar status
  static async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  // Actualizar payment method
  static async updatePaymentMethod(id, paymentMethod) {
    const result = await pool.query(
      'UPDATE bookings SET payment_method = $1 WHERE id = $2 RETURNING *',
      [paymentMethod, id]
    );
    return result.rows[0];
  }

  // Cancelar booking
  static async cancel(id) {
    const result = await pool.query(
      `UPDATE bookings
       SET status = 'cancelled', cancelled_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  // Obtener estadísticas (para owners)
  static async getStats(venueId, startDate, endDate) {
    const result = await pool.query(
      `SELECT
         COUNT(*) as total_bookings,
         SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
         SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END) as total_revenue
       FROM bookings b
       LEFT JOIN fields f ON b.field_id = f.id
       WHERE f.venue_id = $1
       AND b.booking_date >= $2
       AND b.booking_date <= $3`,
      [venueId, startDate, endDate]
    );
    return result.rows[0];
  }

  // Eliminar booking
  static async delete(id) {
    await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
  }
}

module.exports = Booking;
