import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
// import NotificationsIcon from "@material-ui/icons/Notifications";
import HelpIcon from "@material-ui/icons/Help";
import AccountBoxIcon from "@material-ui/icons/AccountBox";

import businesswoman from "../../assets/businesswoman.png"

const UserNavMenu = ({ initials, handleLogout, classes, role }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Tooltip title="User Options">
        <IconButton
          aria-owns={anchorEl ? "notifications" : undefined}
          aria-haspopup="true"
          onClick={(evt) => {
            handleOpen(evt);
          }}
        >
          <Avatar className={classes.avatar} src={businesswoman}/>
        </IconButton>
      </Tooltip>
      <Menu
        disableScrollLock
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        style={{ marginTop: "10px", zIndex: "10001" }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {/* <MenuItem
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon>
            <NotificationsIcon color="secondary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </MenuItem>
        <Divider /> */}
        {role !== "supplier" && [
          <MenuItem
            key="profile"
            component={Link}
            to="/profile#general"
            onClick={() => {
              handleClose();
            }}
          >
            <ListItemIcon>
              <AccountBoxIcon color="secondary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>,
          <Divider key="divider1" />,
        ]}
        {role === "super" && [
          <MenuItem
            key="settings"
            component={Link}
            to="/settings#general"
            onClick={() => {
              handleClose();
            }}
          >
            <ListItemIcon>
              <SettingsIcon color="secondary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>,
          <Divider key="divider2" />,
        ]}
        <MenuItem
          component={Link}
          to="/help"
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon>
            <HelpIcon color="secondary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Help" />
        </MenuItem>
        <Divider />
        <MenuItem
          component={Link}
          to="/"
          onClick={() => {
            handleLogout();
            handleClose();
          }}
        >
          <ListItemIcon>
            <ExitToAppIcon color="secondary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </>
  );
};

UserNavMenu.propTypes = {
  initials: PropTypes.string,
  handleLogout: PropTypes.func.isRequired,
  role: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default UserNavMenu;
