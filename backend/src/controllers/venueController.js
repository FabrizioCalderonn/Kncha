const Venue = require('../models/Venue');
const Field = require('../models/Field');

// @desc    Obtener todas las canchas
// @route   GET /api/v1/venues
// @access  Public
exports.getVenues = async (req, res, next) => {
  try {
    const { sport_type, search } = req.query;

    const venues = await Venue.findAll({ sport_type, search });

    res.json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener una cancha por ID
// @route   GET /api/v1/venues/:id
// @access  Public
exports.getVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Cancha no encontrada'
      });
    }

    // Obtener fields de la cancha
    const fields = await Field.findByVenue(venue.id);

    res.json({
      success: true,
      data: {
        ...venue,
        fields
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear cancha
// @route   POST /api/v1/venues
// @access  Private (Owner, Admin)
exports.createVenue = async (req, res, next) => {
  try {
    const { name, description, address, latitude, longitude, phone, images } = req.body;

    const venue = await Venue.create({
      name,
      description,
      address,
      latitude,
      longitude,
      phone,
      owner_id: req.user.id,
      images
    });

    res.status(201).json({
      success: true,
      message: 'Cancha creada exitosamente',
      data: venue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar cancha
// @route   PUT /api/v1/venues/:id
// @access  Private (Owner, Admin)
exports.updateVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

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
        message: 'No autorizado para actualizar esta cancha'
      });
    }

    const updatedVenue = await Venue.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Cancha actualizada exitosamente',
      data: updatedVenue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar cancha
// @route   DELETE /api/v1/venues/:id
// @access  Private (Owner, Admin)
exports.deleteVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

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
        message: 'No autorizado para eliminar esta cancha'
      });
    }

    await Venue.delete(req.params.id);

    res.json({
      success: true,
      message: 'Cancha eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener canchas del owner actual
// @route   GET /api/v1/venues/my/venues
// @access  Private (Owner)
exports.getMyVenues = async (req, res, next) => {
  try {
    const venues = await Venue.findByOwner(req.user.id);

    res.json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (error) {
    next(error);
  }
};
