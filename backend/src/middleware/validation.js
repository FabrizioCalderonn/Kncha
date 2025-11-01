// Validar email
exports.validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validar teléfono (El Salvador)
exports.validatePhone = (phone) => {
  const re = /^[267]\d{7}$/;
  return re.test(phone.replace(/\s|-/g, ''));
};

// Validar contraseña
exports.validatePassword = (password) => {
  return password && password.length >= 6;
};

// Middleware de validación de registro
exports.validateRegister = (req, res, next) => {
  const { email, password, name, phone } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  if (!email || !exports.validateEmail(email)) {
    errors.push('Email inválido');
  }

  if (!password || !exports.validatePassword(password)) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  if (phone && !exports.validatePhone(phone)) {
    errors.push('Teléfono inválido (debe ser de El Salvador)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors
    });
  }

  next();
};

// Middleware de validación de login
exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !exports.validateEmail(email)) {
    errors.push('Email inválido');
  }

  if (!password) {
    errors.push('Contraseña requerida');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors
    });
  }

  next();
};

// Validación de venue
exports.validateVenue = (req, res, next) => {
  const { name, address, description } = req.body;
  const errors = [];

  if (!name || name.trim().length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres');
  }

  if (!address || address.trim().length < 5) {
    errors.push('La dirección debe tener al menos 5 caracteres');
  }

  if (description && description.length > 1000) {
    errors.push('La descripción no puede exceder 1000 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors
    });
  }

  next();
};

// Validación de field
exports.validateField = (req, res, next) => {
  const { name, sport_type, price_per_hour } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  if (!sport_type || sport_type.trim().length < 2) {
    errors.push('El tipo de deporte es requerido');
  }

  if (!price_per_hour || price_per_hour <= 0) {
    errors.push('El precio por hora debe ser mayor a 0');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors
    });
  }

  next();
};
