import { Request, Response } from "express";
import { uploadToR2 } from "../lib/r2";

export async function uploadFile(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const publicUrl = await uploadToR2(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
    res.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Upload controller error:", error);
    res.status(500).json({ error: error?.message || "Failed to upload file to Cloudflare R2" });
  }
}
