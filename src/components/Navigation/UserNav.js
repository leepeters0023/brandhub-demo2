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
import { makeStyles } from "@material-ui/core/styles";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import NotificationsIcon from "@material-ui/icons/Notifications";
import HelpIcon from "@material-ui/icons/Help";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  avatar: {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const UserNavMenu = ({ initials, handleLogout }) => {
  const classes = useStyles();

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
          onClick={handleOpen}
        >
          <Avatar className={classes.avatar}>{initials}</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        style={{ marginTop: "10px" }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon>
            <NotificationsIcon color="secondary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </MenuItem>
        <Divider />
        <MenuItem
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
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose();
          }}
        >
          <ListItemIcon>
            <PictureAsPdfIcon color="secondary" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Current PDF" />
        </MenuItem>
        <Divider />
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
          to="/login"
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
};

export default UserNavMenu;
