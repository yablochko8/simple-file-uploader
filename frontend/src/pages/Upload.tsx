import React from 'react';

/**
 * Upload page: shows a rounded box that a user can drag and drop a file into and click upload
 */
const Upload: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('Dragging (enter)');
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('Dragging (leave)');
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('Dragging (over)');
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('Dropping');
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      // TODO: Implement file upload logic
      console.log("Uploading file:", file.name, "(FAKE NEWS)");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        className={`w-64 h-64 border-4 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
          }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p className="text-lg mb-2">Drag & Drop File Here</p>
        <p className="text-sm text-gray-500">or</p>
        <label className="mt-2 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
          Select File
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      {file && (
        <div className="mt-4">
          <p className="text-sm">{file.name}</p>
          <button
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;