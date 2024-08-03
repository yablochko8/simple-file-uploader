import React, { useEffect, useState } from 'react';
import { sendFileForUpload } from '../services/sendFileForUpload';
import { useAuth } from '@clerk/clerk-react';

/**
 * Upload page: shows a rounded box that a user can drag and drop a file into and click upload
 */
const Upload: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const { getToken } = useAuth();
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionToken = async () => {
      const token = await getToken();
      setSessionToken(token);
    };

    fetchSessionToken();
  }, [getToken]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('Dragging (enter)');
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('Dragging (leave)');
    e.preventDefault();
    e.stopPropagation();
    // Vital: must confirm the element the dragging cursor has moved onto (relatedTarget) is
    // not a child of the element it is moving off of (currentTarget)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
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

  const handleUpload = async () => {
    if (!sessionToken) {
      console.error("No session token found.");
      return;
    }
    if (!file) {
      console.error("No file found.");
      return;
    }
    console.log("Attempting to upload file:", file.name, file.size);
    const response = await sendFileForUpload(sessionToken, file);
    console.log("The server response was:", response);
  };

  const dragFunctions = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vw] bg-gray-100">
      <div
        className={`w-[80%] h-[60vh] border-4 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
          }`}
        {...dragFunctions}
      >
        <div className="text-lg mb-2">Drag & Drop File Here</div>
        <div className="text-sm text-gray-500">or</div>
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