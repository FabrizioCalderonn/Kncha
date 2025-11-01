const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getVenues,
  deleteUser,
  updateUserRole,
  getStats
} = require('../controllers/adminController');

// Todas las rutas requieren role admin
router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.get('/venues', getVenues);
router.get('/stats', getStats);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
