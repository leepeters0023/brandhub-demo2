import React, { useState } from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import NestedMenuItem from "./NestedMenuItem.js";

const DrawerItemsNav = ({ role, classes }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
    evt.stopPropagation(); //to ensure menu renders only above parent element
  }; //tried to handle these events at top level (TopDrawerNav) but was rendering all menus at once : (

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
          marginTop: "10px",
          zIndex: "3000",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem button onClick={handleClose} component={Link} to="/items/all">
          <ListItemText
            primaryTypographyProps={{
              className: classes.headerListItemNew,
            }}
            primary="Current Items"
          />
        </MenuItem>
        <MenuItem
          button
          onClick={handleClose}
          component={Link}
          to="/items/archive"
        >
          <ListItemText
            primaryTypographyProps={{
              className: classes.headerListItemNew,
            }}
            primary="Archived Items"
          />
        </MenuItem>
        <Divider className={classes.divider} />
        <NestedMenuItem
          anchorEl={anchorEl}
          handleClose={handleClose}
          label="Programs"
          classes={classes}
          childItems={[
            {
              link:
                role === "field2" || role === "super" ? "/programs/new" : null,
              primary:
                role === "field2" || role === "super"
                  ? "Create Ad Hoc Program"
                  : null,
              disabled: true,
            },
            {
              link: "/programs",
              primary: "Pre-Order Programs",
            },
          ]}
        />
        {/* <Divider className={classes.divider} key="divider1" />
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
              primary: "General Rules",
            },
            // {
            //   link:
            //     role === "compliance" || role === "super"
            //       ? "/compliance/contacts"
            //       : null,
            //   primary:
            //     role === "compliance" || role === "super" ? "Contacts" : null,
            // },
          ]}
        /> */}
      </Menu>
    </>
  );
};

DrawerItemsNav.propTypes = {
  classes: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
};

export default DrawerItemsNav;
