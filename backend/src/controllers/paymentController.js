const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const Field = require('../models/Field');

// @desc    Actualizar método de pago
// @route   PUT /api/v1/payments/booking/:id/method
// @access  Private
exports.updatePaymentMethod = async (req, res, next) => {
  try {
    const { payment_method } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    // Solo el usuario que hizo la reserva puede actualizar el método de pago
    if (booking.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const updatedBooking = await Booking.updatePaymentMethod(req.params.id, payment_method);

    res.json({
      success: true,
      message: 'Método de pago actualizado',
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirmar pago (para owners)
// @route   PUT /api/v1/payments/booking/:id/confirm
// @access  Private (Owner, Admin)
exports.confirmPayment = async (req, res, next) => {
  try {
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
        message: 'No autorizado'
      });
    }

    // Actualizar estado a confirmed
    const confirmedBooking = await Booking.updateStatus(req.params.id, 'confirmed');

    res.json({
      success: true,
      message: 'Pago confirmado exitosamente',
      data: confirmedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener información de pago de una reserva
// @route   GET /api/v1/payments/booking/:id
// @access  Private
exports.getPaymentInfo = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    // Verificar que sea el usuario, owner, o admin
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
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
      data: {
        booking_id: booking.id,
        total_price: booking.total_price,
        payment_method: booking.payment_method,
        status: booking.status,
        venue_name: booking.venue_name,
        field_name: booking.field_name
      }
    });
  } catch (error) {
    next(error);
  }
};
