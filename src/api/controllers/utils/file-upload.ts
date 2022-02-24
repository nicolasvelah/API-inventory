import multer from 'multer';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

const storageExcel = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFoder:string = process.env.UPLOAD_FOLDER ?? '';
    const uploadPath = path.join(__dirname, '', uploadFoder);
    if (!fs.existsSync(uploadPath)) {
      console.log('folder not exists');
      fs.mkdirSync(uploadPath);
    }
    cb(null, '../../uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const fileName = `${uniqueSuffix}_${file.originalname}`;
    console.log('fileName', fileName);
    cb(null, fileName);
  },
});

// eslint-disable-next-line import/prefer-default-export
export const uploadExcel = multer({ storage: storageExcel, limits: { fileSize: 1000000 } });

export const deleteFile = (filePath: string): void => {
  rimraf(filePath, () => {});
};
