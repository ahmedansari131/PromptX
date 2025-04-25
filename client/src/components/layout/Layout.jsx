import React from "react";
import { Wrapper } from "../../components";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="text-2xl">
      <Wrapper>
        <div className="absolute inset-0 bg-gradient-to-r from-[#4BDFEC] via-[#3BC1DC] to-[#34AAD0] w-[200px] h-[300px] rounded-full blur-[200px] z-[1005] -top-32 left-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-[1007]">
          <Outlet />
        </div>
      </Wrapper>
    </div>
  );
};

export default Layout;
