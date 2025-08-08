import React from "react";
import { Outlet } from "react-router-dom";
import MainFooter from "../common/Footers/MainFooter";
import StudentHomeHeader from "../common/Headers/StudentHomeHeader";

const MainNavbarLayout = () => {
  return (
    <>
      <StudentHomeHeader />
      <main>
        <Outlet />
      </main>
      <MainFooter />
    </>
  );
};

export default MainNavbarLayout;
