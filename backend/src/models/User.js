const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Crear usuario
  static async create({ email, password, name, phone, role = 'client' }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name, phone, role, created_at`,
      [email, hashedPassword, name, phone, role]
    );

    return result.rows[0];
  }

  // Buscar por email
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  // Buscar por ID
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, name, phone, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Actualizar usuario
  static async update(id, data) {
    const { name, phone, email } = data;
    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           email = COALESCE($3, email)
       WHERE id = $4
       RETURNING id, email, name, phone, role, created_at`,
      [name, phone, email, id]
    );
    return result.rows[0];
  }

  // Cambiar contraseña
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, id]
    );
  }

  // Verificar contraseña
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Obtener todos los usuarios (admin)
  static async findAll(limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT id, email, name, phone, role, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  // Eliminar usuario
  static async delete(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
}

module.exports = User;
