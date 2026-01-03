import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

/**
 * Reusable interceptor for profile picture uploads.
 * @param field The name of the file field (default: 'picture')
 */
export function PictureInterceptor(field = 'picture') {
  return FileInterceptor(field, {
    storage: diskStorage({
      destination: './uploads',
      filename: (_req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
   fileFilter: (_req, file, callback) => {
  if (!file.mimetype.startsWith('image/')) {
    return callback(
      new Error('Only image files are allowed'),
      false,
    );
  }
  callback(null, true);
},

  });
}
