import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3 } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { saveUploadDetailsToDB, seeFilesInStorage } from "./utils/dbFunctions";
dotenv.config();

import {
  clerkClient,
  ClerkExpressWithAuth,
  ClerkMiddlewareOptions,
  LooseAuthProp,
  WithAuthProp,
} from "@clerk/clerk-sdk-node";

interface MulterRequest extends Request {
  file?: File;
}

export const PORT = 4101;

const bucketName = "simple-file-uploader-jcc8aamx";
const regionName = "us-east-2";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

const clerkOptions: ClerkMiddlewareOptions = {
  // publishableKey: process.env.CLERK_PUBLISHABLE_KEY || "",
  // secretKey: process.env.CLERK_SECRET_KEY || "",
};

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
app.use(ClerkExpressWithAuth());
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
  // ClerkExpressWithAuth(clerkOptions),
  async (req: WithAuthProp<Request>, res: Response) => {
    console.log("/files/person/:personId called");
    const personId = req.params.personId;
    const token = req.headers.authorization;
    console.log("token", token);

    // FOR NOW - RETURN AN EMPTY ARRAY IF NO TOKEN IS PROVIDED
    if (!token) {
      return res.json({ myfiles: [] });
      // return res.status(401).json({ error: "No token provided" });
    }

    try {
      console.log("user", req.auth.userId);
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ error: "Invalid token" });
    }
    console.log(`/files/person/${personId} GET endpoint called.`);

    const data = await seeFilesInStorage(Number(personId));
    if (data) {
      console.log("Response from Database was successful.");
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
      const newItem = await saveUploadDetailsToDB(req.file, 1);
    } else {
      console.log("/upload endpoint... No file found.");
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
