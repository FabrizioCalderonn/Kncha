const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateField } = require('../middleware/validation');
const {
  getFieldsByVenue,
  getField,
  createField,
  updateField,
  deleteField,
  checkAvailability,
  getBookedSlots
} = require('../controllers/fieldController');

router.get('/venue/:venueId', getFieldsByVenue);
router.get('/:id', getField);
router.get('/:id/booked-slots', getBookedSlots);
router.post('/:id/availability', checkAvailability);
router.post('/', protect, authorize('owner', 'admin'), validateField, createField);
router.put('/:id', protect, authorize('owner', 'admin'), updateField);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteField);

module.exports = router;
