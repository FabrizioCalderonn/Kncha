const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateVenue } = require('../middleware/validation');
const {
  getVenues,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue,
  getMyVenues
} = require('../controllers/venueController');

router.get('/', getVenues);
router.get('/my/venues', protect, authorize('owner', 'admin'), getMyVenues);
router.get('/:id', getVenue);
router.post('/', protect, authorize('owner', 'admin'), validateVenue, createVenue);
router.put('/:id', protect, authorize('owner', 'admin'), updateVenue);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteVenue);

module.exports = router;
