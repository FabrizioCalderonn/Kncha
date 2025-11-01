const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
  }

  // Error de duplicado (PostgreSQL)
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'El registro ya existe'
    });
  }

  // Error de clave foránea (PostgreSQL)
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida'
    });
  }

  // Error genérico del servidor
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
