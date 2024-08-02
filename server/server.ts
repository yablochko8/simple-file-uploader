import express, { Request, Response } from "express";
import cors from "cors";
import multer, { FileArray, File } from "multer";
import multerS3 from "multer-s3";
import { S3 } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { newFileInStorage } from "./utils/dbFunctions";
dotenv.config();

interface MulterRequest extends Request {
  file?: File;
}

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
    fileSize: 5 * 1024 * 1024,
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

app.get("/files/:bucketName", async (req, res) => {
  const bucketName = req.params.bucketName;
  console.log(`/files/${bucketName} GET endpoint called.`);

  const data = await s3.listBuckets();
  if (data) {
    console.log("Response from AWS successfully recorded.");
  }
  console.log("data object is", data);
  const bucketNames = data.Buckets?.map((bucket) => bucket.Name) || [];
  console.log("bucketNames", bucketNames);
  res.json({ buckets: bucketNames });
});

app.post(
  "/upload",
  multerUpload.single("thing"),
  async (req: MulterRequest, res: Response) => {
    // Console log the file details
    if (req.file) {
      console.log("Will now attempt to send to database");
      const newItem = await newFileInStorage(req.file, 1);
      console.log("database response:", newItem);
      console.log("/upload endpoint... File details:", req.file);
    } else {
      console.log("/upload endpoint... No file found.");
    }

    res.send({ message: "File uploaded" });
  }
);

// OLD BOILERPLATE MATERIAL

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
