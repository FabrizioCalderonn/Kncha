const Field = require('../models/Field');
const Venue = require('../models/Venue');

// @desc    Obtener fields de una cancha
// @route   GET /api/v1/fields/venue/:venueId
// @access  Public
exports.getFieldsByVenue = async (req, res, next) => {
  try {
    const fields = await Field.findByVenue(req.params.venueId);

    res.json({
      success: true,
      count: fields.length,
      data: fields
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener un field por ID
// @route   GET /api/v1/fields/:id
// @access  Public
exports.getField = async (req, res, next) => {
  try {
    const field = await Field.findById(req.params.id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Campo no encontrado'
      });
    }

    res.json({
      success: true,
      data: field
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear field
// @route   POST /api/v1/fields
// @access  Private (Owner, Admin)
exports.createField = async (req, res, next) => {
  try {
    const { venue_id, name, sport_type, surface_type, dimensions, capacity, price_per_hour, has_lighting, has_roof } = req.body;

    // Verificar que el venue existe
    const venue = await Venue.findById(venue_id);
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
        message: 'No autorizado para crear campos en esta cancha'
      });
    }

    const field = await Field.create({
      venue_id,
      name,
      sport_type,
      surface_type,
      dimensions,
      capacity,
      price_per_hour,
      has_lighting,
      has_roof
    });

    res.status(201).json({
      success: true,
      message: 'Campo creado exitosamente',
      data: field
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar field
// @route   PUT /api/v1/fields/:id
// @access  Private (Owner, Admin)
exports.updateField = async (req, res, next) => {
  try {
    const field = await Field.findById(req.params.id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Campo no encontrado'
      });
    }

    // Verificar ownership del venue
    const venue = await Venue.findById(field.venue_id);
    if (venue.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para actualizar este campo'
      });
    }

    const updatedField = await Field.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Campo actualizado exitosamente',
      data: updatedField
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar field
// @route   DELETE /api/v1/fields/:id
// @access  Private (Owner, Admin)
exports.deleteField = async (req, res, next) => {
  try {
    const field = await Field.findById(req.params.id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Campo no encontrado'
      });
    }

    // Verificar ownership del venue
    const venue = await Venue.findById(field.venue_id);
    if (venue.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para eliminar este campo'
      });
    }

    await Field.delete(req.params.id);

    res.json({
      success: true,
      message: 'Campo eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verificar disponibilidad
// @route   POST /api/v1/fields/:id/availability
// @access  Public
exports.checkAvailability = async (req, res, next) => {
  try {
    const { date, start_time, end_time } = req.body;

    const isAvailable = await Field.checkAvailability(
      req.params.id,
      date,
      start_time,
      end_time
    );

    res.json({
      success: true,
      data: {
        is_available: isAvailable
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener horarios ocupados
// @route   GET /api/v1/fields/:id/booked-slots
// @access  Public
exports.getBookedSlots = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Fecha requerida'
      });
    }

    const bookedSlots = await Field.getBookedSlots(req.params.id, date);

    res.json({
      success: true,
      data: bookedSlots
    });
  } catch (error) {
    next(error);
  }
};
