const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  uploadSingle,
  uploadMultiple,
  deleteImage
} = require('../controllers/uploadController');

// Todas las rutas requieren autenticación y role owner/admin
router.use(protect, authorize('owner', 'admin'));

router.post('/venue', uploadSingle);
router.post('/venue/multiple', uploadMultiple);
router.delete('/:public_id', deleteImage);

module.exports = router;
