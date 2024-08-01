import express from "express";
import cors from "cors";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3 } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

export const PORT = 4101;

const bucketName = "simple-file-uploader-jcc8aamx";
const regionName = "us-east-2";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

const app = express();

app.use(express.json());
app.use(cors());

const s3 = new S3({
  region: regionName,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

const multerUpload = multer({
  limits: {
    filesize: 5 * 1024 * 1024,
  },
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

app.get("/", async (req, res) => {
  console.log("GET endpoint called.");
  const data = await s3.listBuckets();
  if (data) {
    console.log("Response from AWS successfully recorded.");
  }
  console.log("data object is", data);
  const bucketNames = data.Buckets?.map((bucket) => bucket.Name) || [];
  console.log("bucketNames", bucketNames);
  res.json({ buckets: bucketNames });
});

app.post("/upload", multerUpload.single("thing"), async (req, res) => {
  res.send({ message: "File uploaded" });
});

// BOILERPLATE MATERIAL

const storedValues: string[] = [];

app.post("/newmessage", async (req, res) => {
  console.log("POST endpoint called.");
  const newMessage = req.body.message;
  storedValues.push(newMessage);
  res.json({ messages: storedValues });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
