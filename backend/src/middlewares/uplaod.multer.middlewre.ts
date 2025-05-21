import multer from 'multer';
import cloudinary from '../configs/cloudinary.config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'chat-app/images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  }),
});

export const uploadProfile = multer({ storage: userStorage });
