import React from "react";

import UserBDM from "./UserBDM";
import UserCompliance from "./UserCompliance";


const SideDrawer = ({ handleDrawer, handleLogout, userType }) => {
  return (
    <>
      {userType === "bdm" && <UserBDM handleDrawer={handleDrawer} handleLogout={handleLogout} />}
      {userType === "compliance" && <UserCompliance handleDrawer={handleDrawer} handleLogout={handleLogout} />}
    </>
  );
};

export default SideDrawer;
