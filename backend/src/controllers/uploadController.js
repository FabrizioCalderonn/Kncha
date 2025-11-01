const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar storage de Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cancha-venues',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

// @desc    Subir una imagen
// @route   POST /api/v1/upload/venue
// @access  Private (Owner, Admin)
exports.uploadSingle = [
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se proporcionó ninguna imagen'
        });
      }

      res.json({
        success: true,
        message: 'Imagen subida exitosamente',
        data: {
          url: req.file.path,
          public_id: req.file.filename
        }
      });
    } catch (error) {
      next(error);
    }
  }
];

// @desc    Subir múltiples imágenes
// @route   POST /api/v1/upload/venue/multiple
// @access  Private (Owner, Admin)
exports.uploadMultiple = [
  upload.array('images', 10),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se proporcionaron imágenes'
        });
      }

      const images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));

      res.json({
        success: true,
        message: `${images.length} imágenes subidas exitosamente`,
        data: images
      });
    } catch (error) {
      next(error);
    }
  }
];

// @desc    Eliminar imagen
// @route   DELETE /api/v1/upload/:public_id
// @access  Private (Owner, Admin)
exports.deleteImage = async (req, res, next) => {
  try {
    const { public_id } = req.params;

    // Eliminar de Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Imagen eliminada exitosamente'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      });
    }
  } catch (error) {
    next(error);
  }
};
