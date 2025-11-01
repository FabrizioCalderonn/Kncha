const User = require('../models/User');
const Venue = require('../models/Venue');
const Booking = require('../models/Booking');
const pool = require('../config/database');

// @desc    Obtener todos los usuarios
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const users = await User.findAll(limit, offset);

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener todas las canchas
// @route   GET /api/v1/admin/venues
// @access  Private (Admin)
exports.getVenues = async (req, res, next) => {
  try {
    const venues = await Venue.findAll();

    res.json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir eliminar otros admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No se puede eliminar un administrador'
      });
    }

    await User.delete(req.params.id);

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar rol de usuario
// @route   PUT /api/v1/admin/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['client', 'owner', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2',
      [role, req.params.id]
    );

    const updatedUser = await User.findById(req.params.id);

    res.json({
      success: true,
      message: 'Rol actualizado exitosamente',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener estadísticas generales
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res, next) => {
  try {
    // Total de usuarios
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Total de venues
    const venuesResult = await pool.query('SELECT COUNT(*) as count FROM venues');
    const totalVenues = parseInt(venuesResult.rows[0].count);

    // Total de bookings
    const bookingsResult = await pool.query('SELECT COUNT(*) as count FROM bookings');
    const totalBookings = parseInt(bookingsResult.rows[0].count);

    // Bookings confirmados
    const confirmedResult = await pool.query(
      "SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'"
    );
    const confirmedBookings = parseInt(confirmedResult.rows[0].count);

    // Revenue total
    const revenueResult = await pool.query(
      "SELECT SUM(total_price) as revenue FROM bookings WHERE status = 'confirmed'"
    );
    const totalRevenue = parseFloat(revenueResult.rows[0].revenue || 0);

    res.json({
      success: true,
      data: {
        total_users: totalUsers,
        total_venues: totalVenues,
        total_bookings: totalBookings,
        confirmed_bookings: confirmedBookings,
        total_revenue: totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};
