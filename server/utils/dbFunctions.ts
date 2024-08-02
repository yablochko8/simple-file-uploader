import { File } from "multer";
import { dbClient } from "./dbClient";

export const seeFilesInStorage = async (personId: number) => {
  const allItems = await dbClient.fileInStorage.findMany({
    where: {
      personId,
    },
  });
  return allItems;
};

export const saveUploadDetailsToDB = async (file: File, personId: number) => {
  const { originalname, bucket, key, size, mimetype } = file;

  console.log("newFileInStorage function called with file:", file);

  const newItem = await dbClient.fileInStorage.create({
    data: {
      originalname,
      bucket,
      key,
      size,
      mimetype,
      personId,
    },
  });

  return newItem;
};

// FROM TESTING - THIS IS WHAT MULTER FILE OBJECT LOOKS LIKE

// DATA I DEFINITELY CARE ABOUT

// originalname: "batou.png",
// bucket: "simple-file-uploader-jcc8aamx",
// key: "1722610758488-batou.png",
// size: 844006,
// mimetype: "image/png",

// DATA I DON'T CARE ABOUT

// location: "https://simple-file-uploader-jcc8aamx.s3.us-east-2.amazonaws.com/1722610758488-batou.png",
// fieldname: "thing",
// etag: "\"0bc6f1ae9c037cde7a56db6af6f73854\"",
// versionId: undefined,
// encoding: "7bit",
// acl: "private",
// contentType: "application/octet-stream",
// contentDisposition: null,
// contentEncoding: null,
// storageClass: "STANDARD",
// serverSideEncryption: null,
// metadata: {fieldName: "thing"},
