import React from "react";

import UserField from "./UserField";
import UserCompliance from "./UserCompliance";
import UserSuper from "./UserSuper";


const SideDrawer = ({ userType }) => {
  return (
    <>
      {userType === "super" && <UserSuper />}
      {userType === "field1" && <UserField />}
      {userType === "field2" && <UserField />}
      {userType === "compliance" && <UserCompliance />}
    </>
  );
};

export default SideDrawer;
