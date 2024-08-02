import { serverPath } from "../utils/config";

export const getSingleFile = async (bucket: string, key: string) => {
  try {
    const response = await fetch(`${serverPath}/download/${bucket}/${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const blob = await response.blob();
      return blob;
    } else {
      console.error("Error fetching file:", response.statusText);
    }
  } catch (error) {
    console.error("Error in getSingleFile:", error);
    throw error;
  }
};
