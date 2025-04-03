import multer from 'multer';
import path from 'path';
import fs from 'fs';

export function checkFileType(file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images or PDFs Only!');
    }
}

export async function upload() {

    const destination= `uploads/${user}/`;

// Set up storage engine
    const storage = multer.diskStorage({
        destination: destination,
        filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    // Init upload
    const upload = multer({
        storage: storage,
        limits: { fileSize: 1000000 }, // Limit file size to 1MB
        fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
        }
    }).single('myImage');

}

