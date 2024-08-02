export const displayFileSize = (size: number) => {
  if (size > 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (size / 1024).toFixed(0) + " KB";
  }
};
