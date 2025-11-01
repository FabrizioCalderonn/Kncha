import api from '../config/api';

/**
 * Servicio de upload de imágenes a Cloudinary
 */

// Subir una imagen
export const uploadImage = async (imageUri) => {
  try {
    // Crear FormData
    const formData = new FormData();

    // Obtener el nombre del archivo y tipo
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // Agregar la imagen al FormData
    formData.append('image', {
      uri: imageUri,
      name: filename,
      type: type
    });

    // Hacer la petición
    const response = await api.post('/upload/venue', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al subir imagen:', error.response?.data || error.message);
    throw error;
  }
};

// Subir múltiples imágenes
export const uploadMultipleImages = async (imageUris) => {
  try {
    const formData = new FormData();

    // Agregar cada imagen al FormData
    imageUris.forEach((uri, index) => {
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('images', {
        uri: uri,
        name: filename,
        type: type
      });
    });

    const response = await api.post('/upload/venue/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al subir imágenes:', error.response?.data || error.message);
    throw error;
  }
};

// Eliminar imagen
export const deleteImage = async (publicId) => {
  try {
    const response = await api.delete(`/upload/${publicId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar imagen:', error.response?.data || error.message);
    throw error;
  }
};

export const uploadService = {
  uploadImage,
  uploadMultipleImages,
  deleteImage
};
