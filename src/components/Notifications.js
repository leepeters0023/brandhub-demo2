import React, { useState } from "react";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

import NotificationsIcon from "@material-ui/icons/Notifications";

let notifications = [
  {
    read: false,
    content: "Cillum adipisicing dolore ipsum sit pariatur.",
  },
  {
    read: false,
    content: "Cillum adipisicing dolore ipsum sit pariatur.",
  },
  {
    read: false,
    content: "Cillum adipisicing dolore ipsum sit pariatur.",
  },
  {
    read: false,
    content: "Cillum adipisicing dolore ipsum sit pariatur.",
  },
  {
    read: false,
    content: "Cillum adipisicing dolore ipsum sit pariatur.",
  },
  {
    read: false,
    content: "Cillum adipisicing dolore ipsum sit pariatur.",
  },
  {
    read: false,
    content: "Cillum adipisicing dolore ipsum sit pariatur.",
  },
  {
    read: false,
    content: "Cillum adipisicing dolore ipsum sit pariatur.",
  },
];

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onMenuOpened = () => {
    if (notifications.filter((not) => not.read === false).length > 0)
      notifications = notifications.map((not) => ({read: true, content: not.content}));
  };

  let notificationsIcon;
  if (notifications && notifications.length > 0) {
    notifications.filter((not) => not.read === false).length > 0
      ? (notificationsIcon = (
          <Badge
            badgeContent={
              notifications.filter((not) => not.read === false).length
            }
            color="secondary"
          >
            <NotificationsIcon fontSize="large" />
          </Badge>
        ))
      : (notificationsIcon = <NotificationsIcon fontSize="large" />);
  } else {
    notificationsIcon = <NotificationsIcon fontSize="large" />;
  }

  let notificationsMarkup =
    (notifications && notifications.length) > 0 ? (
      notifications.map((not, index) => {
        return (
          <MenuItem key={index} onClick={handleClose}>
            <Typography color="inherit" variant="body1">
              {not.content}
            </Typography>
          </MenuItem>
        );
      })
    ) : (
      <MenuItem onClick={handleClose}>
        <Typography color="inherit" variant="body1">
          No new notifications...
        </Typography>
      </MenuItem>
    );

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          aria-owns={anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          {notificationsIcon}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onEntered={onMenuOpened}
      >
        {notificationsMarkup}
      </Menu>
    </>
  );
};

export default Notifications;
