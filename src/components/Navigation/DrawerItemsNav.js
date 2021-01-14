import React, { useState } from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import NestedMenuItem from "material-ui-nested-menu-item";

const DrawerItemsNav = ({ userType, classes }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
    evt.stopPropagation(); //renders menu next to unique child element instead of fixed position of parent container
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  //tried to handle these at top level but was rendering all menus at once : (

  return (
    <>
      <IconButton
        onClick={(evt) => {
          handleOpen(evt);
        }}
      >
        <Typography variant="h5" className={classes.navigationText}>
                    Items
               </Typography>
        <ExpandMoreIcon fontSize="large" className={classes.expandMoreIcon} />
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
          marginTop: "10px"
          //TODO remove padding from MuiList-root MuiMenu-list MuiList-padding
        }}
        classes={{ root: 'menuBackground' }} // this sometimes works
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <ListItemText
          primaryTypographyProps={{ className: classes.headerText }}
          primary="Item Catalog:"
        />
        <Divider />
        <MenuItem
          button
          onClick={handleClose}
          component={Link}
          to="/items/all"
        >
          <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Current" />
        </MenuItem>
        <NestedMenuItem
          label="Nested Menu"
          parentMenuOpen={anchorEl}
          onClick={handleClose}
        >
          <MenuItem
            button
            onClick={handleClose}
            component={Link}
            to="/items/all"
          >
            <ListItemText className={classes.nested} primary="Test Nested Menu" />
          </MenuItem>
        </NestedMenuItem>
        <MenuItem
          button
          onClick={handleClose}
          component={Link}
          to="/items/all"
        //to="/items/archive"
        >
          <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Archive" />
        </MenuItem>
        <ListItemText
          primaryTypographyProps={{ className: classes.headerText }}
          primary="Programs:"
        />
        <Divider key="divider1" />
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
        <ListItemText
          primaryTypographyProps={{ className: classes.headerText }}
          primary="Compliance:"
        />
        <Divider key="divider1" />
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
      </Menu>
    </>
  );
};

DrawerItemsNav.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default DrawerItemsNav;
