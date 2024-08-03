import { serverPath } from "../utils/config";

export type MyFile = {
  originalname: string;
  size: number;
  mimetype: string;
  bucket: string;
  key: string;
  personId: number;
};

export const getFiles = async (token: string): Promise<MyFile[]> => {
  const response = await fetch(`${serverPath}/myfiles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  console.log("The server response was:", json.myfiles);

  // parse json.myfiles to match type
  const myFiles: MyFile[] = json.myfiles;

  return myFiles;
};
