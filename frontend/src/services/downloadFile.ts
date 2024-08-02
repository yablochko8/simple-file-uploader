import { getSingleFile } from "./getSingleFile";

export const downloadFileToDesktop = async (bucket: string, key: string) => {
  try {
    const blob = await getSingleFile(bucket, key);
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = key.split("/").pop() || "download";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      console.error("File not found");
    }
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};
