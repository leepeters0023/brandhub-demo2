import React, { useState } from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

import NestedMenuItem from "material-ui-nested-menu-item";

const useStyles = makeStyles((theme) => ({
  ...theme.global,
  expandMoreIcon: {
    marginRight: "20px",
    color: "white",
    "&&:hover": {
      cursor: "pointer",
    },
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
        onMouseEnter={(evt) => {
          handleOpen(evt);
        }}
      >
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
          marginTop: "10px", zIndex: "10001"
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
        <Divider/>
        <MenuItem
          button
          onClick={handleClose}
          component={Link}
          to="/items/all"
        >
          <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Current" />
        </MenuItem>
        <NestedMenuItem style={{zIndex: "20002"}} label="nestedMenu" parentMenuOpen={!!anchorEl}>
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
        >
          <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Current" />
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
        <MenuItem
          button
          menuItems={[
            <MenuItem primaryText="Show Level 2" />,
            <MenuItem primaryText="Show Level 2" />,
            <MenuItem primaryText="Show Level 2" />,
          ]}
          >
            <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="menu test" />
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
