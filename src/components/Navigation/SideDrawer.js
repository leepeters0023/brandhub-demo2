import React from "react";
import PropTypes from "prop-types";

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

SideDrawer.propTypes = {
  userType: PropTypes.string.isRequired,
};

export default SideDrawer;
