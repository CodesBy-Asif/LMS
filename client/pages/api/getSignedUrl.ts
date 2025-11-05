import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { publicId } = req.query;

  if (!publicId) return res.status(400).json({ error: "Missing publicId" });

  // Generate signed video URL
  const signedUrl = cloudinary.url(publicId as string, {
    resource_type: "video",
    sign_url: true, // <-- SIGNED URL
    secure: true,
  });

  res.status(200).json({ signedUrl });
}
