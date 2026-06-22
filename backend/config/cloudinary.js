import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dummy_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'dummy_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'dummy_secret'
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'quizmaster_avatars',
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
    transformation: [{ width: 250, height: 250, crop: 'fill' }]
  }
});

export const upload = multer({ storage });
export { cloudinary };
