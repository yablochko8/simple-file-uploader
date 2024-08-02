import { serverPath } from "../utils/config";

export const sendFileForUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("thing", file);
  const response = await fetch(`${serverPath}/upload`, {
    method: "POST",
    body: formData,
  });
  const json = await response.json();
  console.log("The server response was:", json);
  return json; // unused here
};
