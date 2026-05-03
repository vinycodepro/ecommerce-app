import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      
      <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-gray-800 mb-6 animate-pulse">
        VINCY<span className="text-blue-500">SHOP</span>
      </h1>

      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 border-gray-200"></div>
        <div className="absolute h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>

  
      <p className="mt-6 text-sm sm:text-base text-gray-500 tracking-wide">
        Loading your shopping experience...
      </p>
  
      <div className="flex gap-1 mt-3">
        <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></span>
        <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce delay-150"></span>
        <span className="h-2 w-2 bg-blue-300 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
};

export default Loading;