import React from "react";

import UserBDM from "./UserBDM";
import UserCompliance from "./UserCompliance";


const SideDrawer = ({ handleLogout, userType }) => {
  return (
    <>
      {userType === "bdm" && <UserBDM handleLogout={handleLogout} />}
      {userType === "compliance" && <UserCompliance handleLogout={handleLogout} />}
    </>
  );
};

export default SideDrawer;
