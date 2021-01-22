import React, { useState } from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import CircularProgress from "@material-ui/core/CircularProgress";

const DrawerOrdersNav = ({ classes }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const isLoading = useSelector((state) => state.suppliers.isInitialLoading);
  const navValues = useSelector((state) => state.suppliers.navValues);

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
    evt.stopPropagation();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        style={{ padding: 0 }}
        onClick={(evt) => {
          handleOpen(evt);
          evt.stopPropagation();
        }}
      >
        <Typography variant="h5" className={classes.navigationText}>
          Quotes
        </Typography>
        <ExpandMoreIcon fontSize="large" className={classes.expandMoreIcon} />
      </IconButton>
      <Menu
        classes={{ paper: classes.menuBackground }}
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
        style={{
          marginTop: "10px",
          zIndex: "3000",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          button
          onClick={handleClose}
          component={Link}
          to="/purchasing/rfqHistory/new"
        >
          <ListItemText
            primaryTypographyProps={{ className: classes.headerListItem }}
            primary="New:"
          />
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              {isLoading ? <CircularProgress size={20} /> : navValues.newRFQ}
            </Avatar>
          </ListItemAvatar>
        </MenuItem>
        <Divider className={classes.divider} />
        <MenuItem
          button
          onClick={handleClose}
          component={Link}
          to="/purchasing/rfqHistory/inProgress"
        >
          <ListItemText
            primaryTypographyProps={{ className: classes.headerListItem }}
            primary="In Progress:"
          />
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              {isLoading ? (
                <CircularProgress size={20} />
              ) : (
                navValues.inProgressRFQ
              )}
            </Avatar>
          </ListItemAvatar>
        </MenuItem>
        <Divider className={classes.divider} key="divider2" />
        <MenuItem
          button
          onClick={handleClose}
          component={Link}
          to="/purchasing/rfqHistory/awarded"
        >
          <ListItemText
            primaryTypographyProps={{ className: classes.headerListItem }}
            primary="Awarded:"
          />
          <ListItemAvatar>
          <Avatar className={classes.avatar}>
              {isLoading ? (
                <CircularProgress size={20} />
              ) : (
                navValues.awardedRFQ
              )}
            </Avatar>
          </ListItemAvatar>
        </MenuItem>
        <Divider className={classes.divider} key="divider3" />
        <MenuItem
          button
          onClick={handleClose}
          component={Link}
          to="/purchasing/rfqHistory/all"
        >
          <ListItemText
            primaryTypographyProps={{ className: classes.headerListItem }}
            primary="History"
          />
        </MenuItem>
      </Menu>
    </>
  );
};

DrawerOrdersNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default DrawerOrdersNav;
