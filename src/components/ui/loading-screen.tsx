import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 animate-fade-in">
      <img
        src="/favicon.png"
        alt="Loading"
        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 animate-pulse-opacity"
      />
    </div>
  );
};

export default LoadingScreen;
