import { v2 as cloudinary } from 'cloudinary';
import DatauriParser from 'datauri/parser.js';
import path from 'path';

/**
 * Uploads a file to Cloudinary.
 * @param {object} file - The file object from multer (req.file).
 * @param {string} publicId - The desired public_id for the file on Cloudinary.
 * @returns {Promise<object>} - The upload result from Cloudinary.
 */
export const uploadToCloudinary = (file, publicId) => {
    const parser = new DatauriParser();
    const fileExtension = path.extname(file.originalname).toString();
    const fileContent = parser.format(fileExtension, file.buffer).content;

    return cloudinary.uploader.upload(fileContent, {
        public_id: publicId,
        overwrite: true,
    });
};