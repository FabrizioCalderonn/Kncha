const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Verificar token JWT
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Obtener token del header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Token no proporcionado'
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario de la base de datos
      const result = await pool.query(
        'SELECT id, email, role, name FROM users WHERE id = $1',
        [decoded.id]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      req.user = result.rows[0];
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Token inválido'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Verificar roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }
    next();
  };
};
