import { serverPath } from "../utils/config";

export const sendFileForUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("thing", file);
  const response = await fetch(`${serverPath}/upload`, {
    method: "POST",
    body: formData,
  });
  const json = await response.json();
  return json;
};
