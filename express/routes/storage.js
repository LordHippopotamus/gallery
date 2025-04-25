import { Router } from "express";
import * as Minio from "minio";
import multer from "multer";
import crypto from "crypto";

import { config } from "dotenv";
import { prisma } from "../lib/prisma.js";
import path from "path";
config();

const upload = multer({ storage: multer.memoryStorage() });
const router = new Router();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});
const bucket = "gallery";
const supportedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

router.post("/storage/upload", upload.single("file"), async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const extension = path.extname(req.file.originalname);
  if (!supportedExtensions.includes(extension)) {
    return res.status(415).json({ message: "Unsupported Media Type" });
  }

  const filePath = `${req.user.id}/${crypto.randomUUID()}.${extension}`;
  const buffer = req.file.buffer;

  try {
    const bucketExists = await minioClient.bucketExists(bucket);

    if (!bucketExists) {
      await minioClient.makeBucket(bucket);
    }

    const fetchedPicture = await prisma.image.findFirst({
      where: { ownerId: req.user.id, place: Number(req.body.place) },
    });
    if (fetchedPicture) {
      return res.status(409).json({ message: "Picture already exists" });
    }

    await minioClient.putObject(bucket, filePath, buffer);
    await prisma.image.create({
      data: {
        path: filePath,
        ownerId: req.user.id,
        place: Number(req.body.place),
      },
    });

    res.json({ filePath });
  } catch (err) {
    res.status(500).json({ message: "Error uploading file to MinIO" });
  }
});

router.get("/storage/pictures/:userId", async (req, res) => {
  const images = await prisma.image.findMany({
    where: { ownerId: req.params.userId },
  });

  res.json({ images });
});

router.get("/storage/pictures/:userId/:filename", async (req, res) => {
  try {
    const bucketExists = await minioClient.bucketExists(bucket);

    if (!bucketExists) {
      return;
    }

    const objectName = req.params.userId + "/" + req.params.filename;
    const stat = await minioClient.statObject(bucket, objectName);
    res.type(req.params.filename);
    res.setHeader("Content-Length", stat.size);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${req.params.filename}"`
    );

    const fileStream = await minioClient.getObject(bucket, objectName);

    return fileStream.pipe(res);
  } catch (err) {
    res.status(404).json({ message: "File not exists" });
  }
});

router.post("/storage/pictures/:userId/:filename", async (req, res) => {
  if (!req.isAuthenticated() || req.user.id !== req.params.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    const bucketExists = await minioClient.bucketExists(bucket);

    if (!bucketExists) {
      return;
    }

    const objectName = req.params.userId + "/" + req.params.filename;
    await minioClient.removeObject(bucket, objectName);
    await prisma.image.delete({ where: { path: objectName } });
    return res.json({ ok: true });
  } catch (err) {
    res.status(404).json({ message: "File not exists" });
  }
});

export default router;
