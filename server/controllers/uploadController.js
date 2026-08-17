import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import fs from "fs";
import path from "path";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // If Cloudinary is configured, stream to Cloudinary.
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();

      return res.json({ url: result.secure_url, public_id: result.public_id });
    }

    // Fallback: save to local uploads/ directory for development when Cloudinary is not configured.
    const uploadsDir = path.join(process.cwd(), "server", "uploads");
    fs.mkdirSync(uploadsDir, { recursive: true });

    // Preserve original extension if possible, otherwise default to .jpg
    const ext = (req.file.mimetype && req.file.mimetype.split("/")[1]) || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    fs.writeFileSync(filepath, req.file.buffer);

    const url = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

    return res.json({ url, local: true, filename });
  } catch (error) {
    console.error("uploadImage error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ message: 'publicId is required' });
    }

    // If Cloudinary configured, destroy the resource
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Cloudinary destroy error:', error);
          return res.status(500).json({ message: 'Failed to delete image' });
        }

        return res.json({ message: 'Image deleted', result });
      });

      return;
    }

    // Local fallback: delete file from server/uploads
    const uploadsDir = path.join(process.cwd(), 'server', 'uploads');
    const filepath = path.join(uploadsDir, publicId);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return res.json({ message: 'Image deleted', filename: publicId });
    }

    return res.status(404).json({ message: 'File not found' });
  } catch (error) {
    console.error('deleteImage error:', error);
    res.status(500).json({ message: error.message });
  }
};