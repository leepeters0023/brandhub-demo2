import React, { useState, useRef, useImperativeHandle } from "react";
import { Link } from "@reach/router";
import PropTypes from "prop-types";

import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import ArrowRight from '@material-ui/icons/ArrowRight'

import NestedMenuItem from "material-ui-nested-menu-item";

const DrawerItemsNav = ({ role, classes, ref }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

  const handleOpen = (evt) => {
    setAnchorEl(evt.target);
    evt.stopPropagation(); //to ensure menu renders only above parent element
  };   //tried to handle these events at top level (TopDrawerNav) but was rendering all menus at once : (

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFocus = (event) => {
      setIsSubMenuOpen(true)
  }
  const handleMouseEnter = (event) => {
    setIsSubMenuOpen(true)
  }
  const handleMouseLeave = (event) => {
    setIsSubMenuOpen(false)
  }

  const open = isSubMenuOpen && anchorEl

  const menuItemRef = useRef(null)
  const menuContainerRef = useRef(null)
  
  useImperativeHandle(ref, () => menuItemRef.current)

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
        <div
          //ref={containerRef}
          onFocus={handleFocus}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <MenuItem
            ref={menuItemRef}
          >
            Test
            <ArrowRight />
          </MenuItem>
          <Menu
            style={{ pointerEvents: 'none' }}
            anchorEl={menuItemRef.current}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            open={open}
            autoFocus={false}
            disableAutoFocus
            disableEnforceFocus
            onClose={() => {
              setIsSubMenuOpen(false)
            }}
          >
            <div ref={menuContainerRef} style={{ pointerEvents: 'auto' }}>
              <MenuItem>Test</MenuItem>
            </div>
          </Menu>
        </div>

        <NestedMenuItem
          className={classes.headerListItem}
          parentMenuOpen={Boolean(anchorEl)}
          onClick={handleClose}
          label="Item Catalog"
        >
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
        </NestedMenuItem>
        <Divider className={classes.divider} />
        <NestedMenuItem
          className={classes.headerListItem}
          parentMenuOpen={Boolean(anchorEl)}
          onClick={handleClose}
          label="Programs"
        >
          {(role === "field2" || role === "super") && (
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
        </NestedMenuItem>
        <Divider className={classes.divider} key="divider1" />
        <NestedMenuItem
          className={classes.headerListItem}
          parentMenuOpen={Boolean(anchorEl)}
          onClick={handleClose}
          label="Compliance"
        >
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
          {(role === "compliance" || role === "super") && (
            <MenuItem
              button
              onClick={handleClose}
              component={Link}
              to="/compliance/contacts"
            >
              <ListItemText primaryTypographyProps={{ className: classes.headerListItem }} primary="Contacts" />
            </MenuItem>
          )}
        </NestedMenuItem>
      </Menu>
    </>
  );
};

DrawerItemsNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default DrawerItemsNav;
