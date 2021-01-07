import React, { useState } from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  avatar: {
    backgroundColor: "white",
    color: "black",
  },
}));

const DrawerItemsNav = ({ userType, handleDrawerClose }) => {
  
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
      <IconButton
        onClick={(evt) => {
          handleOpen(evt);
          handleDrawerClose();
        }}
      >
        <ExpandMoreIcon className={classes.avatar} />
      </IconButton>
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
        style={{
          marginTop: "10px", zIndex: "10001", borderRadius: "0px"
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <List className={classes.navList}>
          <MenuItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.navHeaderText }}
              primary="Item Catalog:"
            />
          </MenuItem>
          <MenuItem
            button
            onClick={handleClose}
            component={Link}
            to="/items/all"
          >
            <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Current" />
          </MenuItem>
          <MenuItem
            button
            onClick={handleClose}
            component={Link}
            to="/items/all"
          //to="/items/archive"
          >
            <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Archive" />
          </MenuItem>
        </List>
        <List className={classes.navList}>
          <MenuItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.navHeaderText }}
              primary="Programs:"
            />
          </MenuItem>
          {(userType === "field2" || userType === "super") && (
            <MenuItem
              button
              onClick={handleClose}
              component={Link}
              to="/programs/new"
            >
              <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Create Ad Hoc Program" />
            </MenuItem>
          )}
          <MenuItem
            button
            onClick={handleClose}
            component={Link}
            to="/programs"
          >
            <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Pre-Order Programs" />
          </MenuItem>
        </List>
        <List className={classes.navList}>
          <MenuItem>
            <ListItemText
              primaryTypographyProps={{ className: classes.navHeaderText }}
              primary="Compliance:"
            />
          </MenuItem>
          <MenuItem
            button
            onClick={handleClose}
            component={Link}
            to="/compliance/items"
          // accurate that we should be showing this to all users?
          >
            <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Item Rules" />
          </MenuItem>
          <MenuItem
            button
            onClick={handleClose}
            component={Link}
            to="/compliance/rules"
          // accurate that we should be showing this to all users?
          >
            <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="General Rules" />
          </MenuItem>
          {(userType === "compliance" || userType === "super") && (
            <MenuItem
              button
              onClick={handleClose}
              component={Link}
              to="/compliance/contacts"
            >
              <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Contacts" />
            </MenuItem>
          )}
        </List>
      </Menu>
    </>
  );
};

DrawerItemsNav.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default DrawerItemsNav;
