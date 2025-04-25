import React from "react";

const Wrapper = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-blue text-custom-white overflow-y-hidden">
      {children}
    </div>
  );
};

export default Wrapper;
