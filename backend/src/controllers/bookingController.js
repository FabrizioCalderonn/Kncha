const Booking = require('../models/Booking');
const Field = require('../models/Field');
const Venue = require('../models/Venue');

// @desc    Crear reserva
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { field_id, booking_date, start_time, end_time, total_hours, total_price, payment_method, notes } = req.body;

    // Verificar que el field existe
    const field = await Field.findById(field_id);
    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Campo no encontrado'
      });
    }

    // Verificar disponibilidad
    const isAvailable = await Field.checkAvailability(field_id, booking_date, start_time, end_time);
    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: 'El horario seleccionado no está disponible'
      });
    }

    // Crear reserva
    const booking = await Booking.create({
      user_id: req.user.id,
      field_id,
      booking_date,
      start_time,
      end_time,
      total_hours,
      total_price,
      payment_method,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Reserva creada exitosamente',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener mis reservas
// @route   GET /api/v1/bookings/my
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findByUser(req.user.id);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener una reserva por ID
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    // Verificar que sea el usuario que hizo la reserva, el owner del venue, o admin
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      // Verificar si es owner del venue
      const field = await Field.findById(booking.field_id);
      const venue = await Venue.findById(field.venue_id);

      if (venue.owner_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'No autorizado'
        });
      }
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancelar reserva
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    // Solo el usuario que hizo la reserva puede cancelarla
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para cancelar esta reserva'
      });
    }

    // No se puede cancelar si ya está confirmada o cancelada
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'La reserva ya está cancelada'
      });
    }

    const cancelledBooking = await Booking.cancel(req.params.id);

    res.json({
      success: true,
      message: 'Reserva cancelada exitosamente',
      data: cancelledBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar estado de reserva
// @route   PUT /api/v1/bookings/:id/status
// @access  Private (Owner, Admin)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    // Verificar que sea el owner del venue o admin
    const field = await Field.findById(booking.field_id);
    const venue = await Venue.findById(field.venue_id);

    if (venue.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para actualizar esta reserva'
      });
    }

    const updatedBooking = await Booking.updateStatus(req.params.id, status);

    res.json({
      success: true,
      message: 'Estado actualizado exitosamente',
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener reservas de un venue (para owners)
// @route   GET /api/v1/bookings/venue/:venueId
// @access  Private (Owner, Admin)
exports.getVenueBookings = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.venueId);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Cancha no encontrada'
      });
    }

    // Verificar que sea el owner o admin
    if (venue.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const bookings = await Booking.findByVenue(req.params.venueId);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener estadísticas de reservas
// @route   GET /api/v1/bookings/venue/:venueId/stats
// @access  Private (Owner, Admin)
exports.getVenueStats = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;

    const venue = await Venue.findById(req.params.venueId);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Cancha no encontrada'
      });
    }

    // Verificar que sea el owner o admin
    if (venue.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const stats = await Booking.getStats(
      req.params.venueId,
      start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end_date || new Date()
    );

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
