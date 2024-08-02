import React from 'react';
import "./App.css";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import MyFiles from './pages/MyFiles';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPage(path);
  };

  let PageComponent: React.FC;
  switch (currentPage) {
    case '/upload':
      PageComponent = Upload;
      break;
    case '/myfiles':
      PageComponent = MyFiles;
      break;
    default:
      PageComponent = Home;
      break;
  }

  return (
    <div className="bg-gray-200 min-h-screen min-w-[80vw]">
      <nav className="flex justify-evenly bg-gray-300 p-5 mb-5">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/myfiles')}>My Files</button>
        <button onClick={() => navigate('/upload')}>Upload</button>
      </nav>
      <PageComponent />
    </div>
  );
};

export default App;
