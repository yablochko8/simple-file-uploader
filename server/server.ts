import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3 } from "@aws-sdk/client-s3";
import { saveUploadDetailsToDB, seeFilesInStorage } from "./utils/dbFunctions";
import { ClerkExpressWithAuth, LooseAuthProp } from "@clerk/clerk-sdk-node";
import { optionalUser } from "./services/authMiddleware";
import dotenv from "dotenv";
dotenv.config();

const personId = 2;

interface MulterRequest extends Request {
  file?: File;
}

export const PORT = 4101;

const bucketName = "simple-file-uploader-jcc8aamx";
const regionName = "us-east-2";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

const publishableKey = process.env.CLERK_PUBLISHABLE_KEY || "";
const secretKey = process.env.CLERK_SECRET_KEY || "";

const app = express();

declare global {
  namespace Express {
    interface Request extends LooseAuthProp {}
  }
}

// req.user = await prisma.user.findUnique({ where: { id: req.auth.userId } });

// req.auth = { ...abunchofusefulclerkinfo }
app.use(cors());
app.use(express.json());
app.use(ClerkExpressWithAuth());
app.use(optionalUser);

const s3 = new S3({
  region: regionName,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

const multerUpload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max size for upload
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
  const bucketNames = data.Buckets?.map((bucket) => bucket.Name) || [];
  console.log("bucketNames", bucketNames);
  res.json({ buckets: bucketNames });
});

app.get(
  "/files/person/:personId",
  (req, res, next) => {
    console.log("files/person/:personId middleware called");
    next();
  },
  async (req, res) => {
    console.log("/files/person/:personId called");
    console.log("req.auth is", req.auth?.userId);

    if (!req.auth?.userId) {
      console.log("No auth found from Clerk token provided");
      // Alt option: return an empty array if no token provided
      // return res.json({ myfiles: [] });
      return res.status(401).json({ error: "No token provided" });
    }
    const personId = req.params.personId;
    console.log(`/files/person/${personId} GET endpoint called.`);

    const data = await seeFilesInStorage(Number(personId));
    if (data) {
      console.log(`Response from Database. ${data.length} files found.`);
    }
    res.json({ myfiles: data });
  }
);

app.post(
  "/upload",
  multerUpload.single("thing"),
  async (req: MulterRequest, res: Response) => {
    // Console log the file details
    if (req.file) {
      console.log("Will now attempt to send to database");
      const newItem = await saveUploadDetailsToDB(req.file, personId);
      console.log("Upload recored in data base with id", newItem.id);
    } else {
      res.status(400).json({ error: "No file found in request." });
    }
    res.send({ message: "File uploaded" });
  }
);

app.post("/download/:bucket/:key", async (req, res) => {
  console.log("download/:bucket/:key POST endpoint called.");
  const bucket = req.params.bucket;
  const key = req.params.key;
  console.log(`/download/${bucket}/${key} POST endpoint called.`);
  const data = await s3.getObject({ Bucket: bucket, Key: key });
  if (data.Body) {
    const fileBuffer = await data.Body?.transformToByteArray();
    res.end(fileBuffer, "binary");
  }
});

// TEST ENDPOINT PROBABABLY NOT NEEDED

app.get("/files/:bucketName", async (req, res) => {
  const bucketName = req.params.bucketName;
  console.log(`/files/${bucketName} GET endpoint called.`);

  const data = await s3.listBuckets();
  if (data) {
    console.log("Response from AWS successfully recorded.");
  }
  const bucketNames = data.Buckets?.map((bucket) => bucket.Name) || [];
  console.log("bucketNames", bucketNames);
  res.json({ buckets: bucketNames });
});

// OLD BOILERPLATE MATERIAL

const storedValues: string[] = [];

app.post("/newmessage", async (req, res) => {
  console.log("POST endpoint called.");
  const newMessage = req.body.message;
  storedValues.push(newMessage);
  res.json({ messages: storedValues });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
