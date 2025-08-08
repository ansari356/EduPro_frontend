import React from "react";
import { Outlet } from "react-router-dom";
import MainHeader from "../common/Headers/MainHeader";
import MainFooter from "../common/Footers/MainFooter";

const MainNavbarLayout = () => {
  return (
    <>
      <MainHeader />
      <main>
        <Outlet />
      </main>
      <MainFooter />
    </>
  );
};

export default MainNavbarLayout;
