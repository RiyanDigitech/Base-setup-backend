import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import multer from "multer";

export class StorageProvider {
  private upload: multer.Multer;

  constructor() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = "./uploads/";
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
      },
    });

    this.upload = multer({ storage });
  }

  // Middleware for file uploads
  getUploadMiddleware() {
    return this.upload.single("image");
  }

  // Upload file to Cloudinary
  async uploadToCloudinary(filePath: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "user_images", // Specify a folder in your Cloudinary account
      });

      // Clean up local file after upload
      fs.unlinkSync(filePath);

      return result.secure_url;
    } catch (error) {
      throw new Error("Failed to upload file to Cloudinary");
    }
  }
}
