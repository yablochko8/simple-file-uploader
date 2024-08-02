import React, { useEffect, useState } from 'react';
import { getFiles, MyFile } from '../services/getFiles';



const localPersonId = 1;
/**
 * MyFiles page: shows you all your files
 */
const MyFiles: React.FC = () => {
  const [myFiles, setMyFiles] = useState<MyFile[]>([]);

  useEffect(() => {
    getFiles(localPersonId).then((data) => setMyFiles(data));
    console.log("HBCAK this stage reached.")
  }, []);




  return (
    <div className="flex flex-col items-center justify-center min-h-[80vw] bg-gray-100">
      This is the MyFiles page
      {myFiles.map((file) => (
        <div key={file.key}>
          {file.originalname}
          {file.size}
          {file.mimetype}
          {file.bucket}
          {file.key}
          {file.personId}
        </div>
      ))}
    </div>
  );
};

export default MyFiles;