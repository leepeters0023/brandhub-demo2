import React, { useState } from "react";
import PropTypes from "prop-types";

import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import NestedMenuItem from "./NestedMenuItem.js";

const DrawerItemsNav = ({ role, classes, }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
    evt.stopPropagation(); //to ensure menu renders only above parent element
  };   //tried to handle these events at top level (TopDrawerNav) but was rendering all menus at once : (

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={(evt) => {
          handleOpen(evt);
          evt.stopPropagation();
        }}
      >
        <Typography variant="h5" className={classes.navigationText}>
          Items
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
          marginTop: "10px"
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <NestedMenuItem
          anchorEl={anchorEl}
          handleClose={handleClose}
          label="Item Catalog"
          classes={classes}
          childItems={[
            {
              link: "/items/all",
              primary: "Current"
            },
            {
              link: "/items/archive",
              primary: "Archive"
            },
          ]}
        />
        <Divider className={classes.divider} />
        <NestedMenuItem
          anchorEl={anchorEl}
          handleClose={handleClose}
          label="Programs"
          classes={classes}
          childItems={[
            {
              link: (role === "field2" || role === "super") ? "/programs/new" : null,
              primary: (role === "field2" || role === "super") ? "Create Ad Hoc Program" : null,
            },
            {
              link: "/programs",
              primary: "Pre-Order Programs"
            },
          ]}
        />
        <Divider className={classes.divider} key="divider1" />
        <NestedMenuItem
          anchorEl={anchorEl}
          handleClose={handleClose}
          label="Compliance"
          classes={classes}
          childItems={[
            {
              link: "/compliance/items",
              primary: "Item Rules",
            },
            {
              link: "/compliance/rules",
              primary: "General Rules"
            },
            {
              link: (role === "compliance" || role === "super") ? "/compliance/contacts" : null,
              primary: (role === "compliance" || role === "super") ? "Contacts" : null,
            },
          ]}
        />
      </Menu>
    </>
  );
};

DrawerItemsNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default DrawerItemsNav;
