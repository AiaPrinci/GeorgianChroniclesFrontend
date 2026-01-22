import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [imagesToLoad, setImagesToLoad] = useState(0);

  const registerImage = () => {
    setImagesToLoad(prev => prev + 1);
  };

  const imageLoaded = () => {
    setImagesToLoad(prev => Math.max(0, prev - 1));
  };

  return (
    <LoadingContext.Provider value={{
      imagesToLoad,
      registerImage,
      imageLoaded,
      loading: imagesToLoad > 0
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);