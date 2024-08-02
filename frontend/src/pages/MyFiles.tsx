import React, { useEffect, useState } from 'react';
import { getFiles, MyFile } from '../services/getFiles';
import { getSingleFile } from '../services/getSingleFile';
import { displayFileSize } from '../services/displayFileSize';
import { downloadFileToDesktop } from '../services/downloadFile';



const localPersonId = 1;
/**
 * MyFiles page: shows you all your files
 */
const MyFiles: React.FC = () => {
  const [myFiles, setMyFiles] = useState<MyFile[]>([]);
  const [myFilesImageBlobs, setMyFilesImageBlobs] = useState<Blob[]>([]);

  useEffect(() => {
    getFiles(localPersonId).then((data) => setMyFiles(data));
    console.log("HZBCAK useEffect called.")
    // getSingleFile(myFiles[0].bucket, myFiles[0].key).then((data) => console.log("getSingleFile output", data));

  }, []);


  useEffect(() => {
    if (myFiles.length > 0) {
      Promise.all(myFiles.map(file => getSingleFile(file.bucket, file.key)))
        .then(blobs => {
          const validBlobs = blobs.filter(blob => blob !== undefined) as Blob[];
          setMyFilesImageBlobs(validBlobs);
        })
        .catch(error => {
          console.error("Error fetching files:", error);
        });
    }
  }, [myFiles]);


  return (
    <div className="flex flex-col items-center justify-center min-h-[80vw] bg-gray-100">
      This is the MyFiles page
      {myFiles.map((file, index) => (
        <div key={file.key} className="bg-white shadow-md rounded-lg p-4 mb-4 w-full max-w-md flex items-center">
          <div className="mr-4 w-24 h-24 flex-shrink-0">
            {myFilesImageBlobs.length > index && (
              <img
                src={URL.createObjectURL(myFilesImageBlobs[index])}
                alt={file.originalname}
                className="w-full h-full object-cover rounded"
              />
            )}
          </div>
          <div className="flex-grow">
            <div className="text-lg font-semibold mb-2">{file.originalname}</div>
            <div className="text-sm">
              <p><span className="font-medium">Size:</span> {displayFileSize(file.size)}</p>
              <p><span className="font-medium">Type:</span> {file.mimetype}</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => downloadFileToDesktop(file.bucket, file.key)}
            >
              Download
            </button>
          </div>
        </div>

      ))}
    </div>
  );
};

export default MyFiles;