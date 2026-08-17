import express from "express";
import upload from "../middleware/multer.js";
import { uploadImage, deleteImage } from "../controllers/uploadController.js";

const router = express.Router();

// POST /api/uploads/upload - uses memory multer and streams to Cloudinary in controller
router.post("/upload", upload.single("image"), uploadImage);

// DELETE /api/uploads/image/:publicId - delete image from Cloudinary or local storage
router.delete('/image/:publicId', deleteImage);

export default router;