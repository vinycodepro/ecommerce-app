import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post(
    "/upload",
    upload.single("image"),
    async (req, res) => {

        const result = await cloudinary.uploader.upload(req.file.path);

        res.json(result);
    }
);

export default router;