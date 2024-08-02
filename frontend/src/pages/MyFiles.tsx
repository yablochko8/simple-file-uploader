import React, { useEffect, useState } from 'react';
import { getFiles, MyFile } from '../services/getFiles';
import { getSingleFile } from '../services/getSingleFile';



const localPersonId = 1;
/**
 * MyFiles page: shows you all your files
 */
const MyFiles: React.FC = () => {
  const [myFiles, setMyFiles] = useState<MyFile[]>([]);
  const [myFilesImageBlobs, setMyFilesImageBlobs] = useState<Blob[]>([]);

  useEffect(() => {
    getFiles(localPersonId).then((data) => setMyFiles(data));
    console.log("HBCAK this stage reached.")
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
        <div key={file.key} className="bg-white shadow-md rounded-lg p-4 mb-4 w-full max-w-md">
          {myFilesImageBlobs.length > index && (
            <img src={URL.createObjectURL(myFilesImageBlobs[index])} alt={file.originalname} />
          )}
          <h3 className="text-lg font-semibold mb-2">{file.originalname}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><span className="font-medium">Size:</span> {(file.size / 1024).toFixed(2)} KB</p>
            <p><span className="font-medium">Type:</span> {file.mimetype}</p>
            <p><span className="font-medium">Bucket:</span> {file.bucket}</p>
            <p><span className="font-medium">Key:</span> {file.key}</p>
            <p><span className="font-medium">Person ID:</span> {file.personId}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyFiles;